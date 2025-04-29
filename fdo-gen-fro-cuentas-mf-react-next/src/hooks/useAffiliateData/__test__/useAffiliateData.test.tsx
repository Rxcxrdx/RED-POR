import { renderHook, act } from "@testing-library/react";
import { useAffiliateData } from "../useAffiliateData";
import * as services from "@/services";
import { Toast } from "pendig-fro-transversal-lib-react";
import * as components from "@/components";
import { formatBalanceValue } from "@/common/utils";

jest.mock("@/services", () => ({
  affiliateGet: jest.fn(),
  affiliateByNamePost: jest.fn(),
  accountByAccountIdGet: jest.fn(),
  affiliateByFondoIdGet: jest.fn(),
  accountByAffiliateIdGet: jest.fn(),
  accountByIdentificationNumber: jest.fn(),
  accountByIdentificationIDPost: jest.fn(),
  weeksByIdentificationNumber: jest.fn(),
  getBalanceByAccountNumber: jest.fn(),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Toast: {
    showStatusCode: jest.fn(),
    show: jest.fn(),
  },
}));

jest.mock("@/components", () => ({
  showCustomToast: jest.fn(),
}));

jest.mock("@/common/utils", () => ({
  formatBalanceValue: jest.fn((value) => `$${value}`),
}));

