interface IHttpAdapter {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data: any, config?: any): Promise<T>;
}

export default IHttpAdapter;
