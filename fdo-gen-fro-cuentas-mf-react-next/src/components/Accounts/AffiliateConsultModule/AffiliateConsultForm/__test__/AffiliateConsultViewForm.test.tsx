import React from "react";
import "@testing-library/jest-dom";
import { MantineProvider } from "@mantine/core";
import { render, screen, fireEvent } from "@testing-library/react";
import { AffiliateConsultViewForm } from "../AffiliateConsultViewForm";

jest.mock("@/components/common", () => ({
  Loader: ({ isLoading }: any) =>
    isLoading ? <div data-testid="loading">Cargando información...</div> : null,
}));

jest.mock("@/components/SharedComponent", () => ({
  AffiliateForm: ({ form, onSubmit, onReset, config, isArrears }: any) => (
    <div data-testid="mock-affiliate-consult-form">
      <button onClick={onSubmit} data-testid="submit-button">
        Consultar
      </button>
      <button onClick={onReset} data-testid="reset-button">
        Limpiar
      </button>
      <div data-testid="form-config">{JSON.stringify(config)}</div>
      <div data-testid="is-arrears">{isArrears.toString()}</div>
      <div data-testid="form-data">{JSON.stringify(form)}</div>
    </div>
  ),
  AffiliateList: ({
    modalTitle,
    isModalOpen,
    getData,
    onCloseModal,
    initialPageSize,
    setSelectedAffiliate,
  }: any) => (
    <div data-testid="mock-affiliate-list">
      {isModalOpen && <div data-testid="modal-title">{modalTitle}</div>}
      <button
        onClick={() => getData(1, initialPageSize)}
        data-testid="get-data-button"
      >
        Obtener datos
      </button>
      <button onClick={onCloseModal} data-testid="close-modal-button">
        Cerrar modal
      </button>
      <div data-testid="initial-page-size">{initialPageSize}</div>
    </div>
  ),
}));

describe("AffiliateConsultViewForm Component", () => {
  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();
  const mockGetNameSearchData = jest.fn().mockResolvedValue({ data: [] });
  const mockOnCloseNameSearchModal = jest.fn();
  const mockSetSelectedAffiliate = jest.fn();

  const defaultProps = {
    handleFilterSubmit: mockHandleFilterSubmit,
    handleFilterReset: mockHandleFilterReset,
    isLoading: false,
    accountData: [],
    errorMessage: "",
    pensionAccounts: [],
    affiliateConsultData: [],
    filterFormAffiliateConsult: { test: "value" },
    isNameSearchModalOpen: false,
    onCloseNameSearchModal: mockOnCloseNameSearchModal,
    getNameSearchData: mockGetNameSearchData,
    setSelectedAffiliate: mockSetSelectedAffiliate,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <AffiliateConsultViewForm {...defaultProps} {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderComponent();
    expect(
      screen.getByTestId("mock-affiliate-consult-form")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-affiliate-list")).toBeInTheDocument();
  });

  it("renders AffiliateConsultForm with correct props", () => {
    renderComponent();
    expect(screen.getByTestId("form-config")).toHaveTextContent(
      '{"showAccountNumber":true,"showIdentification":true,"showName":true}'
    );
    expect(screen.getByTestId("is-arrears")).toHaveTextContent("false");
    expect(screen.getByTestId("form-data")).toHaveTextContent(
      '{"test":"value"}'
    );
  });

  it("renders AffiliateList with correct props", () => {
    renderComponent({ isNameSearchModalOpen: true });
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Resultados de la búsqueda"
    );
    expect(screen.getByTestId("initial-page-size")).toHaveTextContent("10");
  });

  it("displays loading spinner when isLoading is true", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent(
      "Cargando información..."
    );
  });

  it("does not display loading spinner when isLoading is false", () => {
    renderComponent({ isLoading: false });
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("calls handleFilterSubmit when form submit button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(mockHandleFilterSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls handleFilterReset when form reset button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("reset-button"));
    expect(mockHandleFilterReset).toHaveBeenCalledTimes(1);
  });

  it("calls getNameSearchData when get data button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("get-data-button"));
    expect(mockGetNameSearchData).toHaveBeenCalledWith(1, 10);
  });

  it("calls onCloseNameSearchModal when close modal button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("close-modal-button"));
    expect(mockOnCloseNameSearchModal).toHaveBeenCalledTimes(1);
  });

  it("handles modal visibility correctly", () => {
    const { rerender } = renderComponent({ isNameSearchModalOpen: false });
    expect(screen.queryByTestId("modal-title")).not.toBeInTheDocument();

    rerender(
      <MantineProvider>
        <AffiliateConsultViewForm
          {...defaultProps}
          isNameSearchModalOpen={true}
        />
      </MantineProvider>
    );
    expect(screen.getByTestId("modal-title")).toBeInTheDocument();
  });

  it("passes correct form to AffiliateConsultForm", () => {
    const customForm = { customField: "customValue" };
    renderComponent({ filterFormAffiliateConsult: customForm });
    expect(screen.getByTestId("form-data")).toHaveTextContent(
      JSON.stringify(customForm)
    );
  });
});
