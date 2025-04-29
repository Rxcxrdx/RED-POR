import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const validateOperationPost = async (
  payload: any
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/validarOperacion/api/validate`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};
