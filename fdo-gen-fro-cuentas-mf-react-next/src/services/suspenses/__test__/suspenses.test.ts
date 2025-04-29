import { httpAdapter } from "../../serviceAdapter/index";
import { suspensePost, suspenseMovementsPost, suspenseUpdatePost } from "../suspenses";

jest.mock("../../serviceAdapter/index", () => ({
  httpAdapter: {
    post: jest.fn(),
  },
}));

describe("Suspense Services", () => {
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

  describe("suspensePost", () => {
    it("should make a POST request with correct URL and payload", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);
  
      const payload = { field1: "value1", field2: "value2" };
      const result = await suspensePost(payload);
  
      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/consultaRezago/api/rezagos",
        payload
      );
      expect(result).toEqual(mockResponse);
    });
  
    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);
  
      const consoleSpy = jest.spyOn(console, "error");
      const payload = { field1: "value1", field2: "value2" };
  
      await suspensePost(payload);
  
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

describe("suspenseUpdatePost", () => {
  it("should make a POST request with correct URL and payload", async () => {
    const mockResponse = { data: "test data" };
    (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

    const payload = { field1: "value1", field2: "value2" };
    const result = await suspenseUpdatePost(payload);

    expect(httpAdapter.post).toHaveBeenCalledWith(
      "http://test-api.com/service/fdogen/cuentas/rezagoNovedad/api/consultaRezagoNovedad",
      payload
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Network error");
    (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, "error");
    const payload = { field1: "value1", field2: "value2" };

    await suspenseUpdatePost(payload);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    consoleSpy.mockRestore();
  });
});

describe("suspenseMovementsPost", () => {
  it("should make a POST request with correct URL and payload", async () => {
    const mockResponse = { data: "test data" };
    (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

    const payload = { field1: "value1", field2: "value2" };
    const result = await suspenseMovementsPost(payload);

    expect(httpAdapter.post).toHaveBeenCalledWith(
      "http://test-api.com/service/fdogen/cuentas/rezagoMovimiento/api/consultaRezagoMovimiento",
      payload
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Network error");
    (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, "error");
    const payload = { field1: "value1", field2: "value2" };

    await suspenseMovementsPost(payload);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    consoleSpy.mockRestore();
  });
});
});