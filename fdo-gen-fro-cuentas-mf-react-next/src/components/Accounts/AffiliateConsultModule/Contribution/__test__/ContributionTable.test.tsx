import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "mantine-datatable";
import { ContributionTable } from "../ContributionTable";
import { MantineProvider } from "@mantine/core";

jest.mock("mantine-datatable", () => ({
  DataTable: jest.fn(
    ({
      records,
      onRowClick,
      onSelectedRecordsChange,
      columns,
      noRecordsText,
    }) => (
      <div data-testid="data-table">
        {records.length === 0 ? (
          <div>{noRecordsText}</div>
        ) : (
          <div>
            {records.map((record: any) => (
              <div
                key={record.uniqueId}
                data-testid="table-row"
                onClick={() => onRowClick?.(record)}
              >
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
                <button
                  onClick={() => onSelectedRecordsChange([record])}
                  data-testid={`select-${record.uniqueId}`}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  ),
}));

describe("ContributionTable Component", () => {
  const mockSingleRecord = {
    uniqueId: "1",
    cuentaAporteId: "CA001",
    periodoPago: "202401",
    fechaPago: "2024-01-01",
    aporte: 1000000,
    vafic: 500000,
    vempc: 500000,
    salarioBaseCal: 2000000,
    salarioBase: 2000000,
  };

  const defaultProps = {
    page: 1,
    setPage: jest.fn(),
    records: [mockSingleRecord],
    pageSize: 10,
    totalRecords: 1,
    selectedRecord: null,
    setSelectedRecord: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <ContributionTable {...defaultProps} {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formats currency values correctly", () => {
    const { container } = renderComponent();

    const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const aporteValue = container.querySelector(
      '[data-testid="cell-aporte"] div'
    )?.textContent;
    expect(aporteValue).toBe(
      CURRENCY_FORMATTER.format(mockSingleRecord.aporte)
    );
  });

  it("handles null and undefined currency values", () => {
    const nullRecord = {
      uniqueId: "2",
      cuentaAporteId: "CA002",
      aporte: null,
      vafic: undefined,
      salarioBase: null,
    };

    const { container } = renderComponent({ records: [nullRecord] });

    const aporteValue = container.querySelector(
      '[data-testid="cell-aporte"] div'
    )?.textContent;

    expect(aporteValue).toBe("$ 0");
  });

  it("handles row click", () => {
    renderComponent();
    const row = screen.getByTestId("table-row");
    fireEvent.click(row);
    expect(defaultProps.setSelectedRecord).toHaveBeenCalledWith(
      mockSingleRecord
    );
  });

  it("renders DataTable with correct props", () => {
    renderComponent();
    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        records: [mockSingleRecord],
        recordsPerPage: 10,
        page: 1,
        totalRecords: 1,
      }),
      expect.any(Object)
    );
  });

  it("displays no records message when records array is empty", () => {
    renderComponent({ records: [] });
    expect(
      screen.getByText("No existen registros para mostrar")
    ).toBeInTheDocument();
  });

  it("applies correct table styles", () => {
    renderComponent();
    expect(DataTable).toHaveBeenCalledWith(
      expect.objectContaining({
        withTableBorder: true,
        withColumnBorders: true,
        striped: true,
        shadow: "sm",
        borderRadius: "md",
      }),
      expect.any(Object)
    );
  });
});
