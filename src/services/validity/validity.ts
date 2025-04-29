import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const getValidityService = async (
  accountNumber: number
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/vigencia/api/consultaVigencia?numeroCuenta=${accountNumber}`
    );
  } catch (error) {
    console.error(error);
  }
};