describe("useAffiliateData Hook", () => {
  const mockForm = {
    getValues: jest.fn(),
    reset: jest.fn(),
  };

  const mockContext = {
    accountData: [],
    setAccountData: jest.fn(),
    pensionAccounts: [],
    setPensionAccounts: jest.fn(),
    setCuentaId: jest.fn(),
    balanceData: null,
    setUserDetail: jest.fn(),
    setBalanceData: jest.fn(),
    affiliateDetail: null,
    setAffiliateDetail: jest.fn(),
    setSelectedContributions: jest.fn(),
    registerFilterReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with correct default values", () => {
    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe("");
    expect(result.current.isNameSearchModalOpen).toBe(false);
    expect(result.current.selectedAffiliate).toBe(null);
    expect(result.current.affiliateConsultData).toEqual([]);
  });

  test("handleFilterReset resets form and state", () => {
    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    act(() => {
      result.current.handleFilterReset();
    });

    expect(mockForm.reset).toHaveBeenCalled();
    expect(mockContext.setCuentaId).toHaveBeenCalledWith(null);
    expect(mockContext.setAccountData).toHaveBeenCalledWith([]);
    expect(mockContext.setPensionAccounts).toHaveBeenCalledWith([]);
    expect(mockContext.setUserDetail).toHaveBeenCalledWith(null);
    expect(mockContext.setAffiliateDetail).toHaveBeenCalledWith(null);
    expect(mockContext.setSelectedContributions).toHaveBeenCalledWith([]);
    expect(mockContext.setBalanceData).toHaveBeenCalledWith(null);
  });

  test("handleFilterSubmit with missing required fields shows error", async () => {
    mockForm.getValues.mockReturnValue({
      primerNombre: "",
      primerApellido: "",
      numeroCuenta: "",
      numeroIdentificacion: "",
      tipoIdentificacion: "",
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(Toast.showStatusCode).toHaveBeenCalledWith(400);
  });

  test("handleFilterSubmit with name search opens name search modal", async () => {
    mockForm.getValues.mockReturnValue({
      primerNombre: "Juan",
      primerApellido: "Perez",
      numeroCuenta: "",
      numeroIdentificacion: "",
      tipoIdentificacion: "",
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(result.current.isNameSearchModalOpen).toBe(true);
  });

  test("getNameSearchData calls affiliateByNamePost with correct params", async () => {
    mockForm.getValues.mockReturnValue({
      primerNombre: "Juan",
      primerApellido: "Perez",
      segundoNombre: "",
      segundoApellido: "",
    });

    (services.affiliateByNamePost as jest.Mock).mockResolvedValue({
      data: { afiliado: [] },
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.getNameSearchData(1, 10);
    });

    expect(services.affiliateByNamePost).toHaveBeenCalledWith({
      primerNombre: "JUAN",
      primerApellido: "PEREZ",
      segundoNombre: null,
      segundoApellido: null,
      page: {
        page: 1,
        size: 10,
      },
    });
  });

  test("onCloseNameSearchModal closes the modal", () => {
    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    act(() => {
      result.current.setIsNameSearchModalOpen(true);
    });

    expect(result.current.isNameSearchModalOpen).toBe(true);

    act(() => {
      result.current.onCloseNameSearchModal();
    });

    expect(result.current.isNameSearchModalOpen).toBe(false);
  });

  test("fetchAffiliateData success flow with valid ID", async () => {
    const mockAffiliate = [
      {
        numeroIdentificacion: "1234567890",
        tipoIdentificacion: "CC",
        primerNombre: "Juan",
        segundoNombre: null,
        primerApellido: "Perez",
        segundoApellido: null,
        afiliadoFondoId: "123",
      },
    ];

    mockForm.getValues.mockReturnValue({
      numeroIdentificacion: "1234567890",
      tipoIdentificacion: "CC",
    });

    (services.affiliateGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { afiliado: mockAffiliate },
    });

    (services.accountByAffiliateIdGet as jest.Mock).mockResolvedValue({
      data: { account: [] },
    });

    (services.accountByIdentificationNumber as jest.Mock).mockResolvedValue({
      data: { cuentasPensionesObligatorias: [] },
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(services.affiliateGet).toHaveBeenCalled();
    expect(mockContext.setAffiliateDetail).toHaveBeenCalled();
    expect(result.current.errorMessage).toBe("");
  });

  test("fetchAffiliateData handles service error", async () => {
    mockForm.getValues.mockReturnValue({
      numeroIdentificacion: "1234567890",
      tipoIdentificacion: "CC",
      numeroCuenta: "",
    });

    (services.affiliateGet as jest.Mock).mockRejectedValue(
      new Error("Service error")
    );

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(Toast.showStatusCode).toHaveBeenCalledWith(500);
  });

  test("handleFilterSubmit with account number calls accountByAccountIdGet", async () => {
    mockForm.getValues.mockReturnValue({
      numeroCuenta: "123456789",
      numeroIdentificacion: "",
      tipoIdentificacion: "",
    });

    (services.accountByAccountIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { account: [] },
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(services.accountByAccountIdGet).toHaveBeenCalledWith("123456789");
  });

  test("updateAccountDataWithBalanceTotals correctly formats totals", async () => {
    const mockBalanceData = [
      { pesosObligatorio: "1000000" },
      { pesosObligatorio: "2000000" },
    ];

    mockContext.setBalanceData.mockImplementation((data) => {
      mockContext.balanceData = data;
    });

    (services.getBalanceByAccountNumber as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { saldos: mockBalanceData },
    });

    const { result, rerender } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: { ...mockContext } })
    );

    await act(async () => {
      mockContext.balanceData = mockBalanceData;
      rerender();
    });

    expect(mockContext.setAccountData).toHaveBeenCalled();
  });

  test("transformAffiliateData formats affiliate data correctly", async () => {
    const mockAffiliates = [
      {
        primerNombre: "Juan",
        segundoNombre: null,
        primerApellido: "Perez",
        segundoApellido: "Gomez",
        numeroIdentificacion: "1234567890",
        tipoIdentificacion: "CC",
        afiliadoFondoId: "123",
        fechaNacimiento: "1990-01-01",
        sexo: "M",
        problemasRegistraduria: "N",
      },
    ];

    (services.affiliateGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { afiliado: mockAffiliates },
    });

    mockForm.getValues.mockReturnValue({
      numeroCuenta: "",
      numeroIdentificacion: "1234567890",
      tipoIdentificacion: "CC",
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    mockContext.setUserDetail.mockImplementationOnce((userData) => {
      if (userData) {
        expect(userData.nombreCompleto).toBe("Juan Perez Gomez");
        expect(userData.infoTabla.genero).toBe("Masculino");
        expect(userData.infoTabla.registraduria).toBe("No");
      }
    });

    await act(async () => {
      await result.current.handleFilterSubmit();
    });
  });

  test("setSelectedAffiliate triggers data fetching", async () => {
    const mockSelectedAffiliate = {
      afiliadoFondoId: "123",
      identificacion: "1234567890",
      tipoId: "CC",
    };

    (services.affiliateByFondoIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: {
        afiliado: [
          {
            primerNombre: "Juan",
            primerApellido: "Perez",
          },
        ],
      },
    });

    (services.accountByAffiliateIdGet as jest.Mock).mockResolvedValue({
      data: { account: [] },
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      result.current.setSelectedAffiliate(mockSelectedAffiliate);
    });

    expect(services.affiliateByFondoIdGet).toHaveBeenCalledWith("123");
    expect(services.accountByAffiliateIdGet).toHaveBeenCalledWith("123");
    expect(result.current.isNameSearchModalOpen).toBe(false);
  });

  test("fetchBalanceByAccountId formats and updates data correctly", async () => {
    const mockBalanceResponse = {
      status: { statusCode: 200 },
      data: {
        saldos: [
          { pesosObligatorio: "1000000" },
          { pesosObligatorio: "2000000" },
        ],
      },
    };

    (services.getBalanceByAccountNumber as jest.Mock).mockResolvedValue(
      mockBalanceResponse
    );

    (services.accountByAccountIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: {
        account: [
          {
            cuentaId: "123456789",
            afiliadoFondoId: "123",
          },
        ],
      },
    });

    mockForm.getValues.mockReturnValue({
      numeroCuenta: "123456789",
      numeroIdentificacion: "",
      tipoIdentificacion: "",
    });

    const { result } = renderHook(() =>
      useAffiliateData({ form: mockForm, context: mockContext })
    );

    await act(async () => {
      await result.current.handleFilterSubmit();
    });

    expect(services.getBalanceByAccountNumber).toHaveBeenCalledWith(
      "123456789"
    );

    expect(mockContext.setBalanceData).toHaveBeenCalledWith(
      mockBalanceResponse.data.saldos
    );
  });
});
