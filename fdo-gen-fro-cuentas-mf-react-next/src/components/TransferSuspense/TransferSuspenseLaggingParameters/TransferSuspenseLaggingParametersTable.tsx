import React from "react";
import { Table } from "pendig-fro-transversal-lib-react";

const dummyData = [
  {
    id: 1,
    inversion: 2500000,
    unidadesObligatorias: 150.45,
    pesosObligatorios: 2000000,
    valorAporteVoluntarioUnidades: 45.55,
    valorAporteVoluntarioPesos: 500000,
  },
];

interface LaggingParametersTableProps {
  page: number;
  setPage: (page: number) => void;
  records: any[];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalRecords: number;
}

export const TransferSuspenseLaggingParametersTable: React.FC<
  LaggingParametersTableProps
> = ({ page, setPage, records = [], pageSize, setPageSize, totalRecords }) => {
  const columns = [
    {
      $key: "id",
      $header: "#",
      $width: "50px",
    },
    {
      $key: "inversion",
      $header: "Inversión",
      $render: (item: any) => (
        <span>$ {(item.inversion || 0).toLocaleString("es-CO")}</span>
      ),
    },
    {
      $key: "unidadesObligatorias",
      $header: "Unidades Obligatorias",
      $render: (item: any) => (
        <span>{(item.unidadesObligatorias || 0).toLocaleString("es-CO")}</span>
      ),
    },
    {
      $key: "pesosObligatorios",
      $header: "Pesos Obligatorios",
      $render: (item: any) => (
        <span>$ {(item.pesosObligatorios || 0).toLocaleString("es-CO")}</span>
      ),
    },
    {
      $key: "valorAporteVoluntarioUnidades",
      $header: "Valor aporte Voluntario Unidades",
      $render: (item: any) => (
        <span>
          {(item.valorAporteVoluntarioUnidades || 0).toLocaleString("es-CO")}
        </span>
      ),
    },
    {
      $key: "valorAporteVoluntarioPesos",
      $header: "Valor Aporte Voluntario pesos",
      $render: (item: any) => (
        <span>
          $ {(item.valorAporteVoluntarioPesos || 0).toLocaleString("es-CO")}
        </span>
      ),
    },
  ];

  const totalPages = Math.ceil(totalRecords / pageSize);
  const itemsPerPageOptions = [10, 20, 50, 100];

  return (
    <Table
      $data={records.length > 0 ? records : dummyData}
      $columns={columns}
      $currentPage={page}
      $totalPages={totalPages}
      $itemsPerPage={pageSize}
      $totalItems={totalRecords}
      $onPageChange={setPage}
      $itemsPerPageOptions={itemsPerPageOptions}
      $onItemsPerPageChange={(newSize) => {
        setPageSize(newSize);
        setPage(1);
      }}
      $variants={["headerGray"]}
    />
  );
};
