import React, { useEffect, useState } from "react";
import { Button, Toast } from "pendig-fro-transversal-lib-react";

import {
  DataBox,
  Loader,
  TableWithHeader,
  TextWithDivider,
} from "@/components/common";
import {
  getCaseApprovalInformationService,
  postRejectOperationService,
} from "@/services/operations";

import {
  affiliateBalanceColumns,
  caseDataLayout,
  contributionsSummaryColumns,
  transferInformationLayout,
} from "../ConsultCases.common";

import styles from "./caseApproval.module.scss";

export const CaseApproval = () => {
  const [approvalCaseData, setApprovalCaseData] = useState<any>({
    affiliateBalance: [],
    contributionSummary: [],
    transferInformation: {},
    caseData: {},
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState({
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 100,
  });

  // TODO: implement this service when back give definition
  const onApprove = () => {};

  const onRejectFilter = async () => {
    setIsLoading(true);
    try {
      const response = await postRejectOperationService({
        casoId: approvalCaseData?.caseData?.numeroCaso,
        estado: "RECHAZADO",
        usuarioUltimaModificacion: "test-user",
      });
      const statusCode = response?.status?.statusCode;
      if (statusCode === 200) {
        Toast.showStatusCode(200);
      }
    } catch (error) {
      Toast.showStatusCode((error as any)?.status || 400);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCaseApprovalData = async () => {
    setIsLoading(true);
    try {
      const response = await getCaseApprovalInformationService();
      const { casesApproval } = response?.data;
      setApprovalCaseData(casesApproval);
    } catch (error) {
      Toast.showStatusCode((error as any)?.status || 400);
      setErrorMessage("Error al consultar aprobaciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseApprovalData();
    Toast.init();
  }, []);

  return (
    <div className={styles.caseApprovalContainer}>
      <Loader isLoading={isLoading} />

      <TableWithHeader
        title="Saldo del afiliado"
        tableProps={{
          $columns: affiliateBalanceColumns,
          $data: approvalCaseData.affiliateBalance,
          $currentPage: tableData.currentPage,
          $totalPages: tableData.totalPages,
          $itemsPerPage: tableData.itemsPerPage,
          $totalItems: tableData.totalItems,
          $onPageChange: () => {},
          $onItemsPerPageChange: () => {},
          $itemsPerPageOptions: [2, 10, 20, 30],
          $onSelectionChange: () => {},
          $onSort: () => {},
          $variants: ["headerGray", "withShadow", "stripedRows"],
        }}
      />

      <TableWithHeader
        title="Resumen aportes asociados"
        tableProps={{
          $columns: contributionsSummaryColumns,
          $data: approvalCaseData.contributionSummary,
          $currentPage: tableData.currentPage,
          $totalPages: tableData.totalPages,
          $itemsPerPage: tableData.itemsPerPage,
          $totalItems: tableData.totalItems,
          $onPageChange: () => {},
          $onItemsPerPageChange: () => {},
          $itemsPerPageOptions: [2, 10, 20, 30],
          $onSelectionChange: () => {},
          $onSort: () => {},
          $variants: ["headerGray", "withShadow", "stripedRows"],
        }}
      />

      <TextWithDivider>Informaciòn de Transferencia</TextWithDivider>

      <div className={styles.sectionInfo}>
        {transferInformationLayout.map((element) => (
          <DataBox
            key={element.$key}
            label={element.$header}
            value={approvalCaseData?.transferInformation[element.$key]}
          />
        ))}
      </div>

      <TextWithDivider>Datos del caso</TextWithDivider>

      <div className={styles.sectionInfo}>
        {caseDataLayout.map((element) => (
          <DataBox
            key={element.$key}
            label={element.$header}
            value={approvalCaseData?.caseData[element.$key]}
          />
        ))}
      </div>

      <div className={styles.caseApprovalContainer__filterButtons}>
        <Button $color="primary" onClick={onApprove}>
          Aprobar
        </Button>
        <Button $color="secondary" onClick={onRejectFilter}>
          Rechazar
        </Button>
      </div>
    </div>
  );
};

export default CaseApproval;
