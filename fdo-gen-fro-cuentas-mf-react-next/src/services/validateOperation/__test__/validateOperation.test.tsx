import { validateOperationPost } from "../validateOperation";
import { httpAdapter } from "../../serviceAdapter";

jest.mock("../../serviceAdapter", () => ({
  httpAdapter: {
    post: jest.fn(),
  },
}));

describe("validateOperationPost", () => {
  const mockPayload = {
    data: "test data",
  };

  const mockResponse = {
    status: 200,
    data: {
      success: true,
      message: "Operation validated successfully",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "http://test-api.com";
  });

  it("debería llamar al endpoint correcto con el payload proporcionado", async () => {
    (httpAdapter.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await validateOperationPost(mockPayload);

    expect(httpAdapter.post).toHaveBeenCalledWith(
      "http://test-api.com/service/fdogen/cuentas/validarOperacion/api/validate",
      mockPayload
    );

    expect(httpAdapter.post).toHaveBeenCalledTimes(1);

    expect(response).toEqual(mockResponse);
  });

  it("debería manejar errores correctamente", async () => {
    const mockError = new Error("Network error");
    (httpAdapter.post as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleSpy = jest.spyOn(console, "error");

    const response = await validateOperationPost(mockPayload);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    expect(response).toBeUndefined();

    consoleSpy.mockRestore();
  });

  it("debería manejar respuestas vacías", async () => {
    (httpAdapter.post as jest.Mock).mockResolvedValueOnce(null);

    const response = await validateOperationPost(mockPayload);

    expect(response).toBeNull();
  });

  it("debería manejar diferentes tipos de payload", async () => {
    const payloads = [
      { number: 123 },
      { string: "test" },
      { nested: { data: "test" } },
      { array: [1, 2, 3] },
      null,
      undefined,
    ];

    (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

    for (const payload of payloads) {
      await validateOperationPost(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        expect.any(String),
        payload
      );
    }
  });
});
