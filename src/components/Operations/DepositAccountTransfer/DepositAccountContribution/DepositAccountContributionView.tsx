"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BoxMessage } from "@/components/common";
import {
  IAporte,
  ContributionFilterFormValues,
} from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";

import {
  BaseContributionTable,
  ContributionForm,
  UserDetailContainer,
} from "@/components/SharedComponent";
import { DepositAccountTransferContext } from "@/context";
import { Spinner } from "pendig-fro-transversal-lib-react";

interface DepositAccountContributionViewProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage?: string;
  contributionData: IAporte[];
  selectedRecord: any[] | null;
  filterFormContribution: UseFormReturn<ContributionFilterFormValues>;
  handleFilterSubmit: () => void;
  handleFilterReset: () => void;
  handleItemsPerPageChange: (newSize: number) => void;
  setPage: (page: number) => void;
  handleSelectionChange: (selectedRows: any[]) => void;
}
export const DepositAccountContributionView = ({
  page,
  pageSize,
  isLoading,
  errorMessage,
  totalRecords,
  selectedRecord,
  contributionData,
  filterFormContribution,
  setPage,
  handleFilterReset,
  handleFilterSubmit,
  handleSelectionChange,
  handleItemsPerPageChange,
}: DepositAccountContributionViewProps) => {
  return (
    <>
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
        <ContributionForm
          form={filterFormContribution}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
        />

        {isLoading && (
          <>
            <Spinner
              $variant="fullScreen"
              $message="Cargando información..."
              $hContainer="180px"
              $wContainer="282px"
            />
          </>
        )}

        {errorMessage ? (
          <BoxMessage errorMessage={errorMessage} />
        ) : (
          <BaseContributionTable
            records={contributionData}
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            selectedRecord={selectedRecord}
            setPage={setPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            handleSelectionChange={handleSelectionChange}
          />
        )}
      </div>
    </>
  );
};
