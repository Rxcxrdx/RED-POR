import { UseFormReturnType } from "@mantine/form";

export interface SuspenseConsultFilterFormValues {
  tipoIdentificacion: string | null;
  numeroIdentificacion: number | null;
  tipoIdEmpleador: string | null;
  numeroIdEmpleador: number | null;
  primerApellido: string | null;
  segundoApellido: string | null;
  primerNombre: string | null;
  segundoNombre: string | null;
  periodoPago: number | null;
  fechaPagoInicial: any | null;
  fechaPagoFinal: any | null;
  estadoRezago: string | null;
  folioRezago: number | null;
  numeroPlanilla: number | null;
}

export interface IPageInfo {
  totalElement: number;
  totalPage: number;
  actualPage: number;
}

export interface ISuspense {
  rezagoId: number;
  tipoIdNitPago: string;
  nitPago: number;
  depositoId: number;
  encabezadoPlanillaId: number;
  bancoPago: string;
  oficinaPago: string;
  fechaPago: string;
  cajaPago: string;
  folioPago:number;
  secuencia:string;
  periodoPago:number;
  diasCotizados: number;
  fechaPagoOtroFondo: string;
  tipoIdDetalle: string;
  numeroIdDetalle: number;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  codigoSoundex: string;
  cuentaId: number;
  salarioReal: number;
  saldoPesos: number;
  saldoUnidades: number;
  tipoRezagoId: string;
  causalRezagoId: string;
  estadoLevante: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioUltimaModificacion: string;
  fechaUltimaModificacion: string;
  afpOrigenId: number;
  indicadorCambio: string;
  tipoCotizanteId: string;
  indicadorCongelamiento: string;
  causalCongelaRezagoId: string;
  afpOrigenRezago: string;
  fondoId: number;
  tipoRecaudo: string;
  subtipoRecaudo: string;
  razonSocial: string;
}

export interface ISuspenseConsultResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    page: IPageInfo;
    rezagos: ISuspense[];
  };
}

export interface ISuspensePayload {
  tipoIdDetalle: string | null;
  numeroIdDetalle: number | null;
  tipoIdNitPago: string | null;
  nitPago: number | null;
  primerApellido: string | null;
  segundoApellido: string | null;
  primerNombre: string | null;
  segundoNombre: string | null;
  periodoPago: number | null;
  fechaPagoInicial: any | null;
  fechaPagoFinal: any | null;
  estadoRezago: string | null;
  rezagoId: number | null;
  numeroPlanilla: number | null;
  page: {
    page: number;
    size: number;
  };
}

export interface ISuspenseConsultViewProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  handleFilterSubmit: () => void;
  handleFilterReset: () => void;
  cuentaId: number | null;
  page: number;
  pageSize: number;
  isLoading: boolean;
  totalPages: number;
  errorMessage: string;
  totalRecords: number;
  SuspenseData: ISuspense[];
  filterFormSuspense: any;
  selectedRecord: ISuspense | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<ISuspense | null>>;
  handleConsultDetail: () => void;
  getFileName: (nombre: string) => string;
  showDetail: boolean;
  handleBackToSuspenses: () => void;
  movementsData: any;
  detailError: string;
  movementsError: string;
  isLoadingDetail: boolean;
  handleDownloadSuspenses: () => void;
  handleDownloadTotalSuspenses: () => void;
}

export interface ISuspenseConsultFilterFormProps {
  cuentaId: number | null;
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  getFileName: (nombre: string) => string;
  filterFormSuspense: UseFormReturnType<SuspenseConsultFilterFormValues>;
  SuspenseData: ISuspense[];   
  handleDownloadSuspenses: () => void;
  handleDownloadTotalSuspenses: () => void;
}
