export interface IBalanceResponse {
  respuesta: {
    codigoRespuesta: string;
    decripcionRespuesta: string;
    glosas: string;
  };
  consultarSaldosResponse: {
    tipoId: string;
    numeroId: number;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    saldoPesosCuentaIndividual: string;
    saldoPesosAportesVoluntariosObligatorias: string;
    subSaldoAfpAportesMenorIgual23: number;
    subSaldoAfpAportesSuperior23: number;
  };
}


export interface IAffiliateRaw {
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  afiliadoFondoId: string;
  sexo: string;
  fechaNacimiento: string | null;
  problemasRegistraduria: string;
  sarlaft?: string | null;
  transicion?: string | null;
  codigoCiudad?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  direccionEmail?: string | null;
  celular?: string | null;
  ocupacionCargoActual?: string | null;
  edad: number | null;
  barrio: any;
  folio: any;
  ultimaFechaPago: any;
  ultimoPeriodoPago: any;
  fechaSolicitud: any;
  fechaIngresoPorvenir: any; 
}

export interface IAffiliateResponse {
  status: { statusCode: number; statusDescription: string };
  data: {
    afiliado: IAffiliateRaw[];
  };
}

export interface ICuentaRaw {
  afiliadoFondoId: number;
  cuentaId: any;
  estadoAfiliadoFondoId: string;
  subestadoAfiliadoFondoId: string | null;
  tipoAfiliado: string;
  tipoVinculacion: string;
  ultimoIbcPago: number | null;
  ultimaFechaPago: string | null;
  ultimoPeriodoPago: string | null;
  ultimoNitPago: string | null;
  razonSocial: any;
  barrio: any;
  folio: any;
  fechaSolicitud: any;
  fechaIngresoPorvenir: any; 
}
export interface IPensionAccount {
  fechaCreacion: string;
  numeroCuenta: number;
  estadoCuenta: string;
  subEstadoCuenta: string;
}

export interface IPensionAccountResponse {
  status: { statusCode: number; statusDescription: string };
  data: {
    cuentasPensionesObligatorias: IPensionAccount[];
  };
}

export interface IFilterFormValues {
  numeroCuenta: string;
  numeroIdentificacion: string;
  tipoIdentificacion: string | null;
}

export interface IFormattedAffiliate {
  nombreCompleto: string;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  afiliadoFondoId: string;
  infoTabla: Record<string, string>;
}

export interface IFormattedAccount {
  Estado: string;
  "Tipo Afiliado": string;
  "Tipo Vinculación": string;
  "Valor Último Pago": string;
  "Fecha Último Pago": string;
  "Periodo Último Pago": string;
  "NIT Último Pago": string;
  "Cuenta ID": number;
  Subestado: string;
  Folio: any;
}

export interface IFormattedPensionAccount {
  fechaCreacion: string;
  numeroCuenta: number;
  estado: string;
  subestado: string;
}

export type UserDetailType = {
  nombreCompleto: string;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  afiliadoFondoId: string;
  infoTabla: Record<string, string>;
  estadoAfiliado: string;
  subestadoAfiliado: string;
  numeroCuenta: string | number;
  barrio: any;
  razonSocial: any;
  ultimoIbcPago: any;
  folio: any;
  vinculacion: any;
  ultimaFechaPago: any;
  ultimoPeriodoPago: any;
  tipoAfiliado: any;
  tipoVinculacion: any;
  fechaSolicitud: any;
  fechaIngresoPorvenir: any;
  fechaNacimiento: any;
} | null;

export interface SelectedAffiliate {
  tipoId: string;
  identificacion: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  afiliadoFondoId: string;
}
