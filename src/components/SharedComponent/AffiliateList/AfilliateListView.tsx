import React from "react";
import { Modal, Table, ParagraphSmall } from "pendig-fro-transversal-lib-react";
import { Loader } from "@/components/common";

interface AffiliateData {
  tipoId: string;
  identificacion: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  afiliadoFondoId: string;
}

interface Column<T> {
  $key: keyof T;
  $header: string;
  $render?: (item: T) => React.ReactNode;
}

interface AffiliateTableProps {
  isOpen: boolean;
  onClose: () => void;
  data: AffiliateData[];
  title?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  isLoading: boolean;
  onItemsPerPageChange?: any;
  onConsult?: any;
  error?: string | null;
}

export const AfilliateListView: React.FC<AffiliateTableProps> = ({
  isOpen,
  onClose,
  data = [],
  title = "Resultados",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  isLoading,
  onItemsPerPageChange,
  onConsult,
  error,
}) => {
  const columns: Column<AffiliateData>[] = [
    { $key: "tipoId", $header: "Tipo de Id." },
    { $key: "identificacion", $header: "Identificación" },
    { $key: "primerApellido", $header: "Primer apellido" },
    { $key: "segundoApellido", $header: "Segundo apellido" },
    { $key: "primerNombre", $header: "Primer nombre" },
    { $key: "segundoNombre", $header: "Segundo nombre" },
    {
      $key: "afiliadoFondoId",
      $header: "Acción",
      $render: (item: AffiliateData) => (
        <button
          onClick={() => onConsult(item)}
          style={{
            backgroundColor: "transparent",
            color: "#3E6C33",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Consultar
        </button>
      ),
    },
  ];

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const safeTotalItems = Math.max(0, totalItems);

  if (!isOpen) return null;

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <Modal $isOpen={true} onClose={onClose} $w="1023px">
      <div
        style={{
          margin: "40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3>{title}</h3>
        {!error && totalItems > 0 && (
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <ParagraphSmall>
              Se han encontrado {totalItems} resultados similares. Por favor
              seleccione uno de los resultados para continuar.
            </ParagraphSmall>
          </div>
        )}

        {error ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              height: "100px",
            }}
          >
            <ParagraphSmall>{error}</ParagraphSmall>
          </div>
        ) : (
          <Table
            $data={data}
            $columns={columns}
            $currentPage={safeCurrentPage}
            $totalPages={safeTotalPages}
            $itemsPerPage={itemsPerPage}
            $totalItems={safeTotalItems}
            $onPageChange={onPageChange}
            $itemsPerPageOptions={[10, 20, 50]}
            $onItemsPerPageChange={onItemsPerPageChange}
            $variants={["headerGray"]}
          />
        )}
      </div>
    </Modal>
  );
};
