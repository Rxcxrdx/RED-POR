import { Toast } from "pendig-fro-transversal-lib-react";

export type CustomStatusCode = any | "noResults";

export const showCustomToast = (type: CustomStatusCode) => {
  if (type !== "noResults") {
    Toast.showStatusCode(type as any);
    return;
  }
  Toast.show("Sin resultados", {
    $borderLeft: true,
    $iconSwap: "info",
    $color: "red",
    $content:
      "La búsqueda no arrojó resultados. Intenta ajustar tus criterios de búsqueda o verifica la información ingresada.",
    $type: "soft",
    $showCloseButton: true,
  });
};
