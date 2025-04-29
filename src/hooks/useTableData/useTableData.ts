import { useEffect, useState } from "react";
import { Toast } from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS } from "@/common/constants";

interface useTableDataProps {
  serviceInfo: {
    service?: any;
    dataArgument: string;
    beforeService?: () => void;
    afterService?: () => void;
    body?: any;
  };
}

interface tablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export const useTableData = ({ serviceInfo }: useTableDataProps) => {
  const [tableData, setTableData] = useState([]);
  const [errorTableMessage, setErrorTableMessage] = useState("");
  const [tablePagination, setTablePagination] = useState<tablePaginationProps>({
    currentPage: 0,
    totalPages: 0,
    itemsPerPage: 30,
    totalItems: 100,
  });

  const onPageChange = (page: number) => {
    setTablePagination((prev) => {
      const newPagination = { ...prev, currentPage: page };
      fetchInitialData({ tablePaginationProp: newPagination });
      return newPagination;
    });
  };

  const onItemsPerPageChange = (pages: number) => {
    setTablePagination((prev) => {
      const newPagination = { ...prev, currentPage: 0, itemsPerPage: pages };
      fetchInitialData({ tablePaginationProp: newPagination });
      return newPagination;
    });
  };

  const tableProperties = {
    $data: tableData,
    $currentPage: tablePagination?.currentPage,
    $totalPages: tablePagination?.totalPages,
    $itemsPerPage: tablePagination?.itemsPerPage,
    $totalItems: tablePagination?.totalItems,
    $onPageChange: onPageChange,
    $onItemsPerPageChange: onItemsPerPageChange,
    $onSelectionChange: () => {},
    $onSort: () => () => {},
    $itemsPerPageOptions: [10, 20, 50, 100],
    $variants: ["headerGray", "withShadow", "stripedRows"],
  };

  const fetchInitialData = async ({
    tablePaginationProp,
  }: {
    tablePaginationProp?: tablePaginationProps;
  } = {}) => {
    if (!serviceInfo) return;
    setErrorTableMessage("");
    const pagination = tablePaginationProp || tablePagination;
    const { service, dataArgument, beforeService, afterService, body } =
      serviceInfo;
    beforeService && beforeService();
    try {
      const response = await service({
        ...body,
        page: {
          size: pagination.itemsPerPage,
          page:
            pagination.currentPage > 0
              ? pagination.currentPage - 1
              : pagination.currentPage,
        },
      });
      if (response?.status?.statusCode === 200) {
        setTableData(response.data[dataArgument]);
        const { totalElement, totalPage, actualPage } = response.data.page;
        setTablePagination((prev) => ({
          ...prev,
          totalItems: totalElement,
          currentPage: totalPage >= 0 ? actualPage + 1 : actualPage,
          totalPages: totalPage >= 0 ? totalPage + 1 : totalPage,
        }));
        Toast.showStatusCode(200);
      } else {
        Toast.showStatusCode(response?.status?.statusCode || 400);
        setErrorTableMessage(response?.status?.statusDescription);
      }
    } catch (error: any) {
      error?.message && setErrorTableMessage(error?.message);
      error?.status && Toast.showStatusCode(error?.status);
    } finally {
      tableData.length === 0 &&
        setErrorTableMessage(COMMON_LABELS.NO_INFORMATION);
      afterService && afterService();
    }
  };

  useEffect(() => {
    Toast.init();
  }, []);

  return {
    tableProperties,
    setTablePagination,
    tableData,
    setTableData,
    errorTableMessage,
    setErrorTableMessage,
    fetchInitialData,
  };
};
