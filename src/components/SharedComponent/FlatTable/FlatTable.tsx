import React, { useMemo } from "react";
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "pendig-fro-transversal-lib-react";
interface FlatTableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  showBadge?: boolean;
}

interface FlatTableProps<T extends Record<string, any>> {
  data: T[];
  columns?: FlatTableColumn<T>[];
  idField?: keyof T;
}

export function FlatTable<T extends Record<string, any>>({
  data = [],
  columns,
  idField = "id" as keyof T,
}: FlatTableProps<T>) {
  const tableColumns = useMemo(() => {
    if (columns) return columns;

    if (data.length === 0) return [];

    return Object.keys(data[0]).map((key) => ({
      key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    })) as FlatTableColumn<T>[];
  }, [columns, data]);

  const tableItems = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      key: String(item[idField] || index),
    }));
  }, [data, idField]);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No hay datos disponibles
      </div>
    );
  }

  return (
    <TableContainer
      aria-label="Tabla simple"
      $borderStyle="flat"
      $variants={["headerGray"]}
    >
      <TableHeader
        $columns={tableColumns.map((col) => ({
          key: col.key.toString(),
          label: col.label,
          $width: col.width,
        }))}
      >
        {(column) => (
          <TableColumn key={column.key} $width={column.$width}>
            <div style={{ color: "#6B7280" }}>{column.label}</div>
          </TableColumn>
        )}
      </TableHeader>

      <TableBody $items={tableItems} $emptyContent="No hay datos disponibles">
        {(item) => (
          <TableRow
            key={item.key}
            $columns={tableColumns.map((col) => col.key.toString())}
          >
            {(columnKey) => {
              const value = item[columnKey];
              const column = tableColumns.find(
                (col) => col.key.toString() === columnKey
              );

              if (column?.showBadge) {
                return (
                  <TableCell>
                    <span
                      style={{
                        borderRadius:
                          "var(--Components-Badge-Border-Radius, 6px)",
                        background:
                          "var(--Badges-Soft-Brand-Bg-Color, #C3D1C0)",
                        padding: "2px 8px",
                        fontSize: "0.85rem",
                        marginRight: "8px",
                        display: "inline-block",
                        fontWeight: 700,
                      }}
                    >
                      {value !== null && value !== undefined ? value : "-"}
                    </span>
                  </TableCell>
                );
              } else {
                return (
                  <TableCell>
                    {value !== null && value !== undefined ? value : "-"}
                  </TableCell>
                );
              }
            }}
          </TableRow>
        )}
      </TableBody>
    </TableContainer>
  );
}
