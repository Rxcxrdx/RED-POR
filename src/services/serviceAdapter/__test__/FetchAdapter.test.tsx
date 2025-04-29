import { FetchAdapter } from "../FetchAdapter";

global.fetch = jest.fn();

describe("FetchAdapter", () => {
  let fetchAdapter: FetchAdapter;

  beforeEach(() => {
    fetchAdapter = new FetchAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should make a GET request and return data", async () => {
      const mockData = { data: "test data" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await fetchAdapter.get("https://api.example.com/data");

      expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
        method: "GET",
      });
      expect(result).toEqual(mockData);
    });

    it("should pass config to the GET request", async () => {
      const mockData = { data: "test data" };
      const config = { headers: { Authorization: "Bearer token" } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await fetchAdapter.get(
        "https://api.example.com/data",
        config
      );

      expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
        ...config,
        method: "GET",
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("post", () => {
    it("should make a POST request and return data", async () => {
      const mockData = { data: "test data" };
      const postData = { key: "value" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await fetchAdapter.post(
        "https://api.example.com/data",
        postData
      );

      expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
        method: "POST",
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(mockData);
    });

    it("should pass config to the POST request", async () => {
      const mockData = { data: "test data" };
      const postData = { key: "value" };
      const config = { headers: { Authorization: "Bearer token" } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await fetchAdapter.post(
        "https://api.example.com/data",
        postData,
        config
      );

      expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
        ...config,
        method: "POST",
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(mockData);
    });

    it("should throw an error if the response is not ok", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn(),
      });

      await expect(
        fetchAdapter.post("https://api.example.com/data", {})
      ).rejects.toThrow("Error fetching data");
    });
  });
});
