import React, { useState } from "react";

import { TableWithHeader } from "@/components/common";

import { validityColumns } from "./validity.common";

export const ValidityView = ({ validityData }: any) => {
  const [tableData, setTableData] = useState({
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 100,
  });

  return (
    <TableWithHeader
      title="Registro de vigencias"
      tableProps={{
        $columns: validityColumns,
        $data: validityData,
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
