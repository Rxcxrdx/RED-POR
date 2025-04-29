import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export interface ICreateCasePayload {
  caso: {
    numeroCtaDocumento: number;
    codigoOperacionId: string;
    usuarioCreacion: string;
    tipoRequerimientoId: string;
    causalCasoId: string;
    autotareaTipoRelacion: string;
    autotareaValorRelacion: string;
    autotareaInformacionRelacion: string;
  };
}

export const createCasePost = async (
  payload: ICreateCasePayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/caso/api/crearCaso`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};
