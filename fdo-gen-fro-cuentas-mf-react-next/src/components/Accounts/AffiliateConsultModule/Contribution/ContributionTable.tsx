"use client";

import React, { useEffect } from "react";
import { DataTable } from "mantine-datatable";

import { IAporte } from "./IContribution";

interface ContributionTableProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  records: IAporte[];
  pageSize: number;
  totalRecords: number;
  selectedRecord: IAporte | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<any | null>>;
}

export const ContributionTable: React.FC<ContributionTableProps> = ({
  page,
  setPage,
  records,
  pageSize,
  totalRecords,
  selectedRecord,
  setSelectedRecord,
}) => {
  useEffect(() => {
    setSelectedRecord(null);
  }, [records]);

  const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const renderCell = (value: any) => (
    <div style={{ whiteSpace: "nowrap" }}>{value || "-"}</div>
  );

  const columnConfig = [
    { accessor: "cuentaAporteId", title: "Id aporte" },
    { accessor: "periodoPago", title: "Periodo" },
    { accessor: "fechaPago", title: "Fecha pago" },
    { accessor: "fechaCreacion", title: "Fecha acreditación" },
    {
      accessor: "aporte",
      title: "Vlr. aporte",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.aporte)),
    },
    {
      accessor: "vafic",
      title: "Vol. afiliado",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.vafic)),
    },
    {
      accessor: "vempc",
      title: "Vol. empleador",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.vempc)),
    },
    {
      accessor: "salarioBaseCal",
      title: "IBC calculado",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.salarioBaseCal)),
    },
    {
      accessor: "salarioBase",
      title: "IBC informado",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.salarioBase)),
    },
    { accessor: "tipoIdAportante", title: "Tipo id empleador" },
    { accessor: "numeroIdAportante", title: "Id empleador" },
    { accessor: "razonSocial", title: "Razón social" },
    {
      accessor: "descripcionOperacion",
      title: "Operación",
      render: (record: any) => renderCell(record.descripcionOperacion),
    },
    { accessor: "idDisponible", title: "Disponibilidad" },
    { accessor: "encabezadoPlanillaId", title: "Número de planilla" },
    { accessor: "depositoId", title: "Deposito" },
    { accessor: "secuencia", title: "Secuencia" },
    { accessor: "tipoRecaudo", title: "Tipo-sub Tipo recaudo" },
    {
      accessor: "contingente",
      title: "Contingente",
      render: (record: any) =>
        renderCell(CURRENCY_FORMATTER.format(record.contingente)),
    },
    { accessor: "tipoCotizanteId", title: "Tipo de cotizante" },
    { accessor: "diasInformado", title: "Días informados" },
    { accessor: "diasCalculado", title: "Días calculados" },
    { accessor: "usuarioCreacion", title: "Usuario de creación" },
    { accessor: "fechaCreacion", title: "Fecha de creación" },
    { accessor: "fechaPagoOtroFondo", title: "Fecha de pago otro fondo" },
    { accessor: "codigoAfp", title: "AFP no vinculado entrada" },
  ];

  const columns = columnConfig;

  return (
    <DataTable<IAporte>
      withTableBorder
      withColumnBorders
      striped
      shadow="sm"
      minHeight={records.length > 0 ? "100%" : 200}
      height="100%"
      borderRadius="md"
      columns={columns}
      records={records}
      onRowClick={(record) => setSelectedRecord(record)}
      selectedRecords={selectedRecord ? [selectedRecord] : []}
      onSelectedRecordsChange={(selectedRecords) => {
        setSelectedRecord(
          selectedRecords.length > 0 ? selectedRecords[0] : null
        );
      }}
      allRecordsSelectionCheckboxProps={{ style: { display: "none" } }}
      idAccessor="uniqueId"
      page={page}
      recordsPerPage={pageSize}
      onPageChange={setPage}
      totalRecords={totalRecords}
      paginationSize="md"
      noRecordsText="No existen registros para mostrar"
      loadingText="Cargando datos..."
    />
  );
};
