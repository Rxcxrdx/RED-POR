
export interface IPageInfo {
  totalElement: number;
  totalPage: number;
  actualPage: number;
}

export interface ISuspenseMovement {
  rezagoId: number;
  codigoOperacionId: string;
  fechaCreacion: string;
  salarioBase: number;
  valorPesos: number;
  numeroUnidades: number;
  valorPesosHistorico: number;
  numeroUnidadesHistorico: number;
  porcentaje: number;
  fechaOperacion: string;
  rezagoMovimientoId: number;
  idDisponible: string;
  fechaGiro: string;
  idBeneficiario: number;
  diasInformado: number;
  diasCalculado: number;
  casoId: number;
  numeroAsientoId: number;
}

export interface ISuspenseMovementsResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    page: IPageInfo;
    listaRezagoMovimientoResponseDto: ISuspenseMovement[];
  };
}


export interface ISuspenseMovementsPayload {
  rezagoId: number | null;
  page: {
    page: number;
    size: number;
  };
}

export interface ISuspenseMovementsViewProps {
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
  SuspenseData: ISuspenseMovement[];
  filterFormSuspense: any;
  selectedRecord: ISuspenseMovement | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<ISuspenseMovement | null>>;
  handleConsultDetail: () => void;
  getFileName: (nombre: string) => string;
  showDetail: boolean;
  detailData: ISuspenseMovementsResponse["data"] | null;
  handleBackToSuspenses: () => void;
  movementsData: any;
  detailError: string;
  movementsError: string;
  isLoadingDetail: boolean;
  handleDownloadSuspenses: () => void;
  handleDownloadTotalSuspenses: () => void;
}