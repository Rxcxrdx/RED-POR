import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "mantine-datatable";
import { MovementsTable } from "../MovementsTable";
import { MantineProvider } from "@mantine/core";

jest.mock("mantine-datatable", () => ({
  DataTable: jest.fn(
    ({ records, columns, onPageChange, noRecordsText, loadingText }) => (
      <div data-testid="data-table">
        <div data-testid="columns-count">{records.length}</div>
        {records.length === 0 ? (
          <div>{noRecordsText}</div>
        ) : (
          <div>
            {records.map((record: any) => (
              <div key={record.uniqueId} data-testid="table-row">
                {columns.map((column: any) => (
                  <div
                    key={column.accessor}
                    data-testid={`cell-${column.accessor}`}
                  >
                    {column.render
                      ? column.render(record)
                      : record[column.accessor]}
                  </div>
                ))}
              </div>
            ))}
            <button onClick={() => onPageChange(2)} data-testid="next-page">
              Next Page
            </button>
          </div>
        )}
      </div>
    )
  ),
}));

describe("MovementsTable Component", () => {
  const mockRecords = [
    {
      uniqueId: "1",
      periodoPago: "202401",
      fechaPago: "2024-01-01",
      fechaCreacion: "2024-01-01",
      debitoPesos: 1000,
      debitoUnidades: "10",
      creditoPesos: 500,
      creditoUnidades: "5",
      fondoID: "F001",
      afectaSaldo: "S",
      salarioBaseCal: 2000,
      salarioBase: 2000,
      nitPago: "N001",
      razonSocial: "Company 1",
      descripcionOperacion: "Op 1",
      descripcionConcepto: "Concept 1",
      idDisponible: "D001",
      cuentaMovimientoId: "MOV001",
    },
    {
      uniqueId: "2",
      periodoPago: "202401",
      fechaPago: "2024-01-01",
      debitoPesos: null,
      creditoPesos: undefined,
      descripcionOperacion: null,
      descripcionConcepto: "",
      salarioBaseCal: null,
      salarioBase: undefined,
    },
  ];

  const defaultProps = {
    page: 1,
    setPage: jest.fn(),
    records: mockRecords,
    pageSize: 10,
    totalRecords: 2,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <MovementsTable {...defaultProps} {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders DataTable with correct props", () => {
    renderComponent();
    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        records: mockRecords,
        recordsPerPage: 10,
        page: 1,
        totalRecords: 2,
      }),
      expect.any(Object)
    );
  });

  test("displays no records message when records array is empty", () => {
    renderComponent({ records: [] });
    expect(
      screen.getByText("No existen registros para mostrar")
    ).toBeInTheDocument();
  });

  test("handles page change", () => {
    renderComponent();
    const nextPageButton = screen.getByTestId("next-page");
    fireEvent.click(nextPageButton);
    expect(defaultProps.setPage).toHaveBeenCalledWith(2);
  });

  test("renders all columns correctly", () => {
    renderComponent();
    const { calls } = (DataTable as jest.Mock).mock;
    const columns = calls[0][0].columns;
    expect(columns.length).toBe(33);
  });

  test("formats currency values correctly", () => {
    renderComponent();
    const rows = screen.getAllByTestId("table-row");
    const firstRow = rows[0];

    const debitoPesosCell = firstRow.querySelector(
      '[data-testid="cell-debitoPesos"] div'
    );
    const creditoPesosCell = firstRow.querySelector(
      '[data-testid="cell-creditoPesos"] div'
    );

    const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    expect(debitoPesosCell?.textContent).toBe(CURRENCY_FORMATTER.format(1000));
    expect(creditoPesosCell?.textContent).toBe(CURRENCY_FORMATTER.format(500));
  });

  test("handles null and undefined currency values", () => {
    renderComponent();
    const rows = screen.getAllByTestId("table-row");
    const secondRow = rows[1];
    expect(secondRow).toBeInTheDocument();

    const debitoPesosCell = secondRow.querySelector(
      '[data-testid="cell-debitoPesos"] div'
    );
    const creditoPesosCell = secondRow.querySelector(
      '[data-testid="cell-creditoPesos"] div'
    );

    expect(debitoPesosCell?.textContent).toBe("-");
    expect(creditoPesosCell?.textContent).toBe("-");
  });

  test("renders text cells with default value when empty", () => {
    renderComponent();
    const rows = screen.getAllByTestId("table-row");
    const secondRow = rows[1];
    expect(secondRow).toBeInTheDocument();
    const operacionCell = screen.getAllByTestId("cell-descripcionOperacion")[1];
    const conceptoCell = screen.getAllByTestId("cell-descripcionConcepto")[1];
    expect(operacionCell.textContent).toBe("-");
    expect(conceptoCell.textContent).toBe("-");
  });

  test("handles empty records gracefully", () => {
    renderComponent({ records: [] });
    expect(screen.queryByTestId("table-row")).not.toBeInTheDocument();
  });

  test("verifies column formatters are applied correctly", () => {
    renderComponent();
    const { calls } = (DataTable as jest.Mock).mock;
    const columns = calls[0][0].columns;

    const monetaryColumns = [
      "debitoPesos",
      "creditoPesos",
      "salarioBaseCal",
      "salarioBase",
    ];
    monetaryColumns.forEach((accessor) => {
      const column = columns.find((c: any) => c.accessor === accessor);
      expect(column.render).toBeDefined();
    });

    const textColumns = ["descripcionOperacion", "descripcionConcepto"];
    textColumns.forEach((accessor) => {
      const column = columns.find((c: any) => c.accessor === accessor);
      expect(column.render).toBeDefined();
    });
  });

  test("applies consistent styling to all cells", () => {
    renderComponent();
    const { calls } = (DataTable as jest.Mock).mock;
    const columns = calls[0][0].columns;

    columns.forEach((column: any) => {
      if (column.render) {
        const record = { [column.accessor]: 1000 };
        const rendered = column.render(record);
        expect(rendered.props.style).toEqual({ whiteSpace: "nowrap" });
      }
    });
  });
});
