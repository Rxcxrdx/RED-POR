"use client";
import React from "react";
import { BoxMessage, Loader } from "@/components/common";

import {
  BaseValidationTable,
  UserDetailContainer,
} from "@/components/SharedComponent";
import { DepositAccountTransferContext } from "@/context";

export const DepositAccountValidationView: React.FC<any> = ({
  page,
  setPage,
  pageSize,
  cuentaId,
  isLoading,
  setPageSize,
  totalRecords,
  errorMessage,
  validationData,
}) => {
  const getViewStateValidationView = () => {
    if (!cuentaId) return "NO_ACCOUNT_VALIDATION";
    if (isLoading) return "LOADING_VALIDATION";
    if (errorMessage) return "ERROR_VALIDATION";
    if (!validationData?.length) return "EMPTY_VALIDATION";
    return "DATA_VALIDATION";
  };

  const renderStateMessageValidation = () => {
    const messageValidationComponents = {
      NO_ACCOUNT_VALIDATION: (
        <BoxMessage errorMessage="No se ha seleccionado una cuenta." />
      ),
      LOADING_VALIDATION: <Loader isLoading={isLoading} />,
      ERROR_VALIDATION: <BoxMessage errorMessage={errorMessage} />,
      EMPTY_VALIDATION: (
        <BoxMessage errorMessage="No hay datos de validación disponibles. Por favor, realice una validación." />
      ),
      DATA_VALIDATION: (
        <BaseValidationTable
          records={validationData}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          totalRecords={totalRecords}
          setPageSize={setPageSize}
        />
      ),
    };

    return messageValidationComponents[getViewStateValidationView()];
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <UserDetailContainer
          ContextProvider={DepositAccountTransferContext}
          hiddenFields={[
            "GÉNERO",
            "REGISTRADURÍA",
            "TRANSICIÓN",
            "CIUDAD",
            "DIRECCIÓN",
            "EMAIL",
            "OCUPACIÓN",
            "TELÉFONO",
            "CELULAR",
            "BARRIO",
            "EMPLEADOR",
            "IBC INFORMADO",
          ]}
        />
        <div>{renderStateMessageValidation()}</div>
      </div>
    </>
  );
};
