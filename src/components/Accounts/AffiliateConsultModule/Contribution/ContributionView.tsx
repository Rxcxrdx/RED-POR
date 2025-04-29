"use client";
import React from "react";

import { Button } from "pendig-fro-transversal-lib-react";

import { PRIMARY_COLOR } from "@/common/constants";
import { BoxMessage, Loader } from "@/components/common";
import { UserDetailContainer } from "@/components/SharedComponent";
import { AffiliateAccountContext } from "@/context";

import { ContributionDetail } from "./ContributionDetail/ContributionDetail";
import { ContributionTable } from "./ContributionTable";
import { ContributionFilterForm } from "./form";
import { IContributionViewProps } from "./IContribution";

export const ContributionView: React.FC<IContributionViewProps> = ({
  setPage,
  setPageSize,
  handleFilterReset,
  setSelectedRecord,
  handleFilterSubmit,
  handleConsultDetail,
  handleBackToContributions,
  handleDownloadContributions,
  handleDownloadTotalContributions,
  cuentaId,
  page,
  pageSize,
  isLoading,
  detailData,
  totalDetailsData,
  showDetail,
  totalPages,
  errorMessage,
  totalRecords,
  isLoadingDetail,
  selectedRecord,
  contributionData,
  movementsData,
  filterFormContribution,
  detailError,
  movementsError,
}) => {
  if (showDetail) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <ContributionDetail
          detailData={detailData}
          movementsData={movementsData}
          onBack={handleBackToContributions}
          isLoadingDetail={isLoadingDetail}
          detailError={detailError}
          errorMessage={errorMessage}
          movementsError={movementsError}
          selectedRecord={selectedRecord}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            borderRadius: "8px",
            border: "1px solid #e8f4e1",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <ContributionFilterForm
            cuentaId={cuentaId}
            filterFormContribution={filterFormContribution}
            handleFilterSubmit={handleFilterSubmit}
            handleFilterReset={handleFilterReset}
            totalDetailsData={totalDetailsData}
            contributionData={contributionData}
            handleDownloadContributions={handleDownloadContributions}
            handleDownloadTotalContributions={handleDownloadTotalContributions}
          />
        </div>
        {/* <UserDetailContainer ContextProvider={AffiliateAccountContext} /> */}
      </div>
      <div style={{ marginTop: 24, position: "relative" }}>
        <Loader isLoading={isLoading} />
        {errorMessage ? (
          <BoxMessage data-testid="error-message" errorMessage={errorMessage} />
        ) : (
          <ContributionTable
            records={contributionData}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            totalRecords={totalRecords}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
          />
        )}
      </div>
      {!showDetail && !errorMessage && selectedRecord && (
        <div
          style={{ display: "flex", marginTop: 24, justifyContent: "flex-end" }}
        >
          <Button onClick={handleConsultDetail} color={PRIMARY_COLOR}>
            Consultar detalle del aporte
          </Button>
        </div>
      )}
    </div>
  );
};
