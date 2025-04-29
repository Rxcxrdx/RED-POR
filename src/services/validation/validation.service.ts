import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

import {
  IOperationType,
  IPostAssociateValidationOperationPayload,
  ISearchValidationPayload,
  IUpdateValidationPayload,
  IUpdateValidationStatePayload,
  IValidationOperationPayload,
} from "./validationService";

export const postValidationOperationService = async (
  payload: IValidationOperationPayload
): Promise<IResponseData<any>> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/validacion/api/operacionValidacion`,
      payload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSearchValidationsService = async (
  payload: ISearchValidationPayload
): Promise<IResponseData<any>> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/validacion/api/consultaValidaciones`,
      payload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createValidationService = async (
  payload: any
): Promise<IResponseData<any>> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/crearValidacion/api/crearValidacion`,
      payload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateValidationService = async (
  payload: IUpdateValidationPayload
): Promise<IResponseData<any>> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/crearValidacion/api/actualizarValidacion`,
      payload
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateValidationStateService = async (
  payload: IUpdateValidationStatePayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/crearValidacion/api/actualizarOperacionValidacion`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};

export const getOperationsTypeService = async (): Promise<
  IResponseData<IOperationType[]> | undefined
> => {
  try {
    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/consultaOperacion/api/operacion`
    );
  } catch (error) {
    console.error(error);
  }
};

export const postAssociateValidationOperationService = async (
  payload: IPostAssociateValidationOperationPayload
): Promise<IResponseData<any> | undefined> => {
  try {
    return await httpAdapter.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fdogen/cuentas/crearValidacion/api/crearOperacionValidacion`,
      payload
    );
  } catch (error) {
    console.error(error);
  }
};
