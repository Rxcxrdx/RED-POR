import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BaseContributionTable } from "../BaseContributionTable";
import { CURRENCY_FORMATTER } from "@/common/utils";

jest.mock("@/common/utils", () => ({
  CURRENCY_FORMATTER: {
    format: jest.fn((value) => `$${value?.toLocaleString("es-CO") || "-"}`),
  },
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  TableContainer: ({
    children,
    $selectionType,
    $onSelectionChange,
    $variants,
    "aria-label": ariaLabel,
  }) => (
    <div data-testid="table-container" aria-label={ariaLabel}>
      {$onSelectionChange && (
        <button
          data-testid="mock-select-all"
          onClick={() =>
            $onSelectionChange([{ key: "123", idDisponible: "S" }])
          }
        >
          Seleccionar Todo
        </button>
      )}
      {children}
    </div>
  ),
  TableHeader: ({ children, $columns }) => (
    <div data-testid="table-header">
      {$columns.map((column) => children(column))}
    </div>
  ),
  TableColumn: ({ children, key }) => (
    <div data-testid={`column-${key || children}`}>{children}</div>
  ),
  TableBody: ({ children, $selectionType, $items }) => (
    <div data-testid="table-body">
      {$items.map((item) =>
        children(item, {
          $isSelected: false,
          $onSelect: () => {},
          $selectionType,
        })
      )}
    </div>
  ),
  TableRow: ({
    children,
    key,
    $columns,
    $isSelected,
    $onSelect,
    className,
  }) => (
    <div data-testid={`row-${key || "item"}`} className={className || ""}>
      {$columns.map((columnKey) => children(columnKey))}
      <span data-testid={`row-selected-state`}>
        {$isSelected === false ? "not-selected" : "selected"}
      </span>
      {$onSelect && (
        <button data-testid={`select-row-${key || "item"}`} onClick={$onSelect}>
          Seleccionar
        </button>
      )}
    </div>
  ),
  TableCell: ({ children }) => <div data-testid="table-cell">{children}</div>,
  Pagination: ({
    $currentPage,
    $totalPages,
    $itemsPerPage,
    $totalItems,
    $onPageChange,
    $itemsPerPageOptions,
    $onItemsPerPageChange,
  }) => (
    <div data-testid="pagination">
      <button
        data-testid="prev-page"
        onClick={() => $onPageChange($currentPage - 1)}
      >
        Página Anterior
      </button>
      <span data-testid="current-page">{$currentPage}</span>
      <span data-testid="total-pages">de {$totalPages}</span>
      <button
        data-testid="next-page"
        onClick={() => $onPageChange($currentPage + 1)}
      >
        Página Siguiente
      </button>
      <select
        data-testid="items-per-page"
        value={$itemsPerPage}
        onChange={(e) => $onItemsPerPageChange(Number(e.target.value))}
      >
        {$itemsPerPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span data-testid="total-items">Total: {$totalItems}</span>
    </div>
  ),
}));

describe("BaseContributionTable", () => {
  const mockData = {
    page: 1,
    pageSize: 20,
    totalRecords: 40,
    records: [
      {
        cuentaAporteId: "123",
        periodoPago: "2024-01",
        fechaPago: "2024-01-15",
        fechaCreacion: "2024-01-15",
        aporte: 1000000,
        vafic: 500000,
        vempc: 500000,
        salarioBaseCal: 2000000,
        salarioBase: 2000000,
        tipoIdAportante: "CC",
        numeroIdAportante: "123456",
        razonSocial: "Empresa Test",
        descripcionOperacion: "Operación Test",
        idDisponible: "S",
        encabezadoPlanillaId: "P123",
        depositoId: "D123",
        secuencia: "1",
        tipoRecaudo: "TR1",
        contingente: 100000,
        tipoCotizanteId: "TC1",
        diasInformado: 30,
        diasCalculado: 30,
        usuarioCreacion: "user1",
        fechaPagoOtroFondo: "2024-01-14",
        codigoAfp: "AFP1",
      },
      {
        cuentaAporteId: "456",
        periodoPago: "2024-02",
        fechaPago: "2024-02-15",
        fechaCreacion: "2024-02-15",
        aporte: 1200000,
        vafic: 600000,
        vempc: 600000,
        salarioBaseCal: 2200000,
        salarioBase: 2200000,
        tipoIdAportante: "CC",
        numeroIdAportante: "789012",
        razonSocial: "Empresa Prueba",
        descripcionOperacion: "Operación Prueba",
        idDisponible: "N",
        encabezadoPlanillaId: "P456",
        depositoId: "D456",
        secuencia: "2",
        tipoRecaudo: "TR2",
        contingente: 120000,
        tipoCotizanteId: "TC2",
        diasInformado: 28,
        diasCalculado: 28,
        usuarioCreacion: "user2",
        fechaPagoOtroFondo: "2024-02-14",
        codigoAfp: "AFP2",
      },
    ],
    selectedRecord: null,
    setPage: jest.fn(),
    onItemsPerPageChange: jest.fn(),
    handleSelectionChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza la tabla de contribuciones correctamente", () => {
    render(<BaseContributionTable {...mockData} />);
    expect(screen.getByTestId("table-container")).toBeInTheDocument();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("formatea correctamente los valores monetarios", () => {
    render(<BaseContributionTable {...mockData} />);
    expect(CURRENCY_FORMATTER.format).toHaveBeenCalled();
    expect(CURRENCY_FORMATTER.format).toHaveBeenCalledWith(1000000);
    expect(CURRENCY_FORMATTER.format).toHaveBeenCalledWith(500000);
  });

  it("maneja valores nulos y undefined en campos monetarios", () => {
    const recordsWithNullValues = [
      {
        ...mockData.records[0],
        aporte: null,
        vafic: undefined,
        salarioBase: 2000000,
      },
    ];

    render(
      <BaseContributionTable {...mockData} records={recordsWithNullValues} />
    );

    const cells = screen.getAllByTestId("table-cell");
    expect(cells.some((cell) => cell.textContent === "-")).toBeTruthy();
  });

  it("aplica estilos para filas no disponibles", () => {
    const { container } = render(<BaseContributionTable {...mockData} />);

    const disabledRows = container.getElementsByClassName("disabledRow");
    expect(disabledRows.length).toBeGreaterThan(0);

    const rows = screen.getAllByTestId(/^row-/);
    const nonDisabledRows = Array.from(rows).filter(
      (row) => !row.className.includes("disabledRow")
    );
    expect(nonDisabledRows.length).toBeGreaterThan(0);
  });

  it("maneja el cambio de página correctamente", () => {
    render(<BaseContributionTable {...mockData} />);
    fireEvent.click(screen.getByTestId("next-page"));
    expect(mockData.setPage).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de items por página", () => {
    render(<BaseContributionTable {...mockData} />);
    fireEvent.change(screen.getByTestId("items-per-page"), {
      target: { value: "50" },
    });
    expect(mockData.onItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  it("calcula correctamente el número total de páginas", () => {
    const props = {
      ...mockData,
      totalRecords: 45,
      pageSize: 10,
    };

    render(<BaseContributionTable {...props} />);
    expect(screen.getByTestId("total-pages").textContent).toBe("de 5");
  });

  it("maneja la selección de acuerdo a la disponibilidad", () => {
    render(<BaseContributionTable {...mockData} />);

    fireEvent.click(screen.getByTestId("mock-select-all"));

    expect(mockData.handleSelectionChange).toHaveBeenCalled();
    expect(mockData.handleSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          idDisponible: "S",
        }),
      ])
    );
  });

  it("renderiza valores predeterminados para campos vacíos", () => {
    const recordsWithEmptyValues = [
      {
        ...mockData.records[0],
        razonSocial: null,
        descripcionOperacion: undefined,
      },
    ];

    render(
      <BaseContributionTable {...mockData} records={recordsWithEmptyValues} />
    );

    const cells = screen.getAllByTestId("table-cell");
    expect(cells.some((cell) => cell.textContent === "-")).toBeTruthy();
  });
});
