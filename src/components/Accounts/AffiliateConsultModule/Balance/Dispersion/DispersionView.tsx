import React, { useState } from "react";

import { TableWithHeader } from "@/components/common";

import { IDispersion } from "./IDispersion";

import { historicColumns } from "./dispersion.common";

export const DispersionView = ({
  historicDispersion,
}: {
  historicDispersion: IDispersion[];
}) => {
  const [tableData, setTableData] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100,
  });

  return (
    <TableWithHeader
      title="Histórico de dispersión"
      tableProps={{
        $columns: historicColumns,
        $data: historicDispersion,
        $currentPage: tableData.currentPage,
        $totalPages: tableData.totalPages,
        $itemsPerPage: tableData.itemsPerPage,
        $totalItems: tableData.totalItems,
        $onPageChange: () => {},
        $onItemsPerPageChange: () => {},
        $itemsPerPageOptions: [2, 10, 20, 30],
        $onSelectionChange: () => {},
        $onSort: () => {},
        $variants: ["headerGray", "withShadow", "stripedRows"],
      }}
    />
  );
};
