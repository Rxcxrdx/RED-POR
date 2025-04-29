import { useContext, useEffect } from "react";
import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";
import { TransferSuspenseContext } from "@/context";
import { useValidationOperation } from "@/hooks";
import { TransferSuspenseValidationView } from "./TransferSuspenseValidationView";

export const TransferSuspenseValidation: React.FC = () => {
  const { currentTab } = useContext(TransferSuspenseContext);
  const {
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    selectedRecord,
    validationData,
    setPage,
    setPageSize,
    setSelectedRecord,
    handleValidateOperation,
    cuentaId,
  } = useValidationOperation(TransferSuspenseContext, DE_CTA_A_REZAGO_CCAI);

  useEffect(() => {
    if (currentTab === "validation") {
      handleValidateOperation();
    }
  }, [currentTab]);

  const validationViewProps = {
    page,
    pageSize,
    cuentaId,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    selectedRecord,
    validationData,
    setPage,
    setPageSize,
    setSelectedRecord,
  };

  return <TransferSuspenseValidationView {...validationViewProps} />;
};
