import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const affiliateGet = async (
  payload: any
): Promise<IResponseData<any> | undefined> => {
  const { numeroIdentificacion, tipoIdentificacion } = payload;
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/afiliado/api/consultaIdentificacion?tipoIdentificacion=${tipoIdentificacion}&numeroIdentificacion=${numeroIdentificacion}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const affiliateByFondoIdGet = async (
  afiliadoFondoId: any
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/afiliado/api/consultaIdentificacionFondo?afiliadoFondoId=${afiliadoFondoId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const affiliateByNamePost = async (
  payload: any
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/afiliado/api/consultaNombres`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};
