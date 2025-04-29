import { mockAccountResponse } from "@/mocks";
import { httpAdapter } from "../../serviceAdapter/index";
import {
  accountByAffiliateIdGet,
  accountByAccountIdGet,
  accountByIdentificationNumber,
} from "../accounts";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
  },
}));

describe("Account Services", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_BASE_URL: "http://test-api.com",
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("accountByAffiliateIdGet", () => {
    it("should make a GET request with correct URL", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockAccountResponse);

      const afiliadoFondoId = "12345";
      const result = await accountByAffiliateIdGet(afiliadoFondoId);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/cuenta/api/consultaPorAfiliadoId?afiliadoFondoId=12345"
      );
      expect(result).toEqual(mockAccountResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const afiliadoFondoId = "12345";

      await accountByAffiliateIdGet(afiliadoFondoId);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("accountByAccountIdGet", () => {
    it("should make a GET request with correct URL", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockResponse);

      const cuentaId = "67890";
      const result = await accountByAccountIdGet(cuentaId);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/cuenta/api/consultaPorCuentaId?cuentaId=67890"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const cuentaId = "67890";

      await accountByAccountIdGet(cuentaId);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("accountByIdentificationNumber", () => {
    it("should make a GET request with correct URL and headers", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockResponse);

      const numeroIdentificacion = "123456789";
      const tipoIdentificacion = "CC";

      const expectedHeaders = {
        "X-RqUID": "1458859966",
        "X-Channel": "ZTA",
        "X-IdentSerialNum": numeroIdentificacion,
        "X-GovIssueIdentType": tipoIdentificacion,
        "X-Sesskey": "sasas54s5a45s4s45s",
        "X-IPAddr": "0.0.0.0",
        "X-NextDt": "2023-06-21T15:25:59.125",
      };

      const result = await accountByIdentificationNumber(
        numeroIdentificacion,
        tipoIdentificacion
      );

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/obligatorias/cuentas/v1/porvenir/consultaproducto/consulta/afiliado",
        { headers: expectedHeaders }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when request fails", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");

      await expect(
        accountByIdentificationNumber("123456789", "CC")
      ).rejects.toThrow("Network error");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching account by identification number:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("URL formation", () => {
    it("should handle special characters in parameters", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockResponse);

      const numeroIdentificacion = "123/456%789";
      const tipoIdentificacion = "C&C";

      await accountByIdentificationNumber(
        numeroIdentificacion,
        tipoIdentificacion
      );

      expect(httpAdapter.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-IdentSerialNum": numeroIdentificacion,
            "X-GovIssueIdentType": tipoIdentificacion,
          }),
        })
      );
    });
  });
});
