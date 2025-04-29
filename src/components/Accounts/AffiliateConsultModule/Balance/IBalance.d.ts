export interface IBalance {
  saldoPortafolioId: string;
  cuentaId: string;
  fondoId: string;
  inversionId: string;
  obligatorio: string;
  voluntarioAfiliado: string;
  voluntarioEmpleador: string;
  retencionContingente: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: null | string;
  dispersion?: Array<any>;
}

export interface IBalanceResponse {
  status: { statusCode: number; statusDescription: string };
  data: any;
}
