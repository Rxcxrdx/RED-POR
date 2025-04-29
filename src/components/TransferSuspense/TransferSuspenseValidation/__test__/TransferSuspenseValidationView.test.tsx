import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TransferSuspenseValidationView } from "../TransferSuspenseValidationView";

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }: { errorMessage: string }) => (
    <div data-testid="error-message">{errorMessage}</div>
  ),
  Loader: ({ isLoading }: { isLoading: boolean }) => (
    <div data-testid="loader-component">{isLoading ? "Loading..." : ""}</div>
  ),
}));

jest.mock("@/components/SharedComponent", () => ({
  UserDetailContainer: ({ ContextProvider }: any) => (
    <div data-testid="user-detail">
      <span data-testid="context-provider">{ContextProvider.displayName}</span>
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
    <div data-testid="validation-table">
      <span data-testid="table-page">{page}</span>
      <span data-testid="table-page-size">{pageSize}</span>
      <span data-testid="table-total-records">{totalRecords}</span>
      <span data-testid="table-records-length">{records.length}</span>
      <button onClick={() => setPage(2)} data-testid="change-page">
        Change Page
      </button>
      <button onClick={() => setPageSize(50)} data-testid="change-page-size">
        Change Size
      </button>
    </div>
  ),
}));

describe("TransferSuspenseValidationView", () => {
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();

  const defaultProps = {
    page: 1,
    setPage: mockSetPage,
    pageSize: 20,
    cuentaId: "123",
    isLoading: false,
    setPageSize: mockSetPageSize,
    totalRecords: 100,
    errorMessage: "",
    validationData: [{ id: 1, name: "Test" }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <TransferSuspenseValidationView {...defaultProps} {...props} />
    );
  };

  describe("Estados de visualización", () => {
    it("muestra el estado NO_ACCOUNT cuando no hay cuentaId", () => {
      renderComponent({ cuentaId: "" });
      expect(
        screen.getByText("No se ha seleccionado una cuenta.")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("validation-table")).not.toBeInTheDocument();
    });

    it("muestra el estado LOADING cuando isLoading es true", () => {
      renderComponent({ isLoading: true });
      expect(screen.getByTestId("loader-component")).toBeInTheDocument();
      expect(screen.queryByTestId("validation-table")).not.toBeInTheDocument();
    });

    it("muestra el estado ERROR cuando hay un errorMessage", () => {
      const errorMessage = "Error de prueba";
      renderComponent({ errorMessage });
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        errorMessage
      );
      expect(screen.queryByTestId("validation-table")).not.toBeInTheDocument();
    });

    it("muestra el estado EMPTY cuando no hay datos de validación", () => {
      renderComponent({ validationData: [] });
      expect(
        screen.getByText(
          "No hay datos de validación disponibles. Por favor, realice una validación."
        )
      ).toBeInTheDocument();
      expect(screen.queryByTestId("validation-table")).not.toBeInTheDocument();
    });

    it("muestra el estado DATA cuando hay datos de validación", () => {
      renderComponent();
      expect(screen.getByTestId("validation-table")).toBeInTheDocument();
    });
  });

  describe("Estilos y layout", () => {
    it("aplica los estilos correctos al contenedor principal", () => {
      const { container } = renderComponent();
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveStyle({
        display: "flex",
        flexDirection: "column",
      });
    });
  });

  describe("Integración con componentes", () => {
    it("pasa las props correctamente a BaseValidationTable", () => {
      const mockData = [
        { id: 1, name: "Test1" },
        { id: 2, name: "Test2" },
      ];
      renderComponent({
        validationData: mockData,
        page: 2,
        pageSize: 30,
        totalRecords: 150,
      });

      const table = screen.getByTestId("validation-table");
      expect(screen.getByTestId("table-page")).toHaveTextContent("2");
      expect(screen.getByTestId("table-page-size")).toHaveTextContent("30");
      expect(screen.getByTestId("table-total-records")).toHaveTextContent(
        "150"
      );
      expect(screen.getByTestId("table-records-length")).toHaveTextContent("2");
    });
  });

  describe("Manejo de interacciones", () => {
    it("maneja el cambio de página correctamente", () => {
      renderComponent();
      const changePageButton = screen.getByTestId("change-page");
      changePageButton.click();
      expect(mockSetPage).toHaveBeenCalledWith(2);
    });

    it("maneja el cambio de tamaño de página correctamente", () => {
      renderComponent();
      const changePageSizeButton = screen.getByTestId("change-page-size");
      changePageSizeButton.click();
      expect(mockSetPageSize).toHaveBeenCalledWith(50);
    });
  });

  describe("Estados de transición", () => {
    it("cambia correctamente de estado DATA a LOADING", () => {
      const { rerender } = renderComponent();
      expect(screen.getByTestId("validation-table")).toBeInTheDocument();

      rerender(
        <TransferSuspenseValidationView {...defaultProps} isLoading={true} />
      );
      expect(screen.getByTestId("loader-component")).toBeInTheDocument();
      expect(screen.queryByTestId("validation-table")).not.toBeInTheDocument();
    });

    it("cambia correctamente de estado LOADING a ERROR", () => {
      const { rerender } = renderComponent({ isLoading: true });
      expect(screen.getByTestId("loader-component")).toBeInTheDocument();

      rerender(
        <TransferSuspenseValidationView
          {...defaultProps}
          isLoading={false}
          errorMessage="Error de carga"
        />
      );
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error de carga"
      );
      expect(screen.queryByTestId("loader-component")).not.toBeInTheDocument();
    });
  });
});
