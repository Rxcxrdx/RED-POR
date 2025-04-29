import { mockMovementsResponse, mockConceptsResponse } from "@/mocks";
import { httpAdapter } from "../../serviceAdapter/index";
import { movementsPost, conceptsGet } from "../movements";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("Services", () => {
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

  describe("movementsPost", () => {
    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(mockMovementsResponse);

      const payload = {
        accountId: "123",
        dateFrom: "2023-01-01",
        dateTo: "2023-12-31",
      };
      const result = await movementsPost(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/movimiento/api/darMovimientos",
        payload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMovementsResponse);
    });

    it("should handle errors gracefully and return undefined", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const payload = {
        accountId: "123",
        dateFrom: "2023-01-01",
        dateTo: "2023-12-31",
      };

      const result = await movementsPost(payload);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it("should handle empty payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue({ data: [] });
      
      const result = await movementsPost({});
      
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/movimiento/api/darMovimientos",
        {}
      );
      expect(result).toEqual({ data: [] });
    });
  });

  describe("conceptsGet", () => {
    it("should make a GET request with correct URL", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockConceptsResponse);

      const result = await conceptsGet();

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/concepto/api/consultaPorAfectaSaldoCuenta?afectaSaldoCuenta=NO"
      );
      expect(httpAdapter.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockConceptsResponse);
    });

    it("should handle errors gracefully and return undefined", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      
      const result = await conceptsGet();

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });
});