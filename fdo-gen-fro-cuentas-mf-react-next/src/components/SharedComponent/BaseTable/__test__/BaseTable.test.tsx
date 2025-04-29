import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BaseTable } from "../BaseTable";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="mock-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Table: ({
    $data,
    $columns,
    $currentPage,
    $totalPages,
    $itemsPerPage,
    $totalItems,
    $onPageChange,
    $itemsPerPageOptions,
    $onItemsPerPageChange,
  }) => (
    <div data-testid="mock-table">
      <div data-testid="table-columns">
        {$columns.map((column, index) => (
          <div key={index} data-testid={`column-${index}`}>
            {column.header}
          </div>
        ))}
      </div>
      <div data-testid="table-rows">
        {$data.map((row, rowIndex) => (
          <div key={rowIndex} data-testid={`row-${rowIndex}`}>
            {Object.values(row).map((value, cellIndex) => (
              <div key={cellIndex} data-testid={`cell-${rowIndex}-${cellIndex}`}>
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
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
    </div>
  ),
}));

jest.mock("@/components/common", () => ({
  Loader: ({ isLoading }) =>
    isLoading ? <div data-testid="loader">Cargando...</div> : null,
  BoxMessage: ({ errorMessage }) => (
    <div data-testid="error-message">{errorMessage}</div>
  ),
}));

describe("BaseTable", () => {
  const mockColumns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
  ];

  const mockRecords = [
    { id: 1, name: "Record 1" },
    { id: 2, name: "Record 2" },
  ];

  const mockSetPage = jest.fn();
  const mockHandleDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente la tabla con columnas y registros", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={null}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-columns")).toBeInTheDocument();
    expect(screen.getByTestId("table-rows")).toBeInTheDocument();

    const columns = screen.getAllByTestId(/^column-/);
    expect(columns).toHaveLength(mockColumns.length);

    const rows = screen.getAllByTestId(/^row-/);
    expect(rows).toHaveLength(mockRecords.length);
  });

  it("muestra el mensaje de error cuando se proporciona errorMessage", () => {
    const errorMessage = "Ocurrió un error";

    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={errorMessage}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    const errorMessageElement = screen.getByTestId("error-message");
    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement).toHaveTextContent(errorMessage);
  });

  it("muestra el loader cuando isLoading es true", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={null}
        isLoading={true}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("maneja el cambio de página correctamente", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={null}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    fireEvent.click(screen.getByTestId("next-page"));
    expect(mockSetPage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByTestId("prev-page"));
    expect(mockSetPage).toHaveBeenCalledWith(0);
  });

  it("maneja el cambio de items por página correctamente", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={null}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    fireEvent.change(screen.getByTestId("items-per-page"), {
      target: { value: "50" },
    });

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("llama a handleDownload cuando se hace clic en el botón de descarga", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={mockRecords}
        totalRecords={mockRecords.length}
        errorMessage={null}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    fireEvent.click(screen.getByTestId("csv-download-contributions"));
    expect(mockHandleDownload).toHaveBeenCalled();
  });

  it("maneja registros vacíos correctamente", () => {
    render(
      <BaseTable
        columns={mockColumns}
        page={1}
        setPage={mockSetPage}
        records={[]}
        totalRecords={0}
        errorMessage={null}
        isLoading={false}
        handleDownload={mockHandleDownload}
        downloadable={true}
        titleButtonDownload="Descargar CSV"
      />
    );

    const rows = screen.queryAllByTestId(/^row-/);
    expect(rows).toHaveLength(0);
  });
});