import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

interface IApplyOperationPayload {
  codigoOperacionId: string;
  numeroCuenta: number;
  administradora: string;
  aseguradora: string;
  usuarioCreacion: string;
  casoId: number;
  listaAportes: {
    cuentaAporteId: number;
    listaDetalles?: { cuentaAporteDetalleId: string }[];
  }[];
}

interface IRejectOperationPayload {
  casoId: number;
  estado: string;
  usuarioUltimaModificacion: string;
}

export const postApplyOperationService = async (
  payload: IApplyOperationPayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/operacion/api/aplicarOperacion`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const postRejectOperationService = async (
  payload: IRejectOperationPayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/caso/api/actualizarEstadoCaso`,
      payload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
