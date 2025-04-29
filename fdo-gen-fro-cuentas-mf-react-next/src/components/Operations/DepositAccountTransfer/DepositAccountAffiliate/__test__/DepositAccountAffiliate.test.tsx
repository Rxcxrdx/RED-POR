import React from "react";
import { render } from "@testing-library/react";
import { DepositAccountAffiliate } from "../DepositAccountAffiliate";
import { useAffiliateData } from "@/hooks";
import { DepositAccountTransferContext } from "@/context";

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

jest.mock("../DepositAccountAffiliateView", () => ({
  DepositAccountAffiliateView: (props: any) => (
    <div data-testid="deposit-account-affiliate-view">
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
        {JSON.stringify(props.filterFormDepositAccountAffiliate)}
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

describe("DepositAccountAffiliate", () => {
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
      <DepositAccountTransferContext.Provider value={mockContext}>
        <DepositAccountAffiliate />
      </DepositAccountTransferContext.Provider>
    );
  };

  test("renderiza sin errores", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("deposit-account-affiliate-view")).toBeInTheDocument();
  });

  test("inicializa el hook con el formulario y contexto correctos", () => {
    renderComponent();
    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall).toHaveProperty("form");
    expect(hookCall).toHaveProperty("context", mockContext);
  });

  test("pasa las props correctas a DepositAccountAffiliateView", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("false");
    expect(getByTestId("error")).toHaveTextContent("");
    expect(getByTestId("account-data")).toHaveTextContent("[]");
    expect(getByTestId("pension-accounts")).toHaveTextContent("[]");
    expect(getByTestId("affiliate-data")).toHaveTextContent("[]");
    expect(getByTestId("modal-open")).toHaveTextContent("false");
  });

  test("maneja el estado de carga correctamente", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("true");
  });

  test("maneja el estado de error correctamente", () => {
    const errorMessage = "Mensaje de error de prueba";
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("error")).toHaveTextContent(errorMessage);
  });

  test("maneja los datos de cuenta correctamente", () => {
    const mockAccountData = [{ id: 1, name: "Cuenta de Prueba" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      accountData: mockAccountData,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("account-data")).toHaveTextContent(
      JSON.stringify(mockAccountData)
    );
  });

  test("maneja las cuentas de pensión correctamente", () => {
    const mockPensionAccounts = [{ id: 1, type: "Pensión" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      pensionAccounts: mockPensionAccounts,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("pension-accounts")).toHaveTextContent(
      JSON.stringify(mockPensionAccounts)
    );
  });

  test("maneja los datos de afiliado correctamente", () => {
    const mockAffiliateData = [{ id: 1, name: "Juan Pérez" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      affiliateConsultData: mockAffiliateData,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("affiliate-data")).toHaveTextContent(
      JSON.stringify(mockAffiliateData)
    );
  });

  test("maneja el estado del modal correctamente", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isNameSearchModalOpen: true,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId("modal-open")).toHaveTextContent("true");
  });

  test("provee la instancia correcta del formulario al hook", () => {
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

  test("provee el contexto correcto al hook", () => {
    renderComponent();
    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall.context).toBe(mockContext);
  });

  test("todos los manejadores del formulario son pasados al componente vista", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("submit-button")).toBeInTheDocument();
    expect(getByTestId("reset-button")).toBeInTheDocument();
    expect(getByTestId("close-modal-button")).toBeInTheDocument();
  });
});
