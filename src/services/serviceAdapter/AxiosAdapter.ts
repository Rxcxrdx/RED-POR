import axios, { AxiosInstance } from "axios";
import IHttpAdapter from "./IserviceAdapter";

class AxiosAdapter implements IHttpAdapter {
  public axiosInstance: AxiosInstance;


  constructor() {
    this.axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-RqUID": "1",
        "X-Channel": "AHL",
        "X-CompanyId": "0098",
        "X-IPAddr": "10.10.10.10",
        "X-IdentSerialNum": "63321428",
        "X-GovIssueIdentType": "CC",
      },
    });
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {
      ...config,
      headers: {
        ...this.axiosInstance.defaults.headers,
        ...config?.headers,
      },
    });
    return response.data;
  }

  async post<T>(url: string, data: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
}

export default AxiosAdapter;
