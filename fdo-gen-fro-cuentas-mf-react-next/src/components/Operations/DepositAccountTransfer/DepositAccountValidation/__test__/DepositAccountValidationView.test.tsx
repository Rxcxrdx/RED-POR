import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DepositAccountValidationView } from "../DepositAccountValidationView";

jest.mock("@/components/SharedComponent", () => ({
  UserDetailContainer: ({ ContextProvider }: any) => (
    <div data-testid="mock-user-detail">
      <span data-testid="context-provider">DepositAccountTransferContext</span>
      User Detail
    </div>
  ),
  BaseValidationTable: ({
    records,
    page,
    pageSize,
    setPage,
    totalRecords,
    setPageSize,
  }: any) => (
    <div data-testid="mock-validation-table">
      <span data-testid="records-count">{records.length}</span>
      <button onClick={() => setPage(2)} data-testid="change-page">
        Next Page
      </button>
      <button onClick={() => setPageSize(50)} data-testid="change-page-size">
        Change Page Size
      </button>
    </div>
  ),
}));

jest.mock("@/components/common", () => ({
  Loader: ({ isLoading }: any) => (
    <div data-testid="mock-loader">Loading...</div>
  ),
  BoxMessage: ({ errorMessage }: any) => (
    <div data-testid="mock-error">{errorMessage}</div>
  ),
}));

describe("DepositAccountValidationView", () => {
  const mockValidationData = [
    {
      validacionId: 1,
      nombre: "Validación 1",
      resultado: "EXITOSO",
      descripcion: "Validación exitosa",
    },
  ];

  const defaultProps = {
    page: 1,
    setPage: jest.fn(),
    pageSize: 20,
    cuentaId: "ACC123",
    isLoading: false,
    setPageSize: jest.fn(),
    totalRecords: 100,
    errorMessage: "",
    validationData: mockValidationData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente la estructura principal", () => {
    render(<DepositAccountValidationView {...defaultProps} />);
    expect(screen.getByTestId("mock-user-detail")).toBeInTheDocument();
    expect(screen.getByTestId("context-provider")).toHaveTextContent(
      "DepositAccountTransferContext"
    );
  });

  it("muestra mensaje cuando no hay cuenta seleccionada", () => {
    render(<DepositAccountValidationView {...defaultProps} cuentaId={null} />);
    const stateMessage = screen.getByText("No se ha seleccionado una cuenta.");
    expect(stateMessage).toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-validation-table")
    ).not.toBeInTheDocument();
  });

  it("muestra el loader cuando isLoading es true", () => {
    render(<DepositAccountValidationView {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("mock-loader")).toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-validation-table")
    ).not.toBeInTheDocument();
  });

  it("muestra mensaje de error cuando hay un errorMessage", () => {
    const errorMessage = "Error de prueba";
    render(
      <DepositAccountValidationView
        {...defaultProps}
        errorMessage={errorMessage}
      />
    );
    expect(screen.getByTestId("mock-error")).toHaveTextContent(errorMessage);
    expect(
      screen.queryByTestId("mock-validation-table")
    ).not.toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay datos de validación", () => {
    const { container } = render(
      <DepositAccountValidationView {...defaultProps} validationData={[]} />
    );
    const emptyMessage = screen.getByText(
      "No hay datos de validación disponibles. Por favor, realice una validación."
    );
    expect(emptyMessage).toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-validation-table")
    ).not.toBeInTheDocument();
  });

  it("muestra la tabla cuando hay datos de validación", () => {
    render(<DepositAccountValidationView {...defaultProps} />);
    const table = screen.getByTestId("mock-validation-table");
    expect(table).toBeInTheDocument();
    expect(screen.getByTestId("records-count")).toHaveTextContent("1");
  });

  it("maneja el cambio de página correctamente", () => {
    render(<DepositAccountValidationView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("change-page"));
    expect(defaultProps.setPage).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de tamaño de página correctamente", () => {
    render(<DepositAccountValidationView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("change-page-size"));
    expect(defaultProps.setPageSize).toHaveBeenCalledWith(50);
  });

  it("verifica la estructura del contenedor principal", () => {
    const { container } = render(
      <DepositAccountValidationView {...defaultProps} />
    );
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveStyle({
      display: "flex",
      flexDirection: "column",
    });
  });

  it("verifica que todos los estados de visualización funcionan correctamente", () => {
    const { rerender } = render(
      <DepositAccountValidationView {...defaultProps} />
    );

    expect(screen.getByTestId("mock-validation-table")).toBeInTheDocument();

    rerender(
      <DepositAccountValidationView {...defaultProps} cuentaId={null} />
    );
    expect(
      screen.getByText("No se ha seleccionado una cuenta.")
    ).toBeInTheDocument();

    rerender(
      <DepositAccountValidationView {...defaultProps} isLoading={true} />
    );
    expect(screen.getByTestId("mock-loader")).toBeInTheDocument();

    rerender(
      <DepositAccountValidationView
        {...defaultProps}
        errorMessage="Error test"
      />
    );
    expect(screen.getByTestId("mock-error")).toBeInTheDocument();

    rerender(
      <DepositAccountValidationView {...defaultProps} validationData={[]} />
    );
    expect(
      screen.getByText(
        "No hay datos de validación disponibles. Por favor, realice una validación."
      )
    ).toBeInTheDocument();
  });
});
