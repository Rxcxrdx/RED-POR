import { useContext, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";
import {
  createCasePost,
  ICreateCasePayload,
  postApplyOperationService,
  postRejectOperationService,
} from "@/services";

interface UseCaseApplicationProps {
  form: UseFormReturn<any>;
  context: React.Context<any>;
  operationId?: string;
}

export const useCaseApplication = ({
  form,
  context,
  operationId = DE_CTA_A_REZAGO_CCAI,
}: UseCaseApplicationProps) => {
  const { cuentaId } = useContext(context);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [caseNumber, setCaseNumber] = useState<string>("");
  const [isCaseSaved, setIsCaseSaved] = useState<boolean>(false);

  const handleSubmitCase = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setCaseNumber("");

    if (!cuentaId) {
      setErrorMessage("No se ha seleccionado una cuenta.");
      setIsLoading(false);
      return;
    }

    const {
      tipoRequerimiento,
      tipoCausal,
      relacionadoCon,
      documentoSoporte,
      observacion,
    } = form.getValues();

    try {
      const payload: ICreateCasePayload = {
        caso: {
          numeroCtaDocumento: cuentaId,
          codigoOperacionId: operationId,
          usuarioCreacion: "user-test",
          tipoRequerimientoId: tipoRequerimiento,
          causalCasoId: tipoCausal,
          autotareaTipoRelacion: relacionadoCon,
          autotareaValorRelacion: documentoSoporte,
          autotareaInformacionRelacion: observacion,
        },
      };

      const response = await createCasePost(payload);

      if (response?.status?.statusCode === 200) {
        setSuccessMessage("Caso creado exitosamente");
        setCaseNumber(response.data);
        setIsCaseSaved(true);
      } else {
        throw new Error(
          response?.status?.statusDescription || "Error al crear el caso"
        );
      }
    } catch (error: any) {
      console.error("Error al crear caso:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error al crear el caso. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCase = async (payload?: any) => {
    setIsLoading(true);
    if (!cuentaId) {
      setErrorMessage("No se ha seleccionado una cuenta.");
      setIsLoading(false);
      return;
    }
    try {
      // TODO: check how to build this body with the team.
      const response = await postApplyOperationService({
        codigoOperacionId: operationId,
        numeroCuenta: cuentaId,
        administradora: "",
        aseguradora: "",
        usuarioCreacion: "test-user",
        casoId: parseInt(caseNumber),
        listaAportes: [{ cuentaAporteId: 879091901, listaDetalles: [] }],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      form.reset();
      setIsCaseSaved(false);
      setErrorMessage("");
      setSuccessMessage("");
      setCaseNumber("");
    }
  };

  const handleRejectCase = async () => {
    setIsLoading(true);
    if (!cuentaId) {
      setErrorMessage("No se ha seleccionado una cuenta.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await postRejectOperationService({
        casoId: parseInt(caseNumber),
        estado: "RECHAZADO",
        usuarioUltimaModificacion: "test-user",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      form.reset();
      setIsCaseSaved(false);
      setErrorMessage("");
      setSuccessMessage("");
      setCaseNumber("");
    }
  };

  return {
    cuentaId,
    isLoading,
    caseNumber,
    errorMessage,
    successMessage,
    isCaseSaved,
    handleSubmitCase,
    handleApplyCase,
    handleRejectCase,
  };
};
