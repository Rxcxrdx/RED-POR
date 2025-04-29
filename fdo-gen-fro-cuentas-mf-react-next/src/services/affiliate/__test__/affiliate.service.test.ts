import { mockAffiliateByNamePost, mockAffiliateResponse } from "@/mocks";
import { httpAdapter } from "../../serviceAdapter/index";
import {
  affiliateGet,
  affiliateByFondoIdGet,
  affiliateByNamePost,
} from "../affiliate";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("Affiliate Services", () => {
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

  describe("affiliateGet", () => {
    it("should make a GET request with correct URL and query parameters", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockAffiliateResponse);

      const payload = {
        numeroIdentificacion: "123456789",
        tipoIdentificacion: "CC",
      };
      const result = await affiliateGet(payload);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/afiliado/api/consultaIdentificacion?tipoIdentificacion=CC&numeroIdentificacion=123456789"
      );
      expect(result).toEqual(mockAffiliateResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");

      const payload = {
        numeroIdentificacion: "123456789",
        tipoIdentificacion: "CC",
      };

      await affiliateGet(payload);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("affiliateByFondoIdGet", () => {
    it("should make a GET request with correct URL", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockResponse);

      const afiliadoFondoId = "12345";
      const result = await affiliateByFondoIdGet(afiliadoFondoId);

      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/afiliado/api/consultaIdentificacionFondo?afiliadoFondoId=12345"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const afiliadoFondoId = "12345";

      await affiliateByFondoIdGet(afiliadoFondoId);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("URL formation", () => {
    it("should handle special characters in parameters for affiliateGet", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockAffiliateResponse);

      const payload = {
        numeroIdentificacion: "123/456%789",
        tipoIdentificacion: "C&C",
      };

      const expectedUrl =
        "http://test-api.com/service/fdogen/cuentas/afiliado/api/consultaIdentificacion?tipoIdentificacion=C&C&numeroIdentificacion=123/456%789";

      await affiliateGet(payload);

      expect(httpAdapter.get).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe("affiliateByNamePost", () => {
    (httpAdapter.post as jest.Mock).mockResolvedValue(mockAffiliateByNamePost);
    it("should make a request with correct URL when is called", async () => {
      const payload = {};
      const result = await affiliateByNamePost(payload);
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/afiliado/api/consultaNombres",
        payload
      );
      expect(result).toEqual(mockAffiliateByNamePost);
    });
  });
});
