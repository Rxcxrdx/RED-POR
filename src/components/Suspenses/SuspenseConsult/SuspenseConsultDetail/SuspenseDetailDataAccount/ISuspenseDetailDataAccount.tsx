import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";

export interface IAffiliateRawSuspenceDetail {
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
}

export interface IFormattedAccount {
  Estado: string;
  tipoIdDetalle: string;
  numeroIdDetalle: number;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  "Tipo Afiliado": string;
  "Tipo Vinculación": string;
  "Valor Último Pago": string;
  "Fecha Último Pago": string;
  "Periodo Último Pago": string;
  "NIT Último Pago": string;
  "Cuenta ID": number;
  Subestado: string;
}

export interface ICuentaResponse {
  status: { statusCode: number; statusDescription: string };
  data: {
    account: ICuentaRaw[];
  };
}

export interface IAffiliateResponse {
  status: { statusCode: number; statusDescription: string };
  data: {
    afiliado: IAffiliateRawSuspenceDetail[];
  };
}

export interface SuspenseDetailDataAccountViewProps {
  columns: Column[];
  page: number;
  records: IFormattedAccount[];
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
}
