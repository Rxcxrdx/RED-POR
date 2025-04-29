import axios from "axios";
import AxiosAdapter from "../AxiosAdapter";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AxiosAdapter", () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      defaults: {
        headers: {
          common: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      },
      get: jest.fn(),
      post: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should make a GET request and return data", async () => {
      const mockData = { data: "test data" };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });

      const axiosInstance = {
        defaults: {
          headers: {
            common: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        },
        get: mockGet,
        post: jest.fn(),
      } as any;

      mockedAxios.create.mockReturnValue(axiosInstance);

      const axiosAdapter = new AxiosAdapter();
      const result = await axiosAdapter.get("https://api.example.com/data");

      expect(mockGet).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.any(Object)
      );
      expect(result).toEqual(mockData);
    });

    it("should pass config to the GET request", async () => {
      const mockData = { data: "test data" };
      const config = {
        headers: {
          Authorization: "Bearer token",
        },
      };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });

      const axiosInstance = {
        defaults: {
          headers: {
            common: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        },
        get: mockGet,
        post: jest.fn(),
      } as any;

      mockedAxios.create.mockReturnValue(axiosInstance);

      const axiosAdapter = new AxiosAdapter();
      const result = await axiosAdapter.get(
        "https://api.example.com/data",
        config
      );

      expect(mockGet).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("post", () => {
    it("should pass config to the POST request", async () => {
      const mockData = { data: "test data" };
      const postData = { key: "value" };
      const config = {
        headers: {
          Authorization: "Bearer token",
        },
      };
      const mockPost = jest.fn().mockResolvedValue({ data: mockData });

      const axiosInstance = {
        defaults: {
          headers: {
            common: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        },
        get: jest.fn(),
        post: mockPost,
      } as any;

      mockedAxios.create.mockReturnValue(axiosInstance);

      const axiosAdapter = new AxiosAdapter();
      const result = await axiosAdapter.post(
        "https://api.example.com/data",
        postData,
        config
      );

      expect(mockPost).toHaveBeenCalledWith(
        "https://api.example.com/data",
        postData,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("error handling", () => {
    it("should handle GET request errors", async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error("Network error"));

      const axiosInstance = {
        defaults: {
          headers: {
            common: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        },
        get: mockGet,
        post: jest.fn(),
      } as any;

      mockedAxios.create.mockReturnValue(axiosInstance);

      const axiosAdapter = new AxiosAdapter();

      await expect(
        axiosAdapter.get("https://api.example.com/data")
      ).rejects.toThrow("Network error");
    });

    it("should handle POST request errors", async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error("Network error"));
      const postData = { key: "value" };

      const axiosInstance = {
        defaults: {
          headers: {
            common: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        },
        get: jest.fn(),
        post: mockPost,
      } as any;

      mockedAxios.create.mockReturnValue(axiosInstance);

      const axiosAdapter = new AxiosAdapter();

      await expect(
        axiosAdapter.post("https://api.example.com/data", postData)
      ).rejects.toThrow("Network error");
    });
  });
});
