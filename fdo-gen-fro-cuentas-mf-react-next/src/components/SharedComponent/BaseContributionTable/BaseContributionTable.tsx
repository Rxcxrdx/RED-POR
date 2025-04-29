import React from "react";
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
  Pagination,
} from "pendig-fro-transversal-lib-react";
import { IAporte } from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";
import { CURRENCY_FORMATTER } from "@/common/utils";
import styles from "./BaseContributionTable.module.scss";

interface IndexableAporte extends IAporte {
  [key: string]: any;
  key: string;
}

export interface BaseContributionTableProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  records: IAporte[];
  selectedRecord: any[] | null;
  setPage: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  handleSelectionChange: (selectedRows: any[]) => void;
}

interface RowProps {
  $isSelected?: boolean;
  $onSelect?: () => void;
  $selectionType?: "none" | "checkbox" | "radio";
}

export const BaseContributionTable = ({
  page,
  records,
  pageSize,
  totalRecords,
  setPage,
  onItemsPerPageChange,
  handleSelectionChange,
}: BaseContributionTableProps) => {
  const formatCurrency = (value: number): string => {
    return value !== null && value !== undefined
      ? CURRENCY_FORMATTER.format(value)
      : "-";
  };

  const itemsPerPageOptions = [10, 20, 50, 100];
  const totalPages = Math.ceil(totalRecords / pageSize);

  const tableItems = records.map((record) => ({
    ...record,
    key: String(record.cuentaAporteId),
  })) as IndexableAporte[];

  const handleInternalSelectionChange = (selectedItems: IndexableAporte[]) => {
    const filteredSelection = selectedItems.filter(
      (item) => item.idDisponible === "S"
    );
    handleSelectionChange(filteredSelection);
  };

  const columns = [
    { key: "cuentaAporteId", label: "Id aporte" },
    { key: "periodoPago", label: "Periodo" },
    { key: "fechaPago", label: "Fecha pago" },
    { key: "fechaCreacion", label: "Fecha acreditación" },
    { key: "aporte", label: "Vlr. aporte" },
    { key: "vafic", label: "Vol. afiliado" },
    { key: "vempc", label: "Vol. empleador" },
    { key: "salarioBaseCal", label: "IBC calculado" },
    { key: "salarioBase", label: "IBC informado" },
    { key: "tipoIdAportante", label: "Tipo id empleador" },
    { key: "numeroIdAportante", label: "Id empleador" },
    { key: "razonSocial", label: "Razón social" },
    { key: "descripcionOperacion", label: "Operación" },
    { key: "idDisponible", label: "Disponibilidad" },
    { key: "encabezadoPlanillaId", label: "Número de planilla" },
    { key: "depositoId", label: "Deposito" },
    { key: "secuencia", label: "Secuencia" },
    { key: "tipoRecaudo", label: "Tipo-sub Tipo recaudo" },
    { key: "contingente", label: "Contingente" },
    { key: "tipoCotizanteId", label: "Tipo de cotizante" },
    { key: "diasInformado", label: "Días informados" },
    { key: "diasCalculado", label: "Días calculados" },
    { key: "usuarioCreacion", label: "Usuario de creación" },
    { key: "fechaPagoOtroFondo", label: "Fecha de pago otro fondo" },
    { key: "codigoAfp", label: "AFP no vinculado entrada" },
  ];

  return (
    <div>
      <TableContainer
        aria-label="Tabla de Contribuciones"
        $selectionType="checkbox"
        $onSelectionChange={handleInternalSelectionChange}
        $variants={["headerGray"]}
      >
        <TableHeader $columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody $selectionType="checkbox" $items={tableItems}>
          {(item: IndexableAporte, rowProps: RowProps) => {
            const updatedProps = {
              ...rowProps,
              $onSelect:
                item.idDisponible === "N" ? undefined : rowProps.$onSelect,
              $isSelected:
                item.idDisponible === "N" ? false : rowProps.$isSelected,
            };

            return (
              <TableRow
                key={item.key}
                $columns={columns.map((col) => col.key)}
                {...updatedProps}
                className={
                  item.idDisponible === "N" ? `${styles.disabledRow}` : ""
                }
              >
                {(columnKey) => {
                  const value = item[columnKey];

                  if (
                    columnKey === "razonSocial" ||
                    columnKey === "descripcionOperacion"
                  ) {
                    return (
                      <TableCell>
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {value || "-"}
                        </div>
                      </TableCell>
                    );
                  }

                  if (
                    [
                      "aporte",
                      "vafic",
                      "vempc",
                      "salarioBase",
                      "salarioBaseCal",
                      "contingente",
                    ].includes(columnKey)
                  ) {
                    return <TableCell>{formatCurrency(value)}</TableCell>;
                  }

                  return (
                    <TableCell>
                      {value !== null && value !== undefined ? value : "-"}
                    </TableCell>
                  );
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </TableContainer>

      <Pagination
        $currentPage={page}
        $totalPages={totalPages}
        $itemsPerPage={pageSize}
        $totalItems={totalRecords}
        $onPageChange={setPage}
        $itemsPerPageOptions={itemsPerPageOptions}
        $onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};
