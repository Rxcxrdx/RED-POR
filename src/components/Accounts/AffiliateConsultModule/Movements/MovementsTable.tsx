"use client";

import React from "react";
import { DataTable } from "mantine-datatable";
import { MovementsTableProps } from "./IMovements";

export const MovementsTable: React.FC<MovementsTableProps> = ({
  page,
  records,
  setPage,
  pageSize,
  totalRecords,
}) => {
  const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const renderCell = (value: any) => (
    <div style={{ whiteSpace: "nowrap" }}>{value || "-"}</div>
  );

  const renderCurrencyCell = (value: number) => (
    <div style={{ whiteSpace: "nowrap" }}>
      {value ? CURRENCY_FORMATTER.format(value) : "-"}
    </div>
  );

  const columnConfig = [
    { accessor: "periodoPago", title: "Periodo" },
    { accessor: "fechaPago", title: "Fecha de pago" },
    { accessor: "fechaCreacion", title: "Fecha acreditación" },
    {
      accessor: "debitoPesos",
      title: "Débito pesos",
      render: (record: any) => renderCurrencyCell(record.debitoPesos),
    },
    { accessor: "debitoUnidades", title: "Débito unidades" },
    {
      accessor: "creditoPesos",
      title: "Créditos pesos",
      render: (record: any) => renderCurrencyCell(record.creditoPesos),
    },
    { accessor: "creditoUnidades", title: "Crédito unidades" },
    { accessor: "fondoID", title: "Fondo" },
    { accessor: "afectaSaldo", title: "Afecta saldo" },
    {
      accessor: "salarioBaseCal",
      title: "IBC calculado",
      render: (record: any) => renderCurrencyCell(record.salarioBaseCal),
    },
    {
      accessor: "salarioBase",
      title: "IBC informado",
      render: (record: any) => renderCurrencyCell(record.salarioBase),
    },
    { accessor: "nitPago", title: "Id Empleador" },
    { accessor: "razonSocial", title: "Razón social" },
    {
      accessor: "descripcionOperacion",
      title: "Operación",
      render: (record: any) => renderCell(record.descripcionOperacion),
    },
    {
      accessor: "descripcionConcepto",
      title: "Concepto",
      render: (record: any) => renderCell(record.descripcionConcepto),
    },
    { accessor: "idDisponible", title: "Disponible" },
    { accessor: "cuentaMovimientoId", title: "Id movimiento" },
    { accessor: "idMovimientoOrigen", title: "Id origen" },
    { accessor: "idMovimientoDestino", title: "Id relacionado" },
    { accessor: "cuentaAporteId", title: "Id aportes" },
    { accessor: "fechaOperacion", title: "Fecha operación" },
    { accessor: "encabezadoPlanillaId", title: "Número de planilla" },
    { accessor: "depositoId", title: "Depósito id" },
    { accessor: "usuarioCreacion", title: "Usuario de creación" },
    { accessor: "secuencia", title: "Secuencia" },
    { accessor: "tipoCotizanteId", title: "Tipo de cotizante" },
    { accessor: "diasInformado", title: "Días informados" },
    { accessor: "diasCalculado", title: "Días calculados" },
    { accessor: "retencionContingente", title: "Retención informada" },
    { accessor: "codigoAFP", title: "AFP no vinculado entrada" },
    { accessor: "fechaPagoOtroFondo", title: "Fecha de pago otro fondo" },
    { accessor: "casoId", title: "Caso id" },
    { accessor: "numeroAsientoId", title: "Asiento id" },
  ];

  const columns = columnConfig;

  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      shadow="sm"
      minHeight={records.length > 0 ? "100%" : 200}
      height="100%"
      borderRadius="md"
      columns={columns}
      records={records}
      idAccessor="uniqueId"
      page={page}
      recordsPerPage={pageSize}
      onPageChange={setPage}
      totalRecords={totalRecords}
      paginationSize="md"
      noRecordsText="No existen registros para mostrar"
      loadingText="Loading..."
    />
  );
};
