import {
  ICuentaRaw,
  IPensionAccount,
} from "@/hooks/useAffiliateData/IuseAffiliateData";
import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const accountByAffiliateIdGet = async (
  afiliadoFondoId: any
): Promise<IResponseData<{ account: ICuentaRaw[] }> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/cuenta/api/consultaPorAfiliadoId?afiliadoFondoId=${afiliadoFondoId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const accountByAccountIdGet = async (
  cuentaId: any
): Promise<IResponseData<{ account: ICuentaRaw[] }> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/cuenta/api/consultaPorCuentaId?cuentaId=${cuentaId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const accountByIdentificationNumber = async (
  numeroIdentificacion: any,
  tipoIdentificacion: any
): Promise<
  IResponseData<{ cuentasPensionesObligatorias: IPensionAccount[] }> | undefined
> => {
  try {
    const customHeaders = {
      "X-RqUID": "1458859966",
      "X-Channel": "ZTA",
      "X-IdentSerialNum": numeroIdentificacion,
      "X-GovIssueIdentType": tipoIdentificacion,
      "X-Sesskey": "sasas54s5a45s4s45s",
      "X-IPAddr": "0.0.0.0",
      "X-NextDt": "2023-06-21T15:25:59.125",
    };

    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/obligatorias/cuentas/v1/porvenir/consultaproducto/consulta/afiliado`,
      { headers: customHeaders }
    );
  } catch (error) {
    console.error("Error fetching account by identification number:", error);
    throw error;
  }
};

export const accountByIdentificationIDPost = async (
  payload: any
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/transversal/externos/api/orquestador/datosbasicos`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const weeksByIdentificationNumber = async (
  numeroIdentificacion: any,
  tipoIdentificacion: any
): Promise<IResponseData<any[]> | undefined> => {
  try {
    const customHeaders = {
      "X-RqUID": "1458859966",
      "X-Channel": "ZTA",
      "X-IdentSerialNum": numeroIdentificacion,
      "X-GovIssueIdentType": tipoIdentificacion,
      "X-Sesskey": "sasas54s5a45s4s45s",
      "X-IPAddr": "0.0.0.0",
      "X-NextDt": "2023-06-21T15:25:59.125",
    };

    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/obligatorias/historialaboral/consultarsemanas/v2/consulta/semanascotizadas`,
      { headers: customHeaders }
    );
  } catch (error) {
    console.error("Error fetching account by identification number:", error);
    throw error;
  }
};
