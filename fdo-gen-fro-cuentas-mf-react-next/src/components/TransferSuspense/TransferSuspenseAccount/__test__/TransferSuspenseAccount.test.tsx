import React from "react";
import { render } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { TransferSuspenseAccount } from "../TransferSuspenseAccount";
import { useAffiliateData } from "@/hooks";
import { TransferSuspenseContext } from "@/context";

jest.mock("@/hooks", () => ({
  useAffiliateData: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(),
    register: jest.fn(),
    formState: { mode: "onChange" },
    getValues: jest.fn(),
    setValue: jest.fn(),
    reset: jest.fn(),
    defaultValues: {
      numeroCuenta: "",
      numeroIdentificacion: "",
      tipoIdentificacion: null,
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
    },
  })),
}));

jest.mock("../TransferSuspenseAccountView", () => ({
  TransferSuspenseAccountView: (props: any) => (
    <div data-testid="transfer-suspense-view">
      <div data-testid="loading">{props.isLoading.toString()}</div>
      <div data-testid="error">{props.errorMessage}</div>
      <div data-testid="account-data">{JSON.stringify(props.accountData)}</div>
      <div data-testid="pension-accounts">
        {JSON.stringify(props.pensionAccounts)}
      </div>
      <div data-testid="affiliate-data">
        {JSON.stringify(props.affiliateConsultData)}
      </div>
      <div data-testid="modal-open">
        {props.isNameSearchModalOpen.toString()}
      </div>
      <div data-testid="form-data">
        {JSON.stringify(props.filterFormTransferSuspenseAccount)}
      </div>
      <button data-testid="submit-button" onClick={props.handleFilterSubmit}>
        Submit
      </button>
      <button data-testid="reset-button" onClick={props.handleFilterReset}>
        Reset
      </button>
      <button
        data-testid="close-modal-button"
        onClick={props.onCloseNameSearchModal}
      >
        Close Modal
      </button>
    </div>
  ),
}));

describe("TransferSuspenseAccount", () => {
  // Mock data para el hook
  const mockHookData = {
    isLoading: false,
    accountData: [],
    errorMessage: "",
    pensionAccounts: [],
    affiliateConsultData: [],
    isNameSearchModalOpen: false,
    getNameSearchData: jest.fn(),
    handleFilterReset: jest.fn(),
    handleFilterSubmit: jest.fn(),
    setSelectedAffiliate: jest.fn(),
    onCloseNameSearchModal: jest.fn(),
  };

  // Mock del contexto
  const mockContext = {
    setCuentaId: jest.fn(),
    setUserDetail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAffiliateData as jest.Mock).mockReturnValue(mockHookData);
  });

  const renderComponent = () => {
    return render(
      <TransferSuspenseContext.Provider value={mockContext}>
        <TransferSuspenseAccount />
      </TransferSuspenseContext.Provider>
    );
  };

  test("renders without crashing", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("transfer-suspense-view")).toBeInTheDocument();
  });

  test("initializes hook with correct form and context", () => {
    renderComponent();

    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall).toHaveProperty("form");
    expect(hookCall).toHaveProperty("context", mockContext);
  });

  test("passes correct props to TransferSuspenseAccountView", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("loading")).toHaveTextContent("false");
    expect(getByTestId("error")).toHaveTextContent("");
    expect(getByTestId("account-data")).toHaveTextContent("[]");
    expect(getByTestId("pension-accounts")).toHaveTextContent("[]");
    expect(getByTestId("affiliate-data")).toHaveTextContent("[]");
    expect(getByTestId("modal-open")).toHaveTextContent("false");
  });

  test("handles loading state correctly", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("true");
  });

  test("handles error state correctly", () => {
    const errorMessage = "Test error message";
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("error")).toHaveTextContent(errorMessage);
  });

  test("handles account data correctly", () => {
    const mockAccountData = [{ id: 1, name: "Test Account" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      accountData: mockAccountData,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("account-data")).toHaveTextContent(
      JSON.stringify(mockAccountData)
    );
  });

  test("handles pension accounts correctly", () => {
    const mockPensionAccounts = [{ id: 1, type: "Pension" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      pensionAccounts: mockPensionAccounts,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("pension-accounts")).toHaveTextContent(
      JSON.stringify(mockPensionAccounts)
    );
  });

  test("handles affiliate data correctly", () => {
    const mockAffiliateData = [{ id: 1, name: "John Doe" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      affiliateConsultData: mockAffiliateData,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("affiliate-data")).toHaveTextContent(
      JSON.stringify(mockAffiliateData)
    );
  });

  test("handles modal state correctly", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isNameSearchModalOpen: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("modal-open")).toHaveTextContent("true");
  });

  test("provides correct form instance to hook", () => {
    renderComponent();

    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall.form).toBeDefined();
    expect(hookCall.form).toHaveProperty("register");
    expect(hookCall.form).toHaveProperty("handleSubmit");
    expect(hookCall.form).toHaveProperty("formState");
    expect(hookCall.form).toHaveProperty("getValues");
    expect(hookCall.form).toHaveProperty("setValue");
    expect(hookCall.form).toHaveProperty("reset");
  });

  test("provides correct context to hook", () => {
    renderComponent();

    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall.context).toBe(mockContext);
  });

  test("all form handlers are passed to view component", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("submit-button")).toBeInTheDocument();
    expect(getByTestId("reset-button")).toBeInTheDocument();
    expect(getByTestId("close-modal-button")).toBeInTheDocument();
  });
});
