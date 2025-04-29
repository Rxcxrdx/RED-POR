import { httpAdapter } from "@/services/serviceAdapter";
import { IResponseData } from "@/services/services";

interface IPostContributionDetailPayload {
  cuentaId: number;
  cuentaAporteId: string | null;
  page: { page: number; size: number };
}

/**
 * get all the details of a contribution or various contributions.
 * @param payload
 * @returns
 */
export const postContributionDetailService = async (
  payload: IPostContributionDetailPayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/aporteDetalle/api/DetallesAportes`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const getBanksService = async (): Promise<
  IResponseData<any> | undefined
> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fgngen/cuentas/bancos/api/v1/bancos`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getAccountsInformationService = async (
  bankId: number
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fgngen/cuentas/cuentaBanco/api/v1/informacionCuenta?bancoId=${bankId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getOfficesInformationService = async (
  bankId: number
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fgngen/cuentas/oficinaBanco/api/v1/informacionOficinas?bancoId=${bankId}`
    );
  } catch (error) {
    console.error(error);
  }
};
