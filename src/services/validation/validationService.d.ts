export interface IValidationOperationPayload {
  codigoOperacionId: any;
  estado: any;
  page: {
    page: number;
    size: number;
  };
}

export interface ISearchValidationPayload {
  validacionId: any;
  page: {
    page: number;
    size: number;
  };
}

export interface IUpdateValidationPayload {
  validacionId: string;
  nombre: string;
  descripcion: string;
  usuarioUltimaModificacion: string;
}

export interface IUpdateValidationStatePayload {
  validacionId: string;
  codigoOperacionId: string;
  estado: string;
  usuarioUltimaModificacion: string;
}

/**
 * @description response for getOperationsTypeService.
 */
export interface IOperationType {
  codigoOperacionId: string;
  descripcionLarga: string;
  estado: string;
}

export interface IPostAssociateValidationOperationPayload {
  validacionId: string;
  codigoOperacionId: string;
  usuarioCreacion: string;
}
