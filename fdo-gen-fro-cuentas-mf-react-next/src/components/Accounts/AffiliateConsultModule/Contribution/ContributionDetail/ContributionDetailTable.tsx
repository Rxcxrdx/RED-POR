import React, { useState } from "react";

import { BoxMessage, TableWithHeader } from "@/components/common";
import { CURRENCY_FORMATTER } from "@/common/utils";
import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

interface ContributionDetailTableProps {
  detailData: any;
  detailError: string;
}

export const ContributionDetailTable = ({
  detailData,
  detailError,
}: ContributionDetailTableProps) => {
  const [tableData, setTableData] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100,
  });

  const contributionDetailColumns: Column<any>[] = [
    { $header: "Id detalle", $key: "aporteDetalleId" },
    { $header: "Concepto", $key: "concepto" },
    { $header: "Inversión", $key: "inversionId" },
    {
      $header: "Créditos pesos",
      $key: "pesos",
      $render: (record) => CURRENCY_FORMATTER.format(Number(record.pesos)),
    },
    { $header: "Crédito unidades", $key: "unidades" },
    { $header: "Porcentaje", $key: "porcentaje" },
    { $header: "Afecta saldo", $key: "afectaSaldoCuenta" },
  ];

  if (detailError) {
    return <BoxMessage errorMessage={detailError} />;
  } else if (!detailData?.aporte?.length) {
    return <BoxMessage errorMessage={"No hay detalles para mostrar"} />;
  }

  return (
    <TableWithHeader
      title="Detalle del Aporte"
      tableProps={{
        $columns: contributionDetailColumns,
        $data: detailData.aporte,
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
