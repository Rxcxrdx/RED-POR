import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TransferSuspenseLaggingParametersTable } from "../TransferSuspenseLaggingParametersTable";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Table: ({
    $data,
    $columns,
    $currentPage,
    $totalPages,
    $itemsPerPage,
    $onPageChange,
    $onItemsPerPageChange,
    $itemsPerPageOptions,
  }: any) => (
    <div data-testid="mock-table">
      <div data-testid="table-content">
        {$data.map((item: any, index: number) => (
          <div key={index} data-testid="table-row">
            {$columns.map((column: any) => {
              const content = column.$render
                ? column.$render(item)
                : item[column.$key];
              return (
                <span
                  key={column.$key}
                  data-testid={`cell-${column.$key}`}
                  data-header={column.$header}
                >
                  {content}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <select
        data-testid="items-per-page"
        value={$itemsPerPage}
        onChange={(e) => $onItemsPerPageChange(Number(e.target.value))}
      >
        {$itemsPerPageOptions.map((option: number) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        data-testid="next-page"
        onClick={() => $onPageChange($currentPage + 1)}
      >
        Next
      </button>
    </div>
  ),
}));

describe("TransferSuspenseLaggingParametersTable", () => {
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();

  const mockRecords = [
    {
      id: 1,
      inversion: 2500000,
      unidadesObligatorias: 150.45,
      pesosObligatorios: 2000000,
      valorAporteVoluntarioUnidades: 45.55,
      valorAporteVoluntarioPesos: 500000,
    },
  ];

  const defaultProps = {
    page: 1,
    setPage: mockSetPage,
    pageSize: 20,
    setPageSize: mockSetPageSize,
    totalRecords: 100,
    records: mockRecords,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza la tabla con los datos correctamente", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-content")).toBeInTheDocument();
  });

  it("usa dummyData cuando no hay records", () => {
    render(
      <TransferSuspenseLaggingParametersTable {...defaultProps} records={[]} />
    );

    const row = screen.getByTestId("table-row");
    expect(row).toBeInTheDocument();
    expect(screen.getByTestId("cell-id")).toHaveTextContent("1");
  });

  it("formatea correctamente los valores monetarios", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);

    const inversionCell = screen.getByTestId("cell-inversion");
    expect(inversionCell).toHaveTextContent("$ 2.500.000");

    const pesosObligatoriosCell = screen.getByTestId("cell-pesosObligatorios");
    expect(pesosObligatoriosCell).toHaveTextContent("$ 2.000.000");

    const valorAporteCell = screen.getByTestId(
      "cell-valorAporteVoluntarioPesos"
    );
    expect(valorAporteCell).toHaveTextContent("$ 500.000");
  });

  it("formatea correctamente los valores de unidades", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);

    const unidadesCell = screen.getByTestId("cell-unidadesObligatorias");
    expect(unidadesCell).toHaveTextContent("150,45");

    const aporteUnidadesCell = screen.getByTestId(
      "cell-valorAporteVoluntarioUnidades"
    );
    expect(aporteUnidadesCell).toHaveTextContent("45,55");
  });

  it("maneja el cambio de página correctamente", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);

    fireEvent.click(screen.getByTestId("next-page"));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de items por página", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);

    fireEvent.change(screen.getByTestId("items-per-page"), {
      target: { value: "50" },
    });

    expect(mockSetPageSize).toHaveBeenCalledWith(50);
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("calcula correctamente el total de páginas", () => {
    const props = {
      ...defaultProps,
      totalRecords: 95,
      pageSize: 20,
    };

    render(<TransferSuspenseLaggingParametersTable {...props} />);
    const totalPages = Math.ceil(props.totalRecords / props.pageSize);
    expect(totalPages).toBe(5);
  });

  it("maneja valores nulos o undefined correctamente", () => {
    const recordsWithNulls = [
      {
        id: 1,
        inversion: null,
        unidadesObligatorias: undefined,
        pesosObligatorios: null,
        valorAporteVoluntarioUnidades: undefined,
        valorAporteVoluntarioPesos: null,
      },
    ];

    render(
      <TransferSuspenseLaggingParametersTable
        {...defaultProps}
        records={recordsWithNulls}
      />
    );

    expect(screen.getByTestId("cell-inversion")).toHaveTextContent("$ 0");
    expect(screen.getByTestId("cell-unidadesObligatorias")).toHaveTextContent(
      "0"
    );
    expect(screen.getByTestId("cell-pesosObligatorios")).toHaveTextContent(
      "$ 0"
    );
    expect(
      screen.getByTestId("cell-valorAporteVoluntarioUnidades")
    ).toHaveTextContent("0");
    expect(
      screen.getByTestId("cell-valorAporteVoluntarioPesos")
    ).toHaveTextContent("$ 0");
  });

  it("verifica las opciones de items por página", () => {
    render(<TransferSuspenseLaggingParametersTable {...defaultProps} />);

    const itemsPerPageSelect = screen.getByTestId("items-per-page");
    const options = Array.from(
      itemsPerPageSelect.getElementsByTagName("option")
    );

    expect(options.map((opt) => Number(opt.value))).toEqual([10, 20, 50, 100]);
  });
});
