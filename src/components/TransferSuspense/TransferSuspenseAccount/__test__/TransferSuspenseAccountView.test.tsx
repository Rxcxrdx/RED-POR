import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { TransferSuspenseAccountView } from "../TransferSuspenseAccountView";

jest.mock("@/components/SharedComponent", () => ({
  AffiliateForm: ({ form, onSubmit, onReset, config }: any) => (
    <div data-testid="mock-filter-form">
      <button onClick={onSubmit} data-testid="submit-button">
        Consultar
      </button>
      <button onClick={onReset} data-testid="reset-button">
        Limpiar
      </button>
      <div data-testid="form-config">{JSON.stringify(config)}</div>
    </div>
  ),
  AffiliateList: ({
    modalTitle,
    getData,
    isModalOpen,
    onCloseModal,
    initialPageSize,
    setSelectedAffiliate,
  }: any) => (
    <div data-testid="mock-affiliate-list">
      {isModalOpen && (
        <div>
          <div data-testid="modal-title">{modalTitle}</div>
          <button onClick={onCloseModal} data-testid="close-modal">
            Cerrar
          </button>
        </div>
      )}
    </div>
  ),
  AccountFdogenCard: ({ accountData }: any) => (
    <div data-testid="mock-fdo-gen-card">
      <div data-testid="account-data">{JSON.stringify(accountData)}</div>
    </div>
  ),
  UserDetailContainer: ({ ContextProvider }: any) => (
    <div data-testid="mock-user-detail">User Detail Mock</div>
  ),
}));

jest.mock("@/components/common", () => ({
  Loader: ({ isLoading }: any) =>
    isLoading ? <div data-testid="loading">Cargando información...</div> : null,
}));

describe("TransferSuspenseAccountView", () => {
  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();
  const mockGetNameSearchData = jest.fn();
  const mockOnCloseNameSearchModal = jest.fn();
  const mockSetSelectedAffiliate = jest.fn();

  const mockFormMethods = {
    watch: jest.fn(),
    setValue: jest.fn(),
    trigger: jest.fn(),
    formState: { errors: {} },
    register: jest.fn(),
    handleSubmit: jest.fn(),
    reset: jest.fn(),
    getValues: jest.fn(),
  };

  const defaultProps = {
    handleFilterSubmit: mockHandleFilterSubmit,
    handleFilterReset: mockHandleFilterReset,
    isLoading: false,
    accountData: [],
    errorMessage: "",
    pensionAccounts: [],
    transferConsultData: [],
    filterFormTransferSuspenseAccount: mockFormMethods,
    isNameSearchModalOpen: false,
    onCloseNameSearchModal: mockOnCloseNameSearchModal,
    getNameSearchData: mockGetNameSearchData,
    setSelectedAffiliate: mockSetSelectedAffiliate,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <TransferSuspenseAccountView {...defaultProps} {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar todos los componentes principales", () => {
    renderComponent();
    expect(screen.getByTestId("affiliate-consult-view")).toBeInTheDocument();
    expect(screen.getByTestId("mock-filter-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-user-detail")).toBeInTheDocument();
    expect(screen.getByTestId("mock-affiliate-list")).toBeInTheDocument();
  });

  it("debe mostrar el loader cuando está cargando", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent(
      "Cargando información..."
    );
  });

  it("debe mostrar mensaje de error cuando existe", () => {
    const errorMessage = "Error de prueba";
    renderComponent({ errorMessage });
    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  it("debe renderizar AccountFdogenCard cuando hay datos de cuenta", () => {
    const accountData = [{ id: 1, data: "test" }];
    renderComponent({ accountData });
    expect(screen.getByTestId("mock-fdo-gen-card")).toBeInTheDocument();
    expect(
      JSON.parse(screen.getByTestId("account-data").textContent || "[]")
    ).toEqual(accountData);
  });

  it("debe manejar el envío del formulario", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(mockHandleFilterSubmit).toHaveBeenCalled();
  });

  it("debe manejar el reset del formulario", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("reset-button"));
    expect(mockHandleFilterReset).toHaveBeenCalled();
  });

  it("debe mostrar el modal de búsqueda cuando isNameSearchModalOpen es true", () => {
    renderComponent({ isNameSearchModalOpen: true });
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Resultados de la búsqueda"
    );
  });

  it("debe pasar la configuración correcta al formulario", () => {
    renderComponent();
    const config = JSON.parse(
      screen.getByTestId("form-config").textContent || "{}"
    );
    expect(config).toEqual({
      showAccountNumber: true,
      showIdentification: true,
      showName: true,
    });
  });

  it("no debe mostrar AccountFdogenCard cuando no hay datos", () => {
    renderComponent();
    expect(screen.queryByTestId("mock-fdo-gen-card")).not.toBeInTheDocument();
  });

  it("no debe mostrar el error cuando no hay mensaje de error", () => {
    renderComponent();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("debe tener el layout correcto", () => {
    renderComponent();
    const mainContainer = screen.getByTestId("affiliate-consult-view");
    expect(mainContainer).toHaveStyle({
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "start",
      width: "100%",
      overflow: "hidden",
    });
  });
});
