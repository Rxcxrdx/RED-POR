import AxiosAdapter from "./AxiosAdapter";
import IHttpAdapter from "./IserviceAdapter";
//// import FetchAdapter from "./FetchAdapter";

const httpAdapter: IHttpAdapter = new AxiosAdapter();

export { httpAdapter };
