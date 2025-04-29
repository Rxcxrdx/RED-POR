import { httpAdapter } from "@/services/serviceAdapter";
import {
  mockError,
  mockGetCaseApprovalInformationResponse,
  mockGetConsultCasesResponse,
} from "@/mocks";

// TODO: uncomment tests when complete integration of these services

import {
  getCaseApprovalInformationService,
  postCasesService,
  postCaseApprovalService,
} from "../consultCases.service";

jest.mock("../../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("consultCases services", () => {
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

  describe("postCasesService", () => {
    const mockPayload = {
      casoId: null,
      cuentaId: null,
      codigoOperacionId: null,
      estado: null,
      fechaInicial: null,
      fechaFinal: null,
      usuario: null,
      page: { page: 0, size: 10 },
    };
    beforeEach(() => {
      jest.clearAllMocks();
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockGetConsultCasesResponse
      );
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await postCasesService(mockPayload);
      expect(httpAdapter.post).toHaveBeenCalledWith(
        `http://test-api.com/service/fdogen/cuentas/casos/api/consultaCasos`,
        mockPayload
      );
      expect(result).toEqual(mockGetConsultCasesResponse);
    });

    // it("should receive successful response when request success", () => {});
    it("should throw error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await expect(postCasesService(mockPayload)).rejects.toThrow(
        "Network error"
      );
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getCaseApprovalInformationService", () => {
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetCaseApprovalInformationResponse
      );
    });
    it("should make a request with correct URL when is called", async () => {
      const result = await getCaseApprovalInformationService();
      expect(result).toEqual(mockGetCaseApprovalInformationResponse);
    });
    // it("should receive successful response when request success", () => {});
    // it("should throw error when request fails", async () => {
    //   (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);

    //   const consoleSpy = jest.spyOn(console, "error");
    //   await getCaseApprovalInformationService();
    //   expect(consoleSpy).toHaveBeenCalledWith(mockError);
    //   consoleSpy.mockRestore();
    // });
  });

  describe("postCaseApprovalService", () => {
    beforeEach(() => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockGetCaseApprovalInformationResponse
      );
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await postCaseApprovalService();
      expect(result).toEqual(mockGetCaseApprovalInformationResponse);
    });
    // it("should receive successful response when request success", () => {});
    // it("should throw error when request fails", async () => {
    //   (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

    //   const consoleSpy = jest.spyOn(console, "error");
    //   await postCaseApprovalService();
    //   expect(consoleSpy).toHaveBeenCalledWith(mockError);
    //   consoleSpy.mockRestore();
    // });
  });
});
