import { httpAdapter } from "../../serviceAdapter";

import {
  mockCreateValidationService,
  mockError,
  mockPostSearchValidationService,
  mockPostValidationOperationService,
  mockUpdateValidationService,
  mockUpdateValidationStateService,
} from "@/mocks";

import {
  mockGetOperationsType200,
  mockGetOperationsType206,
  mockGetOperationsType400,
  mockPostAssociateValidationOperation200,
  mockPostAssociateValidationOperation206,
  mockPostAssociateValidationOperation400,
} from "@/mocks/validation";

import {
  createValidationService,
  getOperationsTypeService,
  postAssociateValidationOperationService,
  postSearchValidationsService,
  postValidationOperationService,
  updateValidationService,
  updateValidationStateService,
} from "../validation.service";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("validation services", () => {
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

  describe("postValidationOperationService", () => {
    const mockPayload = {
      codigoOperacionId: "123",
      estado: "ACTIVE",
      page: { page: 0, size: 10 },
    };

    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostValidationOperationService
      );

      const result = await postValidationOperationService(mockPayload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/validacion/api/operacionValidacion",
        mockPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPostValidationOperationService);
    });

    it("should throw error when request fails", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");

      await expect(postValidationOperationService(mockPayload)).rejects.toThrow(
        "Network error"
      );

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("postSearchValidationsService", () => {
    const mockPayload = {
      validacionId: "456",
      page: {
        page: 0,
        size: 10,
      },
    };

    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostSearchValidationService
      );

      const result = await postSearchValidationsService(mockPayload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/validacion/api/consultaValidaciones",
        mockPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPostSearchValidationService);
    });

    it("should throw error when request fails", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");

      await expect(postSearchValidationsService(mockPayload)).rejects.toThrow(
        "Network error"
      );

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("createValidation service", () => {
    const payload = {
      nombre: "test",
      descripcion: "test test",
      usuario: "test",
    };

    beforeEach(() => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockCreateValidationService
      );
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await createValidationService(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/crearValidacion/api/crearValidacion",
        payload
      );
    });

    it("should receive successful response when request success", async () => {
      const result = await createValidationService(payload);
      expect(result).toEqual(mockCreateValidationService);
    });
    // it("should throw error when request fails", () => {});
  });

  describe("updateValidationService service", () => {
    const payload = {
      validacionId: "6",
      nombre: "Validar bloqueo pagos",
      descripcion: "Valida si el fondo esta bloqueado para pagos",
      usuarioUltimaModificacion: "test",
    };
    beforeEach(() => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockUpdateValidationService
      );
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await updateValidationService(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/crearValidacion/api/actualizarValidacion",
        payload
      );
    });
    // it("should receive successful response when request success", () => {});
    // it("should throw error when request fails", () => {});
  });

  describe("updateValidationStateService service", () => {
    const payload = {
      validacionId: "6",
      codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
      estado: "ACTIVO",
      usuarioUltimaModificacion: "test",
    };

    beforeEach(() => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockUpdateValidationStateService
      );
    });

    it("should make a request with correct URL when is called", async () => {
      const result = await updateValidationStateService(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/crearValidacion/api/actualizarOperacionValidacion",
        payload
      );
      expect(result).toEqual(mockUpdateValidationStateService);
    });

    // it("should receive successful response when request success", () => {});

    it("should handle error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await updateValidationStateService(payload);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("getOperationsTypeService", () => {
    beforeEach(() => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetOperationsType200
      );
    });

    it("should make a request with correct URL when service is called", async () => {
      const result = await getOperationsTypeService();
      expect(httpAdapter.get).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/consultaOperacion/api/operacion"
      );
      expect(result).toEqual(mockGetOperationsType200);
    });

    it("should receive successful response when request success", async () => {
      const result = await getOperationsTypeService();
      expect(result?.status?.statusCode).toEqual(200);
    });

    it("should receive successful response when request return 206 code", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetOperationsType206
      );
      const result = await getOperationsTypeService();
      expect(result?.status?.statusCode).toEqual(206);
    });

    it("should receive successful response when request return 400 code", async () => {
      (httpAdapter.get as jest.Mock).mockResolvedValue(
        mockGetOperationsType400
      );
      const result = await getOperationsTypeService();
      expect(result?.status?.statusCode).toEqual(400);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.get as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await getOperationsTypeService();
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("postAssociateValidationOperationService", () => {
    const associateValidationPayload = {
      validacionId: "6",
      codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
      usuarioCreacion: "test",
    };
    beforeEach(() => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostAssociateValidationOperation200
      );
    });

    it("should make a request with correct URL when service is called", async () => {
      const result = await postAssociateValidationOperationService(
        associateValidationPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/crearValidacion/api/crearOperacionValidacion",
        associateValidationPayload
      );
      expect(result).toEqual(mockPostAssociateValidationOperation200);
    });

    it("should receive successful response when request success", async () => {
      const result = await postAssociateValidationOperationService(
        associateValidationPayload
      );
      expect(result?.status?.statusCode).toEqual(200);
    });

    it("should receive successful response when request return 206 code", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostAssociateValidationOperation206
      );
      const result = await postAssociateValidationOperationService(
        associateValidationPayload
      );
      expect(result?.status?.statusCode).toEqual(206);
    });

    it("should receive successful response when request return 400 code", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostAssociateValidationOperation400
      );
      const result = await postAssociateValidationOperationService(
        associateValidationPayload
      );
      expect(result?.status?.statusCode).toEqual(400);
    });

    it("should handle error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, "error");
      await postAssociateValidationOperationService(associateValidationPayload);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});
