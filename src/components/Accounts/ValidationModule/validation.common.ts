/**
 * Common constants or functions used only in validation views
 */
import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

/**
 * There are only two possible states: ACTIVO or INACTIVO
 */
export const validationStates = [
  { value: "ACTIVO", text: "Activo" },
  { value: "INACTIVO", text: "Inactivo" },
];

export const tableValidationColumns = (columns: any[]): Column<any>[] => [
  // TODO: validate this data when integration with backend
  {
    $header: "Id Validación",
    $key: "validacionId",
    $width: "8rem",
    $isSticky: true,
  },
  {
    $header: "Validación",
    $key: "nombre",
    $width: "10rem",
    $stickyOffset: "8rem",
    $isSticky: true,
  },
  {
    $header: "Descripción",
    $key: "descripcion",
    $width: "20rem",
    $stickyOffset: "18rem",
    $isSticky: true,
  },
  {
    $header: "Usuario",
    $key: "usuarioUltimaModificacion",
    $stickyOffset: "38rem",
    $isSticky: true,
    $borderRight: true,
  },
  { $header: "Nombre de usuario", $key: "usuarioUltimaModificacion" },
  { $header: "Fecha ultima actualización", $key: "fechaUltimaModificacion" },
  ...columns,
];
