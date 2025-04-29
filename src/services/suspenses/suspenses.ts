import { httpAdapter } from "../serviceAdapter";

export const suspensePost = async (payload: any) => {
  
  try {
    const response = await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/consultaRezago/api/rezagos`,
      payload
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const suspenseUpdatePost = async (payload: any) => {
  
  try {
    const response = await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/rezagoNovedad/api/consultaRezagoNovedad`,
      payload
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const suspenseMovementsPost = async (payload: any) => {
  
  try {
    const response = await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/rezagoMovimiento/api/consultaRezagoMovimiento`,
      payload
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};