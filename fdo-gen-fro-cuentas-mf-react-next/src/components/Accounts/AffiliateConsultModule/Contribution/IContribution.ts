import { UseFormReturnType } from "@mantine/form";

export interface ContributionFilterFormValues {
  periodoPago: any | null;
  periodoPagoFin: any | null;
  idDisponible: string | null;
  tipoMovimiento: string | null;
}

export interface IPageInfo {
  totalElement: number;
  totalPage: number;
  actualPage: number;
}

export interface IAporte {
  type: 'IAporte';
  cuentaId: number;
  cuentaAporteId: number;
  periodoPago: number;
  fechaPago: string;
  fechaCreacion: string;
  aporte: number;
  vafic: number;
  vempc: number;
  salarioBaseCal: number;
  salarioBase: number;
  tipoIdAportante: string;
  numeroIdAportante: number;
  razonSocial: string;
  descripcionOperacion: string;
  idDisponible: string;
  encabezadoPlanillaId: number;
  depositoId: string;
  secuencia: number;
  tipoRecaudo: string;
  contingente: number;
  tipoCotizanteId: string;
  diasInformado: number;
  diasCalculado: number;
  usuarioCreacion: string;
  fechaPagoOtroFondo: string;
  codigoAfp: string;
  uniqueId?: string;
}

export interface IContributionResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    page: IPageInfo;
    aporte: IAporte[];
  };
}

export interface IAporteDetalle {
  type: 'IAporteDetalle';
  aporteDetalleId: string;
  cuentaId: string;
  aporteId: string;
  fondoId: string;
  inversionId: string;
  concepto: string;
  pesos: string;
  unidades: string;
  unidadesRecaudador: string;
  tercero: string;
  porcentaje: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
  afectaSaldoCuenta: "strings";
}

export interface IContributionDetailResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    aporte: IAporteDetalle[];
  };
}

export interface IContributionTotalDetailsResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    aporte: IAporteDetalle[];
  };
}

export interface IContributionPayload {
  cuentaId: number;
  periodoPago: number | null;
  cuentaAporteId: number | null;
  idDisponible: string | null;
  periodoPagoFin: number | null;
  tipoMovimiento: string | null;
  page: {
    page: number;
    size: number;
  };
}

export interface IContributionDetailPayload {
  aporteId: number;
  numeroCuenta: number;
}

export interface IContributionViewProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  handleFilterSubmit: () => void;
  handleFilterReset: () => void;
  cuentaId: number | null;
  page: number;
  pageSize: number;
  isLoading: boolean;
  totalPages: number;
  errorMessage: string
  totalRecords: number;
  contributionData: IAporte[];
  filterFormContribution: any;
  selectedRecord: IAporte | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<IAporte | null>>;
  handleConsultDetail: () => void;
  showDetail: boolean;
  detailData: IContributionDetailResponse["data"] | null;
  totalDetailsData: IContributionTotalDetailsResponse["data"] | null;
  handleBackToContributions: () => void;
  movementsData: any;
  detailError: string;
  movementsError: string;
  isLoadingDetail: boolean;
  handleDownloadContributions: () => void;
  handleDownloadTotalContributions: () => void;
}

export interface IDetailData {
  aporte: IAporteDetalle[];
}

export interface IContributionFilterFormProps {
  cuentaId: number | null;
  handleFilterReset: (e: any) => void;
  handleFilterSubmit: () => void;
  filterFormContribution: UseFormReturnType<ContributionFilterFormValues>;
  totalDetailsData: IContributionTotalDetailsResponse["data"] | null;
  contributionData: IAporte[];   
  handleDownloadContributions: () => void;
  handleDownloadTotalContributions: () => void;
}
