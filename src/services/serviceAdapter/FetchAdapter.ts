import IHttpAdapter from "./IserviceAdapter";

class FetchAdapter implements IHttpAdapter {
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await fetch(url, {
      ...config,
      method: "GET",
    });
    return response.json();
  }

  async post<T>(url: string, data: any, config?: any): Promise<T> {
    const response = await fetch(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error fetching data");

    return response.json();
  }
}

export { FetchAdapter };
