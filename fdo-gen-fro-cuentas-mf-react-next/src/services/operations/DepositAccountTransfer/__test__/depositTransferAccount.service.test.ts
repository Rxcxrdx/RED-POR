import { mockError } from "@/mocks";
import {
  mockContributionDetail200,
  mockGetAccountsInformation200,
  mockGetBanks200,
  mockGetOfficesInformation200,
} from "@/mocks/depositTransferAccount";

import { httpAdapter } from "@/services/serviceAdapter";
import {
  getAccountsInformationService,
  getBanksService,
  getOfficesInformationService,
  postContributionDetailService,
} from "../depositTransferAccount.service";

jest.mock("../../../serviceAdapter/index.ts", () => ({
  httpAdapter: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("depositTransferAccount services", () => {
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

  describe("postContributionDetailService", () => {
    const mockPayload = {
      cuentaAporteId: "",
      cuentaId: 1231,
      page: { page: 0, size: 30 },
    };

    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockContributionDetail200
      );
      const result = await postContributionDetailService(mockPayload);
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/aporteDetalle/api/DetallesAportes",
        mockPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockContributionDetail200);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await postContributionDetailService(mockPayload);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getBanksService", () => {
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(mockGetBanks200);
    });

    it("should make a GET request with correct URL and payload", async () => {
      const result = await getBanksService();
      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fgngen/cuentas/bancos/api/v1/bancos"
      );
      expect(httpAdapter.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetBanks200);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getBanksService();
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getAccountsInformationService", () => {
    const bankId = 121;
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetAccountsInformation200
      );
    });

    it("should make a GET request with correct URL and payload", async () => {
      const result = await getAccountsInformationService(bankId);
      expect(httpAdapter.get).toHaveBeenCalledWith(
        `http://test-api.com/service/fgngen/cuentas/cuentaBanco/api/v1/informacionCuenta?bancoId=${bankId}`
      );
      expect(httpAdapter.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetAccountsInformation200);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getAccountsInformationService(bankId);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getOfficesInformationService", () => {
    const bankId = 121;
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetOfficesInformation200
      );
    });

    it("should make a POST request with correct URL and payload", async () => {
      const result = await getOfficesInformationService(bankId);
      expect(httpAdapter.get).toHaveBeenCalledWith(
        `http://test-api.com/service/fgngen/cuentas/oficinaBanco/api/v1/informacionOficinas?bancoId=${bankId}`
      );
      expect(httpAdapter.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetOfficesInformation200);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getOfficesInformationService(bankId);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});
