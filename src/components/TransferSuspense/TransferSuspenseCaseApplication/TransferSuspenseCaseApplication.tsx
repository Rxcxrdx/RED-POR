import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";
import { TransferSuspenseContext } from "@/context";
import { useCaseApplication, useValidationOperation } from "@/hooks";

import { TransferSuspenseCaseApplicationView } from "./TransferSuspenseCaseApplicationView";

export const TransferSuspenseCaseApplication: React.FC = () => {
  const filterFormCaseApplication = useForm<any>({
    mode: "onChange",
    defaultValues: {
      numeroCaso: "",
      tipoRequerimiento: "",
      tipoCausal: "",
      relacionadoCon: "",
      documentoSoporte: "",
      observacion: "",
    },
  });

  const {
    handleSubmitCase,
    handleApplyCase,
    handleRejectCase,
    isLoading,
    caseNumber,
    errorMessage,
    successMessage,
    isCaseSaved,
  } = useCaseApplication({
    form: filterFormCaseApplication,
    context: TransferSuspenseContext,
  });

  const {
    errorMessage: validationError,
    validationData,
    handleValidateOperation,
  } = useValidationOperation(TransferSuspenseContext, DE_CTA_A_REZAGO_CCAI);

  useEffect(() => {
    handleValidateOperation();
  }, []);

  const caseApplicationViewProps = {
    handleSubmitCase,
    handleApplyCase,
    handleRejectCase,
    isLoading,
    caseNumber,
    errorMessage,
    successMessage,
    isCaseSaved,
    filterFormCaseApplication,
    isButtonSaveDisable:
      validationData.some((item) => item.resultado === "RECHAZADO") ||
      !!validationError,
  };

  return <TransferSuspenseCaseApplicationView {...caseApplicationViewProps} />;
};
