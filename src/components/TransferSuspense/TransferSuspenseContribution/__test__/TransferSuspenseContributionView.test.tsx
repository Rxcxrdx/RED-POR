import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TransferSuspenseContributionView } from "../TransferSuspenseContributionView";

jest.mock("@/components/SharedComponent", () => ({
  ContributionForm: ({ onSubmit, onReset }: any) => (
    <div data-testid="mock-form">
      <button data-testid="submit-button" onClick={onSubmit}>
        Consultar
      </button>
      <button data-testid="reset-button" onClick={onReset}>
        Limpiar
      </button>
    </div>
  ),
  UserDetailContainer: () => (
    <div data-testid="mock-user-detail">User Detail</div>
  ),
  BaseContributionTable: ({
    records,
    page,
    setPage,
    onItemsPerPageChange,
    handleSelectionChange,
  }: any) => (
    <div data-testid="mock-table">
      <span data-testid="records-count">{records.length}</span>
      <button onClick={() => setPage(2)} data-testid="change-page">
        Next Page
      </button>
      <button
        onClick={() => onItemsPerPageChange(50)}
        data-testid="change-page-size"
      >
        Change Page Size
      </button>
      <button
        onClick={() => handleSelectionChange([records[0]])}
        data-testid="select-record"
      >
        Select Record
      </button>
    </div>
  ),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Spinner: ({ $variant, $message }: any) => (
    <div data-testid="mock-loader">{$message}</div>
  ),
}));

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }: any) => (
    <div data-testid="mock-error">{errorMessage}</div>
  ),
}));

describe("TransferSuspenseContributionView", () => {
  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();
  const mockHandleItemsPerPageChange = jest.fn();
  const mockSetPage = jest.fn();
  const mockHandleSelectionChange = jest.fn();

  const mockContributionData = [
    {
      cuentaAporteId: "123",
      cuentaId: "456",
      fondoId: "789",
      tipoIdAportante: "CC",
      numeroIdAportante: "123456789",
      codigoOperacionId: "001",
      fechaPago: "2024-01-15",
      idDisponible: "S",
      salarioBase: 1000000,
      salarioBaseCal: 1000000,
      diasInformado: 30,
      diasCalculado: 30,
    },
  ];

  const defaultProps = {
    page: 1,
    pageSize: 20,
    totalPages: 5,
    totalRecords: 100,
    isLoading: false,
    errorMessage: "",
    contributionData: mockContributionData,
    selectedRecord: null,
    filterFormContributionTransferSuspense: {
      handleSubmit: jest.fn(),
      reset: jest.fn(),
    } as any,
    handleFilterSubmitTransferSuspense: mockHandleFilterSubmit,
    handleFilterResetTransferSuspense: mockHandleFilterReset,
    handleItemsPerPageChangeTransferSuspense: mockHandleItemsPerPageChange,
    setPage: mockSetPage,
    handleSelectionChangeTransferSuspense: mockHandleSelectionChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente la estructura principal", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-user-detail")).toBeInTheDocument();
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("muestra el loader cuando isLoading es true", () => {
    render(
      <TransferSuspenseContributionView {...defaultProps} isLoading={true} />
    );
    expect(screen.getByTestId("mock-loader")).toBeInTheDocument();
  });

  it("muestra mensaje de error y oculta la tabla cuando hay un errorMessage", () => {
    const errorMessage = "Error de prueba";
    render(
      <TransferSuspenseContributionView
        {...defaultProps}
        errorMessage={errorMessage}
      />
    );
    expect(screen.getByTestId("mock-error")).toHaveTextContent(errorMessage);
    expect(screen.queryByTestId("mock-table")).not.toBeInTheDocument();
  });

  it("maneja el submit del formulario correctamente", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(mockHandleFilterSubmit).toHaveBeenCalled();
  });

  it("maneja el reset del formulario correctamente", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("reset-button"));
    expect(mockHandleFilterReset).toHaveBeenCalled();
  });

  it("maneja el cambio de página correctamente", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("change-page"));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("maneja el cambio de tamaño de página correctamente", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("change-page-size"));
    expect(mockHandleItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  it("maneja la selección de registros correctamente", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    fireEvent.click(screen.getByTestId("select-record"));
    expect(mockHandleSelectionChange).toHaveBeenCalledWith([
      mockContributionData[0],
    ]);
  });

  it("muestra el número correcto de registros", () => {
    render(<TransferSuspenseContributionView {...defaultProps} />);
    expect(screen.getByTestId("records-count")).toHaveTextContent("1");
  });
});
