export const DE_CTA_A_REZAGO_CCAI = "DE_CTA_A_REZAGO_CCAI";
export const DE_CTA_A_DEPO_CCAI = "DE_CTA_A_DEPO_CCAI";

export const PRIMARY_COLOR = "#3E6C33";

export const requirementTypeOptions = [{ value: "AUTO", text: "Auto Tarea" }];

export const causalTypeOptions = [
  { value: "EMPL", text: "Error Empleador" },
  { value: "EAFI", text: "Error Afiliado" },
  { value: "SOLI", text: "Solicitudes" },
  { value: "EDIG", text: "Error Digitación" },
];

export const relatedWithOptions = [{ value: "CASO", text: "Caso" }];

export const COMMON_LABELS = {
  NO_INFORMATION: "Sin información para mostrar",
  NO_ACCOUNT_SELECTED: "No se ha seleccionado una cuenta.",
};

export const fieldMappingContribution: { [key: string]: string } = {
  cuentaAporteId: "ID aporte",
  periodoPago: "Periodo",
  fechaPago: "Fecha pago",
  fechaCreacion: "Fecha acreditación",
  aporte: "Vlr. aporte",
  vafic: "Vol. afiliado",
  vempc: "Vol. empleador",
  salarioBaseCal: "IBC calculado",
  salarioBase: "IBC informado",
  tipoIdAportante: "Tipo id empleador",
  numeroIdAportante: "Id empleador",
  razonSocial: "Razón social",
  descripcionOperacion: "Operación",
  idDisponible: "Disponibilidad",
  encabezadoPlanillaId: "Número de planilla",
  depositoId: "Deposito",
  secuencia: "Secuencia",
  tipoRecaudo: "Tipo-sub Tipo recaudo",
  contingente: "Contingente",
  tipoCotizanteId: "Tipo de cotizante",
  diasInformado: "Días informados",
  diasCalculado: "Días calculados",
  usuarioCreacion: "Usuario de Creación",
  fechaPagoOtroFondo: "Fecha de pago otro fondo",
  codigoAfp: "AFP no vinculado entrada", 
};

export const fieldMappingContributionDetail: { [key: string]: string } = {
  aporteId: "ID aporte",
  periodoPago: "Periodo",
  fechaPago: "Fecha pago",
  fechaCreacion: "Fecha acreditación",
  salarioBaseCal: "IBC calculado",
  salarioBase: "IBC informado",
  tipoIdAportante: "Tipo id empleador",
  numeroIdAportante: "Id empleador",
  tipoCotizanteId: "Tipo de cotizante",
  diasInformado: "Días informados",
  diasCalculado: "Días calculados",
  fechaOtroFondo: "Fecha pago otro fondo",
  CodigoAfp: "AFP pago otro fondo",
  aporteDetalleId: "ID detalle",
  pesos: "Crédito pesos",
  unidades: "Crédito unidades",
  inversionId: "Inversión",
  afectaSaldoCuenta: "Afecta saldo",
  concepto: "Concepto",
  porcentaje: "Porcentaje",    
};

export const fieldMappingSuspenseMovements: { [key: string]: string } = {
  codigoOperacionId: "Concepto operación",
  fechaCreacion: "Fecha acreditación",
  salarioBase: "IBC calculado",
  valorPesos: "Debito pesos",
  numeroUnidades: "Debito unidades",
  valorPesosHistorico: "Crédito pesos",
  numeroUnidadesHistorico: "Crédito unidades",
  porcentaje: "Porcentaje",
  fechaOperacion: "Fecha operación",
  rezagoMovimientoId: "id movimiento",
  idDisponible: "Disponible",
  fechaGiro: "Fecha giro",
  idBeneficiario: "Id beneficiario",
  diasInformado: "Días informados",
  diasCalculado: "Días calculados",
  casoId: "Caso id",
  numeroAsientoId: "Asiento id",  
};

export const fieldMappingSuspenseSuspenses: { [key: string]: string } = {
  rezagoId: "Folio rezago",
  saldoPesos: "Valor rezago",
  estadoLevante: "Levante",
  indicadorCongelamiento: "Congelado",
  causalCongelaRezagoId: "Causal congelamiento",
  periodoPago: "Periodo",
  cuentaId: "Cuenta",
  tipoIdDetalle: "Tipo id afiliado",
  numeroIdDetalle: "Id. afiliado",
  primerApellido: "Primer apellido",
  segundoApellido: "Segundo apellido",
  primerNombre: "Primer nombre",
  segundoNombre: "Segundo nombre",
  tipoRezagoId: "Tipo rezago",
  causalRezagoId: "Causal rezago",
  tipoIdNitPago: "Tipo id empleador",
  nitPago: "Id. empleador",
  razonSocial: "Razón social",
  fechaPago: "Fecha pago",
  fetchaCreacion: "Fecha acreditación",
  encabezadoPlanillaId: "Número planilla",
};


