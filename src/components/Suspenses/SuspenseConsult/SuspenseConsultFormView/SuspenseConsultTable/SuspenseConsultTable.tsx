import React, { useContext } from "react";
import { Table } from "pendig-fro-transversal-lib-react";
import { ISuspense } from "@/components/Suspenses/SuspenseConsult/SuspenseConsultFormView/ISuspenseConsultForm";
import { CURRENCY_FORMATTER } from "@/common/utils";
import { SuspenseConsultContext } from "@/context";

interface Column {
  $key: any;
  $header: string;
  $format?: (value: any) => string;
  $render?: any;
  $isLink?: boolean;
  $linkPath?: (value: any) => any;
  $onClick?: () => void;
}

export interface SuspenseTableProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  records: ISuspense[];
  setPage: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export const SuspenseTable = ({
  page,
  records,
  pageSize,
  totalRecords,
  setPage,
  onItemsPerPageChange,
}: SuspenseTableProps) => {
  const formatCurrency = (value: number): string => {
    return value !== null && value !== undefined
      ? CURRENCY_FORMATTER.format(value)
      : "-";
  };

  const { setIsShowConsultForm, setSuspense, setCuentaId } = useContext(
    SuspenseConsultContext
  );

  const columns: Column[] = [
    {
      $key: "rezagoId",
      $header: "Folio rezago",
      $isLink: true,
      $render: (item: any) => (
        <a
          onClick={() => {
            setIsShowConsultForm(false);
            setSuspense([item]);
            setCuentaId(item.cuentaId);
          }}
        >
          {item.rezagoId}
        </a>
      ),
    },
    {
      $key: "saldoPesos",
      $header: "Valor rezago",
      $format: (value) => formatCurrency(value),
    },
    { $key: "estadoLevante", $header: "Levante" },
    { $key: "indicadorCongelamiento", $header: "Congelado" },
    { $key: "causalCongelaRezagoId", $header: "Causal congelamiento" },
    { $key: "periodoPago", $header: "Periodo" },
    { $key: "cuentaId", $header: "Cuenta" },
    { $key: "tipoIdDetalle", $header: "Tipo id afiliado" },
    { $key: "numeroIdDetalle", $header: "Id. afiliado" },
    { $key: "primerApellido", $header: "Primer apellido" },
    { $key: "segundoApellido", $header: "Segundo apellido" },
    { $key: "primerNombre", $header: "Primer nombre" },
    { $key: "segundoNombre", $header: "Segundo nombre" },
    { $key: "tipoRezagoId", $header: "Tipo rezago" },
    { $key: "causalRezagoId", $header: "Causal rezago" },

    { $key: "tipoIdNitPago", $header: "Tipo id empleador" },
    { $key: "nitPago", $header: "Id. empleador" },
    {
      $key: "razonSocial",
      $header: "Razón social",
      $format: (value) => (value ? String(value) : "-"),
    },
    { $key: "fechaPago", $header: "Fecha pago" },
    { $key: "fechaCreacion", $header: "fecha creación" },
    { $key: "encabezadoPlanillaId", $header: "Número planilla" },
  ];

  const itemsPerPageOptions = [10, 20, 50, 100];
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePageSizeChange = (newSize: number) => {
    onItemsPerPageChange(newSize);
    setPage(1);
  };

  return (
    <Table
      $data={records}
      $columns={columns}
      $currentPage={page}
      $totalPages={totalPages}
      $itemsPerPage={pageSize}
      $totalItems={totalRecords}
      $onPageChange={setPage}
      $itemsPerPageOptions={itemsPerPageOptions}
      $onItemsPerPageChange={handlePageSizeChange}
    />
  );
};
