import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

import {
  IMovementsPage,
  IMovimiento,
} from "@/components/Accounts/AffiliateConsultModule/Movements/IMovements";

export const movementsPost = async (
  payload: any
): Promise<
  IResponseData<{ page: IMovementsPage; movimiento: IMovimiento[] }> | undefined
> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/movimiento/api/darMovimientos`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const conceptsGet = async (): Promise<
  IResponseData<any> | undefined
> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/concepto/api/consultaPorAfectaSaldoCuenta?afectaSaldoCuenta=NO`
    );
  } catch (error) {
    console.error(error);
  }
};
