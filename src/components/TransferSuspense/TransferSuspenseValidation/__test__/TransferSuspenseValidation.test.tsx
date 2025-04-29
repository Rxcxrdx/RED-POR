import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { TransferSuspenseContext } from "@/context";
import { TransferSuspenseValidation } from "../TransferSuspenseValidation";
import { useValidationOperation } from "@/hooks";
import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";

jest.mock("@/hooks", () => ({
  useValidationOperation: jest.fn(),
}));

jest.mock("../TransferSuspenseValidationView", () => ({
  TransferSuspenseValidationView: (props: any) => (
    <div data-testid="validation-view">
      <div data-testid="page">{props.page}</div>
      <div data-testid="page-size">{props.pageSize}</div>
      <div data-testid="total-pages">{props.totalPages}</div>
      <div data-testid="total-records">{props.totalRecords}</div>
      {props.isLoading && <div data-testid="loading">Loading...</div>}
      {props.errorMessage && (
        <div data-testid="error-message">{props.errorMessage}</div>
      )}
      <div data-testid="cuenta-id">{props.cuentaId}</div>
      <div data-testid="validation-data">
        {JSON.stringify(props.validationData)}
      </div>
      {props.selectedRecord && (
        <div data-testid="selected-record">
          {JSON.stringify(props.selectedRecord)}
        </div>
      )}
    </div>
  ),
}));

describe("TransferSuspenseValidation", () => {
  const mockHandleValidateOperation = jest.fn();
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();
  const mockSetSelectedRecord = jest.fn();

  const mockHookReturn = {
    page: 1,
    pageSize: 20,
    isLoading: false,
    totalPages: 5,
    totalRecords: 100,
    errorMessage: "",
    selectedRecord: null,
    validationData: [],
    cuentaId: "123456",
    setPage: mockSetPage,
    setPageSize: mockSetPageSize,
    setSelectedRecord: mockSetSelectedRecord,
    handleValidateOperation: mockHandleValidateOperation,
  };

  const mockContextValue = {
    currentTab: "",
    cuentaId: "123456",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useValidationOperation as jest.Mock).mockReturnValue(mockHookReturn);
  });

  const renderComponent = (contextOverrides = {}) => {
    const contextValue = { ...mockContextValue, ...contextOverrides };
    return render(
      <TransferSuspenseContext.Provider value={contextValue}>
        <TransferSuspenseValidation />
      </TransferSuspenseContext.Provider>
    );
  };

  it("renderiza el componente correctamente", () => {
    renderComponent();
    expect(screen.getByTestId("validation-view")).toBeInTheDocument();
  });

  it("pasa las props correctas al componente view", () => {
    renderComponent();
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("page-size")).toHaveTextContent("20");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
    expect(screen.getByTestId("total-records")).toHaveTextContent("100");
    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123456");
  });

  it("llama a handleValidateOperation cuando currentTab es validation", async () => {
    renderComponent({ currentTab: "validation" });

    await waitFor(() => {
      expect(mockHandleValidateOperation).toHaveBeenCalled();
    });
  });

  it("no llama a handleValidateOperation cuando currentTab no es validation", () => {
    renderComponent({ currentTab: "other" });
    expect(mockHandleValidateOperation).not.toHaveBeenCalled();
  });

  it("muestra el indicador de carga cuando isLoading es true", () => {
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      isLoading: true,
    });

    renderComponent();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando hay un errorMessage", () => {
    const errorMessage = "Error de prueba";
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      errorMessage,
    });

    renderComponent();
    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  it("muestra los datos de validación correctamente", () => {
    const mockValidationData = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
    ];
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      validationData: mockValidationData,
    });

    renderComponent();
    expect(screen.getByTestId("validation-data")).toHaveTextContent(
      JSON.stringify(mockValidationData)
    );
  });

  it("muestra el registro seleccionado cuando existe", () => {
    const mockSelectedRecord = { id: 1, name: "Selected Record" };
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      selectedRecord: mockSelectedRecord,
    });

    renderComponent();
    expect(screen.getByTestId("selected-record")).toHaveTextContent(
      JSON.stringify(mockSelectedRecord)
    );
  });

  it("inicializa useValidationOperation con los parámetros correctos", () => {
    renderComponent();
    expect(useValidationOperation).toHaveBeenCalledWith(
      TransferSuspenseContext,
      DE_CTA_A_REZAGO_CCAI
    );
  });

  it("actualiza la validación cuando cambia currentTab a validation", async () => {
    const { rerender } = renderComponent({ currentTab: "other" });
    expect(mockHandleValidateOperation).not.toHaveBeenCalled();

    rerender(
      <TransferSuspenseContext.Provider
        value={{ ...mockContextValue, currentTab: "validation" }}
      >
        <TransferSuspenseValidation />
      </TransferSuspenseContext.Provider>
    );

    await waitFor(() => {
      expect(mockHandleValidateOperation).toHaveBeenCalled();
    });
  });
});
