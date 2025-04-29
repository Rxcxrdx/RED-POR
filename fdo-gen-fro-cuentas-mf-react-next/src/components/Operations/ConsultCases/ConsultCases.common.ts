import { DE_CTA_A_DEPO_CCAI, DE_CTA_A_REZAGO_CCAI } from "@/common/constants";
import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

export const OperationTypes = [
  { text: "Transferencia cuenta a rezago", value: DE_CTA_A_REZAGO_CCAI },
  { text: "Transferencia cuenta deposito", value: DE_CTA_A_DEPO_CCAI },
];

export const OperationStates = [
  { text: "Creado", value: "C" },
  { text: "Aplicado", value: "A" },
  { text: "Pendiente", value: "P" },
  { text: "Rechazado", value: "R" },
];

export const RequirementTypes = [{ text: "Auto tarea", value: "" }];

export const seeCasesTableColumns: Column<any>[] = [
  // TODO: validate this data when integration with backend
  { $header: "Caso No.", $key: "casoId", $isSticky: true, $width: "112px" },
  {
    $header: "Fecha de creación",
    $key: "fechaInicial",
    $isSticky: true,
    $width: "163px",
    $stickyOffset: "112px",
  },
  {
    $header: "Fecha de terminación",
    $key: "fechaTerminacion",
    $isSticky: true,
    $width: "184px",
    $stickyOffset: "275px",
  },
  {
    $header: "Estado",
    $key: "estado",
    $isSticky: true,
    $stickyOffset: "459px",
    $borderRight: true,
  },
  { $header: "Usuario caso", $key: "usuarioCaso" },
  { $header: "Tipo de requerimiento", $key: "tipoRequerimiento" },
  { $header: "Casual", $key: "casual" },
  { $header: "Número de Tarea CRM", $key: "taskNumero" },
  { $header: "Radicado CRM", $key: "crmRadicado" },
  { $header: "Código asunto CRM", $key: "crmCodigoAsunto" },
  { $header: "Descripción asunto CRM", $key: "crmDescripAsunto" },
  { $header: "Item key WF", $key: "itemKeyWf" },
  { $header: "Documento caso WF", $key: "documentoCasoWF" },
  { $header: "Periodo caso WF", $key: "periodoPagoWf" },
  { $header: "Auto tarea documento soporte", $key: "autoTareaSoporte" },
  { $header: "Auto tarea observación", $key: "autoTareaObservacion" },
  { $header: "Código operación", $key: "codigoOperacion" },
  { $header: "Otros valores", $key: "otrosValores" },
  { $header: "Cuenta", $key: "numeroCtaDocumento" },
  { $header: "Observación", $key: "observacion" },
  { $header: "Folio rezago", $key: "foliorezago" },
  { $header: "Movimiento ID", $key: "movimientoId" },
];

/**
 *  Affiliate balance columns for the table in CaseApproval component
 */
export const affiliateBalanceColumns = [
  { $header: "Inversión", $key: "movimientoID" },
  { $header: "Unidades Obl.", $key: "unidadesObl" },
  { $header: "Pesos Obl.", $key: "pesosObl" },
  { $header: "Unidades Vol. Afi.", $key: "unidadesVolAfi" },
  { $header: "Pesos Vol. Afi.", $key: "pesosVolAfi" },
  { $header: "Unidades Vol. Emp.", $key: "unidadesVolEmp" },
  { $header: "Pesos Vol. Emp.", $key: "pesosVolEmp" },
];

/**
 *  Summary of contributions columns for the table in CaseApproval component
 */
export const contributionsSummaryColumns = [
  { $header: "Inversión", $key: "movimientoID" },
  { $header: "Afecta Saldo", $key: "afectaSaldo" },
  { $header: "Disponible", $key: "disponible" },
  { $header: "Unidades", $key: "unidades" },
  { $header: "Pesos", $key: "pesos" },
  { $header: "Pesos valorizados", $key: "pesosValorizados" },
  { $header: "Cantidad", $key: "cantidad" },
  { $header: "Tipo", $key: "tipo" },
];

/**
 * Transfer information used in CaseApproval Component
 */
export const transferInformationLayout = [
  { $header: "Entidad de Giro", $key: "entidadGiro" },
  { $header: "Tipo de Rezago", $key: "tipoRezago" },
  { $header: "Pago Administradora", $key: "pagoAdministradora" },
  { $header: "Pago Aseguradora", $key: "pagoAseguradora" },
];

/**
 * Data of the case used in CaseApproval Component
 */
export const caseDataLayout = [
  { $header: "Numero de caso", $key: "numeroCaso" },
  { $header: "Tipo de Requerimiento", $key: "tipoRequerimiento" },
  { $header: "Causal", $key: "causal" },
  { $header: "Relaciono con", $key: "relacionoCon" },
  { $header: "Documento soporte", $key: "documentoSoporte" },
  { $header: "Observación", $key: "observacion" },
];
