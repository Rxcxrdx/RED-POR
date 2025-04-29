import React, { useState } from "react";

import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

import { CURRENCY_FORMATTER } from "@/common/utils";
import { BoxMessage, TableWithHeader } from "@/components/common";

interface MovementsDetailTableProps {
  movementsData: any[] | null;
  movementsError: string;
}

export const MovementsDetailTable = ({
  movementsData,
  movementsError,
}: MovementsDetailTableProps) => {
  const [tableData, setTableData] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100,
  });

  const movementsDetailColumns: Column<any>[] = [
    {
      $header: "Fecha de pago",
      $key: "fechaPago",
      $render: (record) => record.fechaPago || "-",
      $isSticky: true,
    },
    {
      $header: "Fecha acreditación",
      $key: "fechaCreacion",
      $render: (record) => record.fechaCreacion || "-",
      $isSticky: true,
    },
    {
      $header: "Periodo",
      $key: "periodoPago",
      $render: (record) => record.periodoPago || "-",
      $isSticky: true,
    },
    {
      $key: "nitPago",
      $header: "Id. Empleador",
      $render: (record) => record.nitPago || "-",
    },
    {
      $key: "razonSocial",
      $header: "Razón social",
      $render: (record) => record.razonSocial || "-",
    },
    {
      $key: "salarioBase",
      $header: "IBC informado",
      $render: (record) =>
        record.salarioBase !== null && record.salarioBase !== undefined
          ? CURRENCY_FORMATTER.format(Number(record.salarioBase))
          : "-",
    },
    {
      $key: "salarioBaseCal",
      $header: "IBC calculado",
      $render: (record) =>
        record.salarioBaseCal !== null && record.salarioBaseCal !== undefined
          ? CURRENCY_FORMATTER.format(Number(record.salarioBaseCal))
          : "-",
    },
    {
      $key: "tipoCotizanteId",
      $header: "Tipo cotizante",
      $render: (record) => record.tipoCotizanteId || "-",
    },
    {
      $key: "diasInformado",
      $header: "Días informados",
      $render: (record) =>
        record.diasInformado !== null && record.diasInformado !== undefined
          ? record.diasInformado
          : "-",
    },
    {
      $key: "diasCalculado",
      $header: "Días calculados",
      $render: (record) =>
        record.diasCalculado !== null && record.diasCalculado !== undefined
          ? record.diasCalculado
          : "-",
    },
    {
      $key: "creditoPesos",
      $header: "Crédito pesos",
      $render: (record) =>
        record.creditoPesos !== null && record.creditoPesos !== undefined
          ? CURRENCY_FORMATTER.format(Number(record.creditoPesos))
          : "-",
    },
    {
      $key: "debitoUnidades",
      $header: "Débito unidades",
      $render: (record) =>
        record.debitoUnidades !== null && record.debitoUnidades !== undefined
          ? record.debitoUnidades
          : "-",
    },
    {
      $key: "debitoPesos",
      $header: "Débito pesos",
      $render: (record) =>
        record.debitoPesos !== null && record.debitoPesos !== undefined
          ? CURRENCY_FORMATTER.format(Number(record.debitoPesos))
          : "-",
    },
    {
      $key: "creditoUnidades",
      $header: "Crédito unidades",
      $render: (record) =>
        record.creditoUnidades !== null && record.creditoUnidades !== undefined
          ? record.creditoUnidades
          : "-",
    },
    {
      $key: "fondoID",
      $header: "Fondo",
      $render: (record) =>
        record.fondoID !== null && record.fondoID !== undefined
          ? record.fondoID
          : "-",
    },
    {
      $key: "afectaSaldo",
      $header: "Afecta saldo",
      $render: (record) => record.afectaSaldo || "-",
    },
    {
      $key: "codigoOperacionId",
      $header: "Operación",
      $render: (record) => record.codigoOperacionId || "-",
    },
    {
      $key: "conceptoId",
      $header: "Concepto",
      $render: (record) => record.conceptoId || "-",
    },
    {
      $key: "idDisponible",
      $header: "Disponible",
      $render: (record) => record.idDisponible || "-",
    },
    {
      $key: "cuentaMovimientoId",
      $header: "Id movimiento",
      $render: (record) => record.cuentaMovimientoId || "-",
    },
    {
      $key: "idMovimientoOrigen",
      $header: "Id origen",
      $render: (record) => record.idMovimientoOrigen || "-",
    },
    {
      $key: "idMovimientoDestino",
      $header: "Id relacionado",
      $render: (record) => record.idMovimientoDestino || "-",
    },
    {
      $key: "cuentaAporteId",
      $header: "Id Aporte",
      $render: (record) => record.cuentaAporteId || "-",
    },
    {
      $key: "fechaOperacion",
      $header: "Fecha operación",
      $render: (record) => record.fechaOperacion || "-",
    },
    {
      $key: "encabezadoPlanillaId",
      $header: "Num. Planilla",
      $render: (record) => record.encabezadoPlanillaId || "-",
    },
    {
      $key: "depositoId",
      $header: "Deposito Id",
      $render: (record) => record.depositoId || "-",
    },
    {
      $key: "usuarioCreacion",
      $header: "Usuario de creación",
      $render: (record) => record.usuarioCreacion || "-",
    },
    {
      $key: "banco",
      $header: "Banco",
      $render: () => "-",
    },
    {
      $key: "oficina",
      $header: "Oficina",
      $render: () => "-",
    },
    {
      $key: "caja",
      $header: "Caja",
      $render: () => "-",
    },
    {
      $key: "folio",
      $header: "Folio",
      $render: () => "-",
    },
    {
      $key: "secuencia",
      $header: "Secuencia",
      $render: (record) =>
        record.secuencia !== null && record.secuencia !== undefined
          ? record.secuencia
          : "-",
    },
    {
      $key: "retencionContingente",
      $header: "Retención informada",
      $render: (record) =>
        record.retencionContingente !== null &&
        record.retencionContingente !== undefined
          ? CURRENCY_FORMATTER.format(Number(record.retencionContingente))
          : "-",
    },
    {
      $key: "afpNoVinculadaEntrada",
      $header: "AFP no vinculada entrada",
      $render: () => "-",
    },
    {
      $key: "fechaPagoOtroFondo",
      $header: "Fecha pago otro fondo",
      $render: (record) => record.fechaPagoOtroFondo || "-",
    },
    {
      $key: "tipoRetiro",
      $header: "Tipo de retiro",
      $render: () => "-",
    },
    {
      $key: "casoId",
      $header: "Caso Id",
      $render: (record) => record.casoId || "-",
    },
    {
      $key: "numeroAsientoId",
      $header: "Asiento Id",
      $render: (record) => record.numeroAsientoId || "-",
    },
    {
      $key: "casosAsociados",
      $header: "Casos Asociados",
      $render: () => "-",
    },
  ];

  if (movementsError) {
    return <BoxMessage errorMessage={movementsError} />;
  } else if (!movementsData?.length) {
    return (
      <BoxMessage
        errorMessage={"No hay movimientos disponibles para este aporte"}
      />
    );
  }

  return (
    <TableWithHeader
      title="Detalle de movimientos"
      tableProps={{
        $columns: movementsDetailColumns,
        $data: movementsData,
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
