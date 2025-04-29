import { httpAdapter } from "../../serviceAdapter/index";
import { contributionPost, contributionDetailPost } from "../contributions";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    post: jest.fn(),
  },
}));

describe("Contribution Services", () => {
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

  describe("contributionPost", () => {
    it("should make a POST request with correct URL and payload", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

      const payload = { field1: "value1", field2: "value2" };
      const result = await contributionPost(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/aporte/api/Aportes",
        payload
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const payload = { field1: "value1", field2: "value2" };

      await contributionPost(payload);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("contributionDetailPost", () => {
    it("should make a POST request with correct URL and payload", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

      const payload = {
        aporteId: "12345",
        numeroCuenta: "67890",
      };

      const result = await contributionDetailPost(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/aporteDetalle/api/DetallesAportes",
        payload
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const payload = {
        aporteId: "12345",
        numeroCuenta: "67890",
      };

      await contributionDetailPost(payload);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});