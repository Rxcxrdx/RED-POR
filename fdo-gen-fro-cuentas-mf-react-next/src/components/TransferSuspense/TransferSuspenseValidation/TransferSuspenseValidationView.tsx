"use client";
import React from "react";
import { BoxMessage, Loader } from "@/components/common";

import { TransferSuspenseContext } from "@/context";
import {
  BaseValidationTable,
  UserDetailContainer,
} from "@/components/SharedComponent";

export const TransferSuspenseValidationView: React.FC<any> = ({
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
  const getViewState = () => {
    if (!cuentaId) return "NO_ACCOUNT";
    if (isLoading) return "LOADING";
    if (errorMessage) return "ERROR";
    if (!validationData?.length) return "EMPTY";
    return "DATA";
  };

  const renderStateMessage = () => {
    const stateStyles = {
      display: "flex",
      width: "100%",
      padding: "16px",
      boxShadow: "1px 2px 0px 0px rgb(156, 153, 156)",
      border: "1px solid var(--tvr-secondary-300)",
      borderRadius: "8px",
      justifyContent: "center",
      alignItems: "center",
    };

    switch (getViewState()) {
      case "NO_ACCOUNT":
        return <div style={stateStyles}>No se ha seleccionado una cuenta.</div>;
      case "LOADING":
        return <Loader isLoading={isLoading} />;
      case "ERROR":
        return <BoxMessage errorMessage={errorMessage} />;
      case "EMPTY":
        return (
          <div style={stateStyles}>
            No hay datos de validación disponibles. Por favor, realice una
            validación.
          </div>
        );
      case "DATA":
        return (
          <BaseValidationTable
            records={validationData}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            totalRecords={totalRecords}
            setPageSize={setPageSize}
          />
        );
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <UserDetailContainer
          ContextProvider={TransferSuspenseContext}
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
        <div
          style={{
            marginTop: "16px",
            position: "relative",
            minHeight: "200px",
          }}
        >
          {renderStateMessage()}
        </div>
      </div>
    </>
  );
};
