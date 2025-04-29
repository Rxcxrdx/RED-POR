import React, { useContext, useEffect, useState } from "react";

import { COMMON_LABELS } from "@/common/constants";
import { BoxMessage, Loader } from "@/components/common";
import { DepositAccountTransferContext } from "@/context";
import { useTableData } from "@/hooks";

import { postContributionDetailService } from "@/services/operations/DepositAccountTransfer/depositTransferAccount.service";
import { contributionDetailColumns } from "../DepositAccountTransfer.common";
import { DepositAccountContributionDetailView } from "./DepositAccountContributionDetailView";

export const DepositAccountContributionDetail = () => {
  const { NO_ACCOUNT_SELECTED } = COMMON_LABELS;
  const { cuentaId } = useContext(DepositAccountTransferContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { tableProperties, fetchInitialData, errorTableMessage } = useTableData(
    {
      serviceInfo: {
        service: postContributionDetailService,
        body: { cuentaId: cuentaId, cuentaAporteId: null },
        dataArgument: "aporte",
        beforeService: () => {
          setIsLoading(true);
          setErrorMessage("");
        },
        afterService: () => {
          setIsLoading(false);
        },
      },
    }
  );

  useEffect(() => {
    if (!cuentaId) {
      setErrorMessage(NO_ACCOUNT_SELECTED);
      return;
    }
    fetchInitialData();
  }, [cuentaId]);

  if (errorMessage || errorTableMessage) {
    return <BoxMessage errorMessage={errorMessage || errorTableMessage} />;
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      <DepositAccountContributionDetailView
        depositContributionColumns={{
          ...tableProperties,
          $columns: contributionDetailColumns,
          $selectionType: "radio",
        }}
      />
    </>
  );
};
