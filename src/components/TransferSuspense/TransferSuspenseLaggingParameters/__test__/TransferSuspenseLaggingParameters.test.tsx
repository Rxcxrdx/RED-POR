import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TransferSuspenseLaggingParameters } from "../TransferSuspenseLaggingParameters";
import { TransferSuspenseContext } from "@/context";
import { useForm } from "react-hook-form";

jest.mock("../TransferSuspenseLaggingParametersView", () => ({
  TransferSuspenseLaggingParametersView: ({
    page,
    pageSize,
    isLoading,
    errorMessage,
    totalRecords,
    selectedRecord,
    setPage,
    setPageSize,
    handleFilterReset,
    handleFilterSubmit,
  }: any) => (
    <div data-testid="lagging-parameters-view">
      <span data-testid="page">Page: {page}</span>
      <span data-testid="pageSize">PageSize: {pageSize}</span>
      <span data-testid="loading">Loading: {isLoading.toString()}</span>
      <span data-testid="error">Error: {errorMessage}</span>
      <span data-testid="totalRecords">TotalRecords: {totalRecords}</span>
      {selectedRecord && (
        <span data-testid="selected">
          Selected: {JSON.stringify(selectedRecord)}
        </span>
      )}
      <button
        data-testid="change-page-size-btn"
        onClick={() => setPageSize(50)}
      >
        Change Page Size
      </button>
      <button data-testid="reset-filter-btn" onClick={handleFilterReset}>
        Reset Filter
      </button>
      <button data-testid="submit-filter-btn" onClick={handleFilterSubmit}>
        Submit Filter
      </button>
    </div>
  ),
}));

const mockReset = jest.fn();
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(),
    reset: mockReset,
    register: jest.fn(),
    formState: { errors: {} },
  })),
}));

describe("TransferSuspenseLaggingParameters", () => {
  const mockCuentaId = "12345";
  const mockContextValue = {
    cuentaId: mockCuentaId,
    setCuentaId: jest.fn(),
  };

  const renderWithContext = (component: React.ReactElement) => {
    return render(
      <TransferSuspenseContext.Provider value={mockContextValue}>
        {component}
      </TransferSuspenseContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza correctamente con valores iniciales", () => {
    renderWithContext(<TransferSuspenseLaggingParameters />);

    expect(screen.getByTestId("page")).toHaveTextContent("Page: 1");
    expect(screen.getByTestId("pageSize")).toHaveTextContent("PageSize: 20");
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading: false");
    expect(screen.getByTestId("error").textContent).toBe("Error: "); // Cambiado para ser más específico
    expect(screen.getByTestId("totalRecords")).toHaveTextContent(
      "TotalRecords: 0"
    );
  });

  it("inicializa useForm con los valores por defecto correctos", () => {
    renderWithContext(<TransferSuspenseLaggingParameters />);

    expect(useForm).toHaveBeenCalledWith({
      mode: "onChange",
      defaultValues: {
        numeroCaso: "",
        tipoRequerimiento: "",
        numeroTareaCRM: "",
        radicadoJuzgado: "",
        relacionadoCon: "",
        documentoSoporte: "",
        observacion: "",
        tipoCausal: "",
      },
    });
  });

  it("maneja cambios en pageSize correctamente", async () => {
    renderWithContext(<TransferSuspenseLaggingParameters />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("change-page-size-btn"));
    });

    expect(screen.getByTestId("pageSize")).toHaveTextContent("PageSize: 50");
  });

  it("resetea la página cuando cambia cuentaId", async () => {
    const { rerender } = renderWithContext(
      <TransferSuspenseLaggingParameters />
    );

    const newContextValue = {
      cuentaId: "67890",
      setCuentaId: jest.fn(),
    };

    await act(async () => {
      rerender(
        <TransferSuspenseContext.Provider value={newContextValue}>
          <TransferSuspenseLaggingParameters />
        </TransferSuspenseContext.Provider>
      );
    });

    expect(screen.getByTestId("page")).toHaveTextContent("Page: 1");
  });
});
