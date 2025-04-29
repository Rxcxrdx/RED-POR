import { UserDetailType } from "@/hooks/useAffiliateData/IuseAffiliateData";
import { ReactNode } from "react";

export interface SelectedContribution {
  cuentaAporteId: number;
  idDisponible: string;
  periodoPago: number;
  fechaProceso: string;
}

export interface IAffiliateDetail {
  numeroCuenta?: number;
  afiliado?: {
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    numeroIdentificacion: string;
    tipoIdentificacion: string;
    afiliadoFondoId: string;
    sexo: string;
    fechaNacimiento: string;
    fondoId: string;
    problemasRegistraduria: string;
    codigoSoundex: string;
    nacionalidad: string | null;
    indicadorCarnet: string;
    ocupacionCargoActual: string | null;
    indicadorCorrespondencia: string;
    indicadorEnvio: string;
    direccion: string;
    telefono: string;
    barrio: string | null;
    apartadoAereo: string | null;
    codigoCiudad: string;
    direccionEmail: string;
    celular: string;
    fechaSiniestro: string | null;
    estadoPension: string | null;
    tipoSiniestro: string | null;
    ultimaLiquidacion: string | null;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
    folio: any;
  };
}

export interface ITransferSuspenseContext {
  cuentaId: number | null;
  setCuentaId: React.Dispatch<React.SetStateAction<number | null>>;
  userDetail: UserDetailType;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetailType>>;
  affiliateDetail: IAffiliateDetail | null;
  setAffiliateDetail: React.Dispatch<
    React.SetStateAction<IAffiliateDetail | null>
  >;
  selectedContributions: SelectedContribution[] | null;
  setSelectedContributions: React.Dispatch<
    React.SetStateAction<SelectedContribution[] | null>
  >;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  balanceData: any[] | null;
  setBalanceData: React.Dispatch<React.SetStateAction<any[] | null>>;
  pensionAccounts: any[] | null;
  setPensionAccounts: React.Dispatch<React.SetStateAction<any[] | null>>;
  accountData: any[] | null;
  setAccountData: React.Dispatch<React.SetStateAction<any[] | null>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  completedViews: string[];
  setCompletedViews: React.Dispatch<React.SetStateAction<string[]>>;
  handleFilterReset: (() => void) | null;
  registerFilterReset: (resetFunction: () => void) => void;
}

export interface ITransferSuspenseProviderProps {
  children: ReactNode;
}
