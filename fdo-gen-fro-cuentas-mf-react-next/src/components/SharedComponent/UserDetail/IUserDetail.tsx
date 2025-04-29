export interface InfoTabla {
  Sarlaft?: string;
  "Fecha de Nacimiento"?: string;
  Género?: string;
  Registraduría?: string;
  Transición?: string;
  Ciudad?: string;
  Dirección?: string;
  Email?: string;
  Ocupación?: string;
  Teléfono?: string;
  Celular?: string;
  edad?: any;
  folio?: any;
  vinculacion?: any;
}

export interface UserDetail {
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  nombreCompleto: string;
  afiliadoFondoId: string;
  infoTabla: InfoTabla;
  estadoAfiliado: string;
  subestadoAfiliado: string;
  numeroCuenta: any;
  barrio: any;
  razonSocial: any;
  ultimoIbcPago: any;
  folio: any;
  vinculacion: any;
}

export interface UserDetailViewProps {
  reports?: boolean;
  userDetail: UserDetail | null;
  opened: boolean;
  onToggle: () => void;
  hiddenFields?: string[];
}

export interface UserDetailContext {
  userDetail: UserDetail | null;
}

export interface UserDetailContainerProps<
  T extends { userDetail: UserDetail | null }
> {
  ContextProvider: React.Context<T>;
  reports?: boolean;
  hiddenFields?: string[];
}
