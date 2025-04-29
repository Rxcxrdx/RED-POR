import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Dropdown } from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS, DE_CTA_A_DEPO_CCAI } from "@/common/constants";
import { BoxMessage, Loader, TableWithHeader } from "@/components/common";
import {
  CaseApplicationForm,
  UserDetailContainer,
} from "@/components/SharedComponent";
import { DepositAccountTransferContext } from "@/context";
import {
  useCaseApplication,
  useTableData,
  useValidationOperation,
} from "@/hooks";
import {
  getAccountsInformationService,
  getBanksService,
  getCaseApprovalInformationService,
  getOfficesInformationService,
} from "@/services/operations";

import { contributionsSummaryColumns } from "../../ConsultCases/ConsultCases.common";
import {
  affiliateInformationColumns,
  fundOptions,
} from "../DepositAccountTransfer.common";
import DepositFormData from "./DepositFormData";

import styles from "./DepositAccountApprovalCase.module.scss";

export const DepositAccountApprovalCase = () => {
  const { NO_ACCOUNT_SELECTED } = COMMON_LABELS;
  const { cuentaId } = useContext(DepositAccountTransferContext);
  const [errorMessageDeposit, setErrorMessageDeposit] = useState<string>("");
  const [isLoadingDeposit, setIsLoadingDeposit] = useState<boolean>(false);
  const [depositAccountData, setDepositAccountData] = useState<any>({
    affiliateBalance: [],
    contributionSummary: [],
    transferInformation: {},
    caseData: {},
  });

  const { tableProperties } = useTableData({
    serviceInfo: { dataArgument: "" },
  });

  const [bankList, setBankList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [accountList, setAccountList] = useState([]);

  const filterFormCaseApplicationDeposit = useForm<any>({
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
    errorMessage: validationError,
    validationData,
    handleValidateOperation,
  } = useValidationOperation(DepositAccountTransferContext, DE_CTA_A_DEPO_CCAI);

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
    form: filterFormCaseApplicationDeposit,
    context: DepositAccountTransferContext,
    operationId: DE_CTA_A_DEPO_CCAI,
  });

  const fetchDepositAccountData = async () => {
    setIsLoadingDeposit(true);
    try {
      const response = await getCaseApprovalInformationService();
      const { casesApproval } = response?.data;
      setDepositAccountData(casesApproval);
    } catch (error) {
      setErrorMessageDeposit("Error al consultar datos");
    } finally {
      setIsLoadingDeposit(false);
    }
  };

  const formIsValid = filterFormCaseApplicationDeposit.formState.isValid;
  const formIsDirty = filterFormCaseApplicationDeposit.formState.isDirty;
  const isFormComplete = formIsValid && formIsDirty;

  const handleCaseFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterFormCaseApplicationDeposit.trigger().then((isValid) => {
      if (isValid) {
        handleSubmitCase();
      }
    });
  };

  const fetchBankData = async () => {
    try {
      const response = await getBanksService();
      if (response?.status?.statusCode === 200) {
        setBankList(
          response.data?.bancos.map((item: any) => ({
            text: item.nombreBanco,
            value: item.bancoId,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDepositFormData = async () => {
    const bankId = filterFormCaseApplicationDeposit.watch("bank");
    const fetchOfficesData = async () => {
      try {
        const response = await getAccountsInformationService(bankId);
        if (response?.status?.statusCode === 200) {
          setOfficeList(
            response.data?.oficinaBanco.map((item: any) => ({
              text: item.nombre,
              value: item.oficinaBancariaId,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAccountsData = async () => {
      try {
        const response = await getOfficesInformationService(bankId);
        if (response?.status?.statusCode === 200) {
          setAccountList(
            response.data?.cuentaBanco.map((item: any) => ({
              text: item.nombreBanco,
              value: item.bancoId,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfficesData();
    fetchAccountsData();
  };

  useEffect(() => {
    fetchDepositAccountData();
    fetchBankData();
    handleValidateOperation();
  }, []);

  useEffect(() => {
    fetchDepositFormData();
  }, [bankList]);

  useEffect(() => {
    if (cuentaId === null) {
      setErrorMessageDeposit(NO_ACCOUNT_SELECTED);
    } else {
      setErrorMessageDeposit("");
      handleValidateOperation();
    }
  }, [cuentaId]);

  if (errorMessageDeposit) {
    return <BoxMessage errorMessage={errorMessageDeposit} />;
  }

  return (
    <>
      <Loader isLoading={isLoadingDeposit} />
      <Loader isLoading={isLoading} />
      <div style={{ marginTop: "16px" }}>
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
      </div>

      <TableWithHeader
        title="Saldo del afiliado"
        tableProps={{
          ...tableProperties,
          $columns: affiliateInformationColumns,
          $data: depositAccountData.affiliateBalance,
          $variants: ["headerGray", "withShadow", "stripedRows"],
        }}
      />

      <TableWithHeader
        title="Resumen aportes asociados"
        tableProps={{
          ...tableProperties,
          $columns: contributionsSummaryColumns,
          $data: depositAccountData.contributionSummary,
          $variants: ["headerGray", "withShadow", "stripedRows"],
        }}
      />

      <div className={styles.sectionContainer}>
        <h3>Datos del fondo destino</h3>
        <div className={styles.destinyAccountContainer}>
          <Dropdown
            $title="Fondo"
            $size="small"
            placeholder="Selecciona fondo"
            $Value="Fondo generacional"
            $options={fundOptions}
            onFocus={() => {}}
            onSelect={() => {}}
            disabled
          />
        </div>
      </div>

      <DepositFormData
        filterForm={filterFormCaseApplicationDeposit}
        bankList={bankList}
        accountList={accountList}
        officeList={officeList}
      />

      {successMessage && (
        <BoxMessage
          errorMessage={`${successMessage}${
            caseNumber ? `. Número de caso: ${caseNumber}` : ""
          }`}
        />
      )}

      <div className={styles.sectionContainer}>
        <h3>Datos del caso</h3>

        <form onSubmit={handleCaseFormSubmit} autoComplete="off" id="caseForm">
          <CaseApplicationForm filterForm={filterFormCaseApplicationDeposit} />
        </form>
      </div>

      {(validationData.some((item) => item.resultado === "RECHAZADO") ||
        !!validationError) && (
        <p style={{ textAlign: "center", margin: "5px 0" }}>
          Solo se pueden crear y guardar casos cuando la todas las validaciones
          son exitosas.
        </p>
      )}
      <div className={styles.buttonsContainer}>
        {!isCaseSaved ? (
          <Button
            type="submit"
            form="caseForm"
            $color="primary"
            $w="20%"
            disabled={
              isLoading ||
              !isFormComplete ||
              validationData.some((item) => item.resultado === "RECHAZADO") ||
              !!validationError
            }
          >
            {isLoading ? "Guardando..." : "Guardar Caso"}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              color="primary"
              $size="small"
              onClick={() => handleApplyCase([])}
              disabled={isLoading}
            >
              Aplicar Caso
            </Button>
            <Button
              type="button"
              color="secondary"
              $size="small"
              onClick={handleRejectCase}
              disabled={isLoading}
            >
              Rechazar Caso
            </Button>
          </>
        )}
      </div>
    </>
  );
};
