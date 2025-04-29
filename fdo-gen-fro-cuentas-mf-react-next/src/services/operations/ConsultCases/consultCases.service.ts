import { httpAdapter } from "@/services/serviceAdapter";
import { mockGetCaseApprovalInformationResponse } from "@/mocks";
import { IResponseData } from "@/services/services";

interface ICasesPayload {
  casoId: string | null;
  cuentaId: string | null;
  codigoOperacionId: string | null;
  estado: string | null;
  fechaInicial: string | null;
  fechaFinal: string | null;
  usuario: string | null;
  page: { page: number; size: number };
}

/**
 * Get all cases
 * @param casesPayload
 * @returns
 */
export const postCasesService = async (
  casesPayload: ICasesPayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/casos/api/consultaCasos`,
      casesPayload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// TODO: check implementation of this service when definition is given
export const getCaseApprovalInformationService = async (): Promise<
  IResponseData<any> | undefined
> => {
  try {
    //   return await httpAdapter.post(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/validacion/api/operacionValidacion`,
    //     payload
    //   );
    return mockGetCaseApprovalInformationResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// TODO: check implementation of this service when definition is given
export const postCaseApprovalService = async (): Promise<
  IResponseData<any> | undefined
> => {
  try {
    //   return await httpAdapter.post(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/validacion/api/operacionValidacion`,
    //     payload
    //   );
    return mockGetCaseApprovalInformationResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
