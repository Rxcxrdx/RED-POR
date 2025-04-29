import React, { useEffect, useState, useCallback } from "react";
import { AfilliateListView } from "./AfilliateListView";

interface AffiliateRawData {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  afiliadoFondoId: string;
}

interface ApiResponse {
  data: {
    suscriptor: AffiliateRawData[];
    page: {
      totalElement: number;
      totalPage: number;
      size: number;
      page: number;
    };
  };
  status?: {
    statusCode: number;
    message?: string;
  };
}

interface AffiliateListProps {
  modalTitle?: string;
  getData: (page: number, pageSize: number) => Promise<ApiResponse>;
  isModalOpen: boolean;
  onCloseModal: () => void;
  initialPageSize?: number;
  setSelectedAffiliate: (affiliate: any) => void;
}

export const AffiliateList: React.FC<AffiliateListProps> = ({
  modalTitle = "Resultados",
  getData,
  isModalOpen,
  onCloseModal,
  initialPageSize = 10,
  setSelectedAffiliate,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: initialPageSize,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (page: number, pageSize: number = pagination.pageSize) => {
      if (page < 1) page = 1;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getData(page - 1, pageSize);

        if (response?.data?.suscriptor) {
          const formattedData = response.data.suscriptor.map((s) => ({
            tipoId: s.tipoIdentificacion ?? "-",
            identificacion: s.numeroIdentificacion ?? "-",
            primerApellido: s.primerApellido ?? "-",
            segundoApellido: s.segundoApellido ?? "-",
            primerNombre: s.primerNombre ?? "-",
            segundoNombre: s.segundoNombre ?? "-",
            afiliadoFondoId: s.afiliadoFondoId ?? "-",
          }));

          setData(formattedData);

          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            totalPages: Math.ceil(response.data.page.totalElement / pageSize),
            totalItems: response.data.page.totalElement,
            pageSize: pageSize,
          }));
        } else {
          setData([]);
          setError("No se encontraron datos para mostrar");
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setError("Error al obtener los datos. Por favor, intente nuevamente.");
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [getData, pagination.pageSize]
  );

  useEffect(() => {
    if (isModalOpen) {
      fetchData(1, pagination.pageSize);
    }
  }, [isModalOpen, fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchData(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize < 1) return;
    fetchData(1, newPageSize);
  };

  const handleConsultAffiliate = (afiliadoData: AffiliateRawData) => {
    setSelectedAffiliate(afiliadoData);
  };

  const modalTableProps = {
    isOpen: isModalOpen,
    onClose: onCloseModal,
    data: data,
    title: modalTitle,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    onPageChange: handlePageChange,
    itemsPerPage: pagination.pageSize,
    totalItems: pagination.totalItems,
    isLoading,
    onItemsPerPageChange: handlePageSizeChange,
    onConsult: handleConsultAffiliate,
    error,
  };

  return <AfilliateListView {...modalTableProps} />;
};
