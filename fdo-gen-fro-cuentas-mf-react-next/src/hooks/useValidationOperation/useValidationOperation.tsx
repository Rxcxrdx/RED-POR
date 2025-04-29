import { useContext, useEffect, useState } from "react";
import { validateOperationPost } from "@/services";

interface ValidationRecord {
  validacionId: number;
  nombre: string;
  resultado: string;
  descripcion: string | null;
}

export const useValidationOperation = (
  Context: React.Context<any>,
  codigoOperacionId: string
) => {
  const {
    cuentaId,
    affiliateDetail,
    selectedContributions,
    setSelectedContributions,
    setAffiliateDetail,
  } = useContext(Context);

  const [validationData, setValidationData] = useState<ValidationRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<ValidationRecord | null>(
    null
  );

  const handleValidateOperation = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!cuentaId) {
      setValidationData([]);
      setSelectedContributions([]);
      setErrorMessage("No se ha seleccionado una cuenta.");
      setIsLoading(false);
      return;
    }

    if (!affiliateDetail || !affiliateDetail.afiliado) {
      setValidationData([]);
      setErrorMessage(
        "No hay información suficiente para realizar la validacíon"
      );
      setIsLoading(false);
      return;
    }

    if (!selectedContributions || selectedContributions.length === 0) {
      setValidationData([]);
      setErrorMessage(
        "Debe seleccionar al menos un aporte para realizar la validación."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await validateOperationPost({
        codigoOperacionId: codigoOperacionId,
        numeroCuenta: affiliateDetail.numeroCuenta!,
        afiliado: affiliateDetail.afiliado,
        listaAportes: selectedContributions,
      });

      if (response && Array.isArray(response)) {
        setValidationData(response);
        setTotalRecords(response.length);
        setTotalPages(Math.ceil(response.length / pageSize));
      } else {
        throw new Error("Error al validar los aportes");
      }
    } catch (error: any) {
      console.error("Error en validación:", error);
      if (error.response?.status === 206) {
        setErrorMessage(
          "No se encontró información para la validación solicitada."
        );
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Error al validar los aportes"
        );
      }
      setValidationData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    page,
    cuentaId,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    selectedRecord,
    validationData,
    affiliateDetail,
    selectedContributions,
    setPage,
    setPageSize,
    setSelectedRecord,
    handleValidateOperation,
  };
};
