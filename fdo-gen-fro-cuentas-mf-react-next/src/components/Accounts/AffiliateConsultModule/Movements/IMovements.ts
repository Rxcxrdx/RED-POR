import { UseFormReturnType } from "@mantine/form";

export interface MovementsFilterFormValues {
  periodoPago: string;
  conceptoId: string | null;
  periodoPagoFin: string;
  tipoMovimiento: any;
}

export interface IMovementsPage {
  totalElement: number;
  totalPage: number;
  actualPage: number;
}

export interface IMovimiento {
  periodoPago: number;
  fechaPago: string;
  fechaCreacion: string;
  debitoPesos: number;
  debitoUnidades: number;
  creditoPesos: number;
  creditoUnidades: number;
  fondoID: number;
  afectaSaldo: string;
  salarioBaseCal: number;
  salarioBase: number;
  nitPago: string;
  razonSocial: string;
  descripcionOperacion: string;
  descripcionConcepto: string;
  idDisponible: string;
  cuentaMovimientoId: number;
  idMovimientoOrigen: string;
  idMovimientoDestino: string;
  cuentaAporteId: number;
  fechaOperacion: string;
  encabezadoPlanillaId: number;
  depositoId: string;
  usuarioCreacion: string;
  secuencia: number;
  tipoCotizanteId: string;
  diasInformado: number;
  diasCalculado: number;
  retencionContingente: number;
  codigoAFP: string;
  fechaPagoOtroFondo: string;
  casoId: string;
  numeroAsientoId: number;
  uniqueId?: string;
}

export interface IMovementsResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    page: IMovementsPage;
    movimiento: IMovimiento[];
  };
}

export interface IMovementsPayload {
  cuentaId: number;
  periodoPago: string | null;
  periodoPagoFin: string | null;
  conceptoId: string | null;
  inversionId: null;
  codigoOperacionId: null;
  cuentaAporteId: null;
  tipoMovimiento: string | null;
  page: {
    page: number;
    size: number;
  };
}

export interface IMovementsViewProps {
  filterFormMovements: UseFormReturnType<MovementsFilterFormValues>;
  handleFilterSubmit: () => void;
  handleFilterReset: () => void;
  movimientosData: IMovimiento[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  isLoading: boolean;
  errorMessage: string;
  totalRecords: number;
  conceptOptions: any;
  handleDownloadMovements: () => void;
}

export interface MovementsTableProps {
  records: IMovimiento[];
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalRecords: number;
}

export interface IMovementsFilterFormProps {
  handleFilterReset: () => void;
  handleFilterSubmit: (values: MovementsFilterFormValues) => void;
  filterFormMovements: UseFormReturnType<MovementsFilterFormValues>;
  conceptOptions: any;
  handleDownloadMovements: () => void;
}
