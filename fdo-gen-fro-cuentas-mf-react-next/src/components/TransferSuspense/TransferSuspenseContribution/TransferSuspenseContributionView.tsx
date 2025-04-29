"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BoxMessage } from "@/components/common";
import {
  IAporte,
  ContributionFilterFormValues,
} from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";

import { TransferSuspenseContext } from "@/context";
import {
  BaseContributionTable,
  ContributionForm,
  UserDetailContainer,
} from "@/components/SharedComponent";

import { SelectedContribution } from "./ITransferSuspenseContribution";
import { Spinner } from "pendig-fro-transversal-lib-react";

interface TransferSuspenseContributionViewProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage?: string;
  contributionData: IAporte[];
  selectedRecord: SelectedContribution[] | null;
  filterFormContributionTransferSuspense: UseFormReturn<ContributionFilterFormValues>;
  setPage: (page: number) => void;
  handleFilterSubmitTransferSuspense: () => void;
  handleFilterResetTransferSuspense: () => void;
  handleSelectionChangeTransferSuspense: (selectedRows: any[]) => void;
  handleItemsPerPageChangeTransferSuspense: (newSize: number) => void;
}
export const TransferSuspenseContributionView = ({
  page,
  pageSize,
  isLoading,
  errorMessage,
  totalRecords,
  selectedRecord,
  contributionData,
  filterFormContributionTransferSuspense,
  setPage,
  handleFilterResetTransferSuspense,
  handleFilterSubmitTransferSuspense,
  handleSelectionChangeTransferSuspense,
  handleItemsPerPageChangeTransferSuspense,
}: TransferSuspenseContributionViewProps) => {
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
        <ContributionForm
          form={filterFormContributionTransferSuspense}
          onReset={handleFilterResetTransferSuspense}
          onSubmit={handleFilterSubmitTransferSuspense}
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
            onItemsPerPageChange={handleItemsPerPageChangeTransferSuspense}
            handleSelectionChange={handleSelectionChangeTransferSuspense}
          />
        )}
      </div>
    </>
  );
};
