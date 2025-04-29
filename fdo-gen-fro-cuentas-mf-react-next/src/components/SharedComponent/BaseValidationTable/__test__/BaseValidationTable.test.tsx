import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BaseValidationTable } from "../BaseValidationTable";

// Mock del componente Table de la librería
jest.mock("pendig-fro-transversal-lib-react", () => ({
  Table: ({
    $data,
    $columns,
    $onPageChange,
    $onItemsPerPageChange,
    $currentPage,
    $totalPages,
    $itemsPerPage,
    $totalItems,
    $selectionType,
    $itemsPerPageOptions,
  }: any) => (
    <div data-testid="mock-table">
      {$columns.map((col: any) => (
        <div key={col.$key} data-testid={`column-${col.$key}`}>
          {col.$header}
          {$data.map((item: any) => (
            <div
              key={`${col.$key}-${item.validacionId}`}
              data-testid={`cell-${col.$key}-${item.validacionId}`}
            >
              {col.$render ? col.$render(item) : item[col.$key]}
            </div>
          ))}
        </div>
      ))}
      <button data-testid="change-page" onClick={() => $onPageChange(2)}>
        Cambiar Página
      </button>
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
      <div data-testid="pagination-info">
        Página {$currentPage} de {$totalPages}, Total: {$totalItems}
      </div>
    </div>
  ),
}));

describe("BaseValidationTable", () => {
  const mockProps = {
    page: 1,
    setPage: jest.fn(),
    pageSize: 10,
    setPageSize: jest.fn(),
    totalRecords: 25,
    records: [
      {
        validacionId: 1,
        nombre: "Validación 1",
        resultado: "APROBADO",
        descripcion: "Validación exitosa",
      },
      {
        validacionId: 2,
        nombre: "Validación 2",
        resultado: "RECHAZADO",
        descripcion: "Error en validación",
      },
      {
        validacionId: 3,
        nombre: "Validación 3",
        resultado: "APROBADO",
        descripcion: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todas las columnas correctamente", () => {
    render(<BaseValidationTable {...mockProps} />);

    expect(screen.getByTestId("column-validacionId")).toBeInTheDocument();
    expect(screen.getByTestId("column-nombre")).toBeInTheDocument();
    expect(screen.getByTestId("column-resultado")).toBeInTheDocument();
    expect(screen.getByTestId("column-descripcion")).toBeInTheDocument();
  });

  it("renderiza el estado con el estilo correcto", () => {
    const { container } = render(<BaseValidationTable {...mockProps} />);

    const aprobadoCell = screen.getByTestId("cell-resultado-1");
    const rechazadoCell = screen.getByTestId("cell-resultado-2");

    const aprobadoSpan = aprobadoCell.querySelector("span");
    const rechazadoSpan = rechazadoCell.querySelector("span");

    expect(aprobadoSpan).toHaveStyle({
      backgroundColor: "#22c55e",
      color: "white",
    });

    expect(rechazadoSpan).toHaveStyle({
      backgroundColor: "#ef4444",
      color: "white",
    });
  });

  it("maneja descripciones nulas correctamente", () => {
    render(<BaseValidationTable {...mockProps} />);
    const descripcionNula = screen.getByTestId("cell-descripcion-3");
    expect(descripcionNula).toHaveTextContent("-");
  });

  it("maneja el cambio de página correctamente", () => {
    render(<BaseValidationTable {...mockProps} />);
    fireEvent.click(screen.getByTestId("change-page"));
    expect(mockProps.setPage).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de items por página", () => {
    render(<BaseValidationTable {...mockProps} />);
    fireEvent.change(screen.getByTestId("items-per-page"), {
      target: { value: "20" },
    });
    expect(mockProps.setPageSize).toHaveBeenCalledWith(20);
    expect(mockProps.setPage).toHaveBeenCalledWith(1);
  });

  it("calcula correctamente la paginación de registros", () => {
    const manyRecords = Array.from({ length: 25 }, (_, i) => ({
      validacionId: i + 1,
      nombre: `Validación ${i + 1}`,
      resultado: "APROBADO",
      descripcion: `Descripción ${i + 1}`,
    }));

    const props = {
      ...mockProps,
      records: manyRecords,
      pageSize: 10,
      page: 2,
    };

    render(<BaseValidationTable {...props} />);

    // Verifica que se muestran los registros correctos para la página 2
    const paginatedData = screen.getByTestId("mock-table");
    expect(paginatedData).toBeInTheDocument();

    // Debería mostrar los registros del 11 al 20 en la página 2
    const startIndex = 10;
    const endIndex = 20;
    for (let i = startIndex; i < endIndex; i++) {
      const record = manyRecords[i];
      expect(
        screen.getByTestId(`cell-nombre-${record.validacionId}`)
      ).toHaveTextContent(`Validación ${record.validacionId}`);
    }
  });

  it("muestra correctamente el total de páginas y registros", () => {
    render(<BaseValidationTable {...mockProps} />);

    const paginationInfo = screen.getByTestId("pagination-info");
    const expectedTotalPages = Math.ceil(
      mockProps.records.length / mockProps.pageSize
    );

    expect(paginationInfo).toHaveTextContent(
      `Página ${mockProps.page} de ${expectedTotalPages}, Total: ${mockProps.records.length}`
    );
  });

  it("renderiza las opciones correctas de items por página", () => {
    render(<BaseValidationTable {...mockProps} />);

    const itemsPerPageSelect = screen.getByTestId("items-per-page");
    const options = Array.from(
      itemsPerPageSelect.getElementsByTagName("option")
    );

    expect(options.map((opt) => Number(opt.value))).toEqual([10, 20, 50, 100]);
  });
});
