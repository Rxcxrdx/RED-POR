import React, { useContext } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "pendig-fro-transversal-lib-react";

import {
  CaseApplicationForm,
  UserDetailContainer,
} from "@/components/SharedComponent";
import { BoxMessage, Loader } from "@/components/common";
import { TransferSuspenseContext } from "@/context";

interface TransferSuspenseCaseApplicationViewProps {
  filterFormCaseApplication: UseFormReturn<any>;
  handleSubmitCase: () => void;
  handleApplyCase: () => void;
  handleRejectCase: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  caseNumber?: string;
  isCaseSaved?: boolean;
  isButtonSaveDisable?: boolean;
}

export const TransferSuspenseCaseApplicationView: React.FC<
  TransferSuspenseCaseApplicationViewProps
> = ({
  filterFormCaseApplication,
  handleSubmitCase,
  handleApplyCase,
  handleRejectCase,
  isLoading = false,
  errorMessage,
  successMessage,
  caseNumber,
  isCaseSaved = false,
  isButtonSaveDisable,
}) => {
  const { cuentaId } = useContext(TransferSuspenseContext);
  const formIsValid = filterFormCaseApplication.formState.isValid;
  const formIsDirty = filterFormCaseApplication.formState.isDirty;
  const isFormComplete = formIsValid && formIsDirty;

  const onSubmitForm = (e: any) => {
    e.preventDefault();
    filterFormCaseApplication.trigger().then((isValid) => {
      if (isValid) {
        handleSubmitCase();
      }
    });
  };

  if (!cuentaId) {
    return <BoxMessage errorMessage="No se ha seleccionado una cuenta." />;
  }

  return (
    <div>
      <Loader isLoading={isLoading} />
      <div
        style={{
          display: "flex",
          maxWidth: "100%",
          height: "100%",
          flexDirection: "column",
          boxSizing: "border-box",
          marginTop: "16px",
          gap: "24px",
        }}
      >
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
        {errorMessage && <BoxMessage errorMessage={errorMessage} />}

        {successMessage && (
          <BoxMessage
            errorMessage={`${successMessage}${
              caseNumber ? `. Número de caso: ${caseNumber}` : ""
            }`}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <h3>Datos del caso</h3>
          <div
            style={{
              borderRadius: "8px",
              border: "1px solid #e8f4e1",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <div style={{ padding: "16px", width: "100%", height: "100%" }}>
              <form onSubmit={onSubmitForm} autoComplete="off">
                <CaseApplicationForm filterForm={filterFormCaseApplication} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "16px",
                    borderTop: "1px solid #e8f4e1",
                    gap: "16px",
                  }}
                >
                  {isButtonSaveDisable && (
                    <p style={{ textAlign: "center", margin: "5px 0" }}>
                      Solo se pueden crear y guardar casos cuando la todas las
                      validaciones son exitosas.
                    </p>
                  )}
                  {!isCaseSaved ? (
                    <Button
                      type="submit"
                      color="primary"
                      $size="small"
                      disabled={
                        isLoading || !isFormComplete || isButtonSaveDisable
                      }
                    >
                      {isLoading ? "Guardando..." : "Guardar Caso"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        $size="small"
                        onClick={handleRejectCase}
                        disabled={isLoading}
                      >
                        Aplicar Caso
                      </Button>
                      <Button
                        type="button"
                        $size="small"
                        onClick={handleRejectCase}
                        disabled={isLoading}
                      >
                        Rechazar Caso
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
