export interface IResponseData<T> {
  success?: boolean;
  status?: { statusCode: number; statusDescription: string };
  data: T;
}
