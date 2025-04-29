export interface IPageInfo {
  totalElement: number;
  totalPage: number;
  actualPage: number;
}

export interface ISuspenseUpdate {
  rezagoId: number;
  tipoNovedadId: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface ISuspenseUpdateResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    page: IPageInfo;
    listaRezagoNovedadResponseDto: ISuspenseUpdate[];
  };
}


export interface ISuspenseUpdatePayload {
  rezagoId: number | null;
  page: {
    page: number;
    size: number;
  };
}

export interface ISuspenseUpdateViewProps {
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
  SuspenseData: ISuspenseUpdate[];
  filterFormSuspense: any;
  selectedRecord: ISuspenseUpdate | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<ISuspenseUpdate | null>>;
  handleConsultDetail: () => void;
  getFileName: (nombre: string) => string;
  showDetail: boolean;
  detailData: ISuspenseUpdateResponse["data"] | null;
  handleBackToSuspenses: () => void;
  movementsData: any;
  detailError: string;
  movementsError: string;
  isLoadingDetail: boolean;
  handleDownloadSuspenses: () => void;
  handleDownloadTotalSuspenses: () => void;
}