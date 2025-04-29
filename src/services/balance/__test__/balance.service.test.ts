import { mockError, mockGetBalanceResponse, mockGetDispersion } from "@/mocks";

import { httpAdapter } from "../../serviceAdapter/index";
import { getBalanceByAccountNumber, getDispersionService } from "../balance";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
  },
}));

describe("Balance services", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_BASE_URL: "http://test-api.com",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe("getBalanceByAccountNumber", () => {
    const afiliadoFondoId = 12345;
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockGetBalanceResponse);
    });

    it("should make a GET request with correct URL", async () => {
      const result = await getBalanceByAccountNumber(afiliadoFondoId);
      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/saldoPortafolio/api/consultaSaldos?numeroCuenta=12345"
      );
      expect(result).toEqual(mockGetBalanceResponse);
    });

    it("should throw error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getBalanceByAccountNumber(afiliadoFondoId);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getDispersionService service", () => {
    const afiliadoFondoId = 12345;
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockGetDispersion);
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await getDispersionService(afiliadoFondoId);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        `http://test-api.com/service/fdogen/cuentas/dispersion/api/consultaDispersion?numeroCuenta=${afiliadoFondoId}`
      );
      expect(result).toEqual(mockGetDispersion);
    });
    // it("should receive successful response when request success", () => {});
    it("should throw error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getDispersionService(afiliadoFondoId);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});
