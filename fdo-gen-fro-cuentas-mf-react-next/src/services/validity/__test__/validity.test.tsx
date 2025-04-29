import { httpAdapter } from "../../serviceAdapter";
import { getValidityService } from "../validity";

jest.mock("../../serviceAdapter", () => ({
  httpAdapter: {
    get: jest.fn(),
  },
}));

describe("Validity Service", () => {
  const originalEnv = process.env;
  const mockValidityResponse = {
    data: {
      status: "ACTIVE",
      message: "Account is valid",
    },
  };

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

  describe("getValidityService", () => {
    it("should make a GET request with correct URL and account number", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockValidityResponse);

      const accountNumber = 123456789;
      const result = await getValidityService(accountNumber);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/vigencia/api/consultaVigencia?numeroCuenta=123456789"
      );
      expect(httpAdapter.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockValidityResponse);
    });

    it("should handle errors gracefully and return undefined", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const accountNumber = 123456789;

      const result = await getValidityService(accountNumber);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it("should handle invalid account number", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue({ data: null });

      const invalidAccountNumber = 0;
      const result = await getValidityService(invalidAccountNumber);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/vigencia/api/consultaVigencia?numeroCuenta=0"
      );
      expect(result).toEqual({ data: null });
    });
  });
});
