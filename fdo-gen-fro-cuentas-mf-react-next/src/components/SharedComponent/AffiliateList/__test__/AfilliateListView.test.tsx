import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AfilliateListView } from "../AfilliateListView";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Modal: ({ children, $isOpen, onClose }: any) =>
    $isOpen ? (
      <div data-testid="mock-modal">
        {children}
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
  Table: ({
    $data,
    $columns,
    $onPageChange,
    $onItemsPerPageChange,
  }: any) => (
    <div data-testid="mock-table">
      <table>
        <tbody>
          {$data.map((item: any, index: number) => (
            <tr key={index}>
              {$columns.map((col: any) => (
                <td key={col.$key}>
                  {col.$render
                    ? col.$render(item)
                    : item[col.$key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => $onPageChange(2)} data-testid="change-page">
        Next Page
      </button>
      <button onClick={() => $onItemsPerPageChange(20)} data-testid="change-page-size">
        Change Items Per Page
      </button>
    </div>
  ),
  Spinner: ({ $message }: any) => (
    <div data-testid="mock-spinner">{$message}</div>
  ),
  ParagraphSmall: ({ children }: any) => (
    <p data-testid="mock-paragraph">{children}</p>
  ),
}));

describe("AfilliateListView Component", () => {
  const mockData = [
    {
      tipoId: "CC",
      identificacion: "123456",
      primerApellido: "Doe",
      segundoApellido: "Smith",
      primerNombre: "John",
      segundoNombre: "James",
      afiliadoFondoId: "123",
    },
  ];

  const mockOnClose = jest.fn();
  const mockOnPageChange = jest.fn();
  const mockOnItemsPerPageChange = jest.fn();
  const mockOnConsult = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    data: mockData,
    title: "Test Title",
    currentPage: 1,
    totalPages: 5,
    onPageChange: mockOnPageChange,
    itemsPerPage: 10,
    totalItems: 100,
    isLoading: false,
    onItemsPerPageChange: mockOnItemsPerPageChange,
    onConsult: mockOnConsult,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("no renderiza nada cuando isOpen es false", () => {
    render(<AfilliateListView {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("muestra el spinner cuando está cargando", () => {
    render(<AfilliateListView {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    expect(screen.getByText("Cargando información...")).toBeInTheDocument();
  });

  it("renderiza el título y el mensaje de resultados", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText(/Se han encontrado 100 resultados similares/)).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando existe un error", () => {
    const errorMessage = "Error de prueba";
    render(<AfilliateListView {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId("mock-table")).not.toBeInTheDocument();
  });

  it("maneja el cambio de página correctamente", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId("change-page"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de items por página", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId("change-page-size"));
    expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(20);
  });

  it("maneja el cierre del modal", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId("close-modal"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renderiza la tabla con la data correctamente", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("maneja la consulta de un afiliado", () => {
    render(<AfilliateListView {...defaultProps} />);
    
    const consultButton = screen.getByText("Consultar");
    fireEvent.click(consultButton);
    expect(mockOnConsult).toHaveBeenCalledWith(mockData[0]);
  });

  it("no muestra el mensaje de resultados cuando totalItems es 0", () => {
    render(<AfilliateListView {...defaultProps} totalItems={0} />);
    
    expect(screen.queryByText(/Se han encontrado/)).not.toBeInTheDocument();
  });

  it("maneja valores seguros para la paginación", () => {
    render(
      <AfilliateListView
        {...defaultProps}
        currentPage={10}
        totalPages={5}
      />
    );
    
    const table = screen.getByTestId("mock-table");
    expect(table).toBeInTheDocument();
  });
});