import { httpAdapter } from "../../serviceAdapter";
import { createCasePost } from "../createCase";

jest.mock("../../serviceAdapter", () => ({
  httpAdapter: {
    post: jest.fn(),
  },
}));

describe("Case Services", () => {
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

  describe("createCasePost", () => {
    it("should make a POST request with correct URL and payload", async () => {
      const mockResponse = { data: "test data" };
      (httpAdapter.post as jest.Mock).mockResolvedValue(mockResponse);

      const payload = { field1: "value1", field2: "value2" };
      const result = await createCasePost(payload);

      expect(httpAdapter.post).toHaveBeenCalledWith(
        "http://test-api.com/service/fdogen/cuentas/caso/api/crearCaso",
        payload
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (httpAdapter.post as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error");
      const payload = { field1: "value1", field2: "value2" };

      await createCasePost(payload);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });
});
