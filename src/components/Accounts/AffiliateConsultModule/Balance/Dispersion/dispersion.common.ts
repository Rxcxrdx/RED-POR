import { Column } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

export const historicColumns: Column<any>[] = [
  { $header: "No de plantilla", $key: "plantillaDispersionId" },
  { $header: "Ultima modificación", $key: "fechaModificacion" },
  { $header: "Origen", $key: "origen" },
  { $header: "Estado", $key: "estado" },
];
