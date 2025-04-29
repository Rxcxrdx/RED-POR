import React, { useMemo } from "react";
import { Table } from "pendig-fro-transversal-lib-react";

interface ValidationTableProps {
  page: number;
  setPage: (page: number) => void;
  records: any[];
  pageSize: number;
  setPageSize: (size: number) => void;
  totalRecords: number;
}

export const BaseValidationTable: React.FC<ValidationTableProps> = ({
  page,
  setPage,
  records,
  pageSize,
  setPageSize,
  totalRecords,
}) => {
  const paginatedRecords = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return records.slice(startIndex, startIndex + pageSize);
  }, [records, page, pageSize]);

  const columns = [
    { $key: "validacionId", $header: "#", $width: "50px" },
    { $key: "nombre", $header: "Nombre" },
    {
      $key: "resultado",
      $header: "Estado",
      $render: (item: any) => (
        <span
          style={{
            backgroundColor:
              item.resultado === "APROBADO" ? "#22c55e" : "#ef4444",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "14px",
          }}
        >
          {item.resultado}
        </span>
      ),
    },
    {
      $key: "descripcion",
      $header: "Descripción",
      $render: (item: any) => <span>{item.descripcion || "-"}</span>,
    },
  ];

  const itemsPerPageOptions = [10, 20, 50, 100];

  return (
    <Table<any>
      $data={paginatedRecords}
      $columns={columns}
      $currentPage={page}
      $totalPages={Math.ceil(records.length / pageSize)}
      $itemsPerPage={pageSize}
      $totalItems={records.length}
      $onPageChange={setPage}
      $itemsPerPageOptions={itemsPerPageOptions}
      $onItemsPerPageChange={(newSize) => {
        setPageSize(newSize);
        setPage(1);
      }}
      $variants={["headerGray"]}
      $selectionType="none"
    />
  );
};
