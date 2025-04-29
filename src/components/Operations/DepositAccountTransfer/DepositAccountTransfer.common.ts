import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

export const affiliateInformationColumns = [
  { $header: "Inversiòn", $key: "movimientoID" },
  { $header: "Unidades Obl.", $key: "unidadesObl" },
  { $header: "Pesos Obl.", $key: "pesosObl" },
];

// TODO: this should comes from a backend service
export const fundOptions = [
  { text: "Alternativas de inversión", value: "alternativasDeInversion" },
  { text: "CES", value: "ces" },
  {
    text: "Fondo de ahorro Programado obligatorio",
    value: "fondoDeAhorroProgramadoObligatorio",
  },
  { text: "Fondo generacional", value: "fondoGeneracional" },
  { text: "Fonget", value: "fonget" },
  { text: "Patrimonios autónomos", value: "patrimoniosAutonomos" },
  { text: "Pensiones obligatorias", value: "pensionesObligatorias" },
  { text: "Sociedad administradora", value: "sociedadAdministradora" },
];

export const contributionDetailColumns: Column<any>[] = [
  // TODO: check this information with backend and business team, because currently some fields are undefined
  { $header: "Concepto", $key: "concepto", $isSticky: true, $width: "8rem" },
  {
    $header: "Fondo",
    $key: "fondoId",
    $isSticky: true,
    $stickyOffset: "8rem",
    $borderRight: true,
  },
  { $header: "Salario calculado", $key: "salarioBaseCal" },
  { $header: "Débito pesos", $key: "pesos" },
  { $header: "Débito unidades", $key: "unidades" },
  { $header: "Crédito pesos", $key: "creditoPesos" },
  { $header: "Crédito unidades", $key: "unidades" },
  { $header: "Id aporte", $key: "aporteId" },
  { $header: "Id detalle aporte", $key: "aporteDetalleId" },
  { $header: "Disponible", $key: "disponible" },
  { $header: "Periodo de pago", $key: "periodoPago" },
  { $header: "Fecha de proceso", $key: "fechaProceso" },
  { $header: "Porcentaje", $key: "porcentaje" },
  { $header: "Nit de pago", $key: "numeroIdAportante" },
  { $header: "Razón social", $key: "razonSocial" },
];
