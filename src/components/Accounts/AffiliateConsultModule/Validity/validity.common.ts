import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

export const validityColumns: Column<any>[] = [
  {
    $header: "Fecha de solicitud Entrada",
    $key: "fechaSolicitudEntrada",
    $width: "15rem",
    $sortable: true,
    $isSticky: true,
  },
  {
    $header: "Fecha de efectividad de Entrada",
    $key: "fechaEfectividadEntrada",
    $width: "15rem",
    $stickyOffset: "15rem",
    $sortable: true,
    $isSticky: true,
  },
  {
    $header: "Tipo de Vinculación",
    $key: "tipoVinculacionId",
    $stickyOffset: "30rem",
    $sortable: true,
    $isSticky: true,
    $borderRight: true,
  },
  { $header: "Entidad Origen", $key: "codigoEntidadOrigen" },
  { $header: "Folio de solicitud de Salida", $key: "afiliadoFondoID" },
  { $header: "Folio de efectividad de Salida", $key: "folioSalida" },
  { $header: "Entidad salida", $key: "codigoEntidadSalida" },
  { $header: "Folio de afiliación", $key: "folioAfiliacion" },
  { $header: "Folio de salida", $key: "folioSalida" },
  { $header: "Estado Vigencia", $key: "validezVigencia" },
  { $header: "Sub-estado de la cuenta", $key: "subestadoAfiliadoFondoId" },
];
