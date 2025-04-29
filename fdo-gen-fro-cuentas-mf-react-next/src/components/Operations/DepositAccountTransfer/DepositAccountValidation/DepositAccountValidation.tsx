import { useContext, useEffect } from "react";
import { useValidationOperation } from "@/hooks";
import { DepositAccountTransferContext } from "@/context";
import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";
import { DepositAccountValidationView } from "./DepositAccountValidationView";

export const DepositAccountValidation: React.FC = () => {
  const { currentTab } = useContext(DepositAccountTransferContext);
  const {
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
    handleValidateOperation,
  } = useValidationOperation(
    DepositAccountTransferContext,
    DE_CTA_A_REZAGO_CCAI
  );

  useEffect(() => {
    if (currentTab === "validation") {
      handleValidateOperation();
    }
  }, [currentTab]);

  const DepositAccountValidationProps = {
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

  return <DepositAccountValidationView {...DepositAccountValidationProps} />;
};
