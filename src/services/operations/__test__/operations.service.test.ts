import { httpAdapter } from "@/services/serviceAdapter";
import { mockError } from "@/mocks";
import {
  mockPostApplyOperation200,
  mockPostRejectOperation200,
} from "@/mocks/operations/operations.mock";
import {
  postApplyOperationService,
  postRejectOperationService,
} from "../operations.service";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("Operations services", () => {
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

  describe("postApplyOperationService", () => {
    const mockPayload = {
      codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
      numeroCuenta: 52504333,
      administradora: "",
      aseguradora: "",
      usuarioCreacion: "POR12448",
      casoId: 10,
      listaAportes: [
        {
          cuentaAporteId: 2692,
          listaDetalles: [{ cuentaAporteDetalleId: "4856017538" }],
        },
      ],
    };

    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostApplyOperation200
      );

      const result = await postApplyOperationService(mockPayload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/operacion/api/aplicarOperacion",
        mockPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPostApplyOperation200);
    });

    it("should throw error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      await postApplyOperationService(mockPayload);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("postRejectOperationService", () => {
    const mockPayload = {
      casoId: 5,
      estado: "RECHAZADO",
      usuarioUltimaModificacion: "POR12448",
    };

    it("should make a POST request with correct URL and payload", async () => {
      (httpAdapter.post as jest.Mock).mockResolvedValue(
        mockPostRejectOperation200
      );

      const result = await postRejectOperationService(mockPayload);
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/caso/api/actualizarEstadoCaso",
        mockPayload
      );
      expect(httpAdapter.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPostRejectOperation200);
    });

    it("should throw error when request fails", async () => {
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      await expect(postRejectOperationService(mockPayload)).rejects.toThrow(
        "Network error"
      );
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});
