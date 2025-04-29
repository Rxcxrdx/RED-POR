import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const getBalanceByAccountNumber = async (
  accountNumber: number
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/saldoPortafolio/api/consultaSaldos?numeroCuenta=${accountNumber}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getDispersionService = async (
  accountNumber: number
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/dispersion/api/consultaDispersion?numeroCuenta=${accountNumber}`
    );
  } catch (error) {
    console.error(error);
  }
};
