"use client";
import React from "react";
import { TransferSuspenseLaggingParametersForm } from "./form";
import { TransferSuspenseLaggingParametersTable } from "./TransferSuspenseLaggingParametersTable";
import { UseFormReturn } from "react-hook-form";
import { UserDetailContainer } from "@/components/SharedComponent";
import { TransferSuspenseContext } from "@/context";

interface TransferSuspenseLaggingParametersViewProps {
  filterFormCaseApplication: UseFormReturn<any>;
  handleFilterSubmit: () => void;
  handleFilterReset: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSelectedRecord: (record: any) => void;
  page: number;
  pageSize: number;
  isLoading: boolean;
  errorMessage: string;
  totalRecords: number;
  selectedRecord: any;
  contributionData: any[];
}

export const TransferSuspenseLaggingParametersView: React.FC<
  TransferSuspenseLaggingParametersViewProps
> = ({
  filterFormCaseApplication,
  handleFilterSubmit,
  handleFilterReset,
  setPage,
  setPageSize,
  setSelectedRecord,
  page,
  pageSize,
  isLoading,
  errorMessage,
  totalRecords,
  selectedRecord,
  contributionData,
}) => {
  
  return (
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
      <h3>Saldo</h3>
      <div style={{ marginBottom: "16px" }}>
        <TransferSuspenseLaggingParametersTable
          records={contributionData}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          totalRecords={totalRecords}
          setPageSize={setPageSize}
        />
      </div>
      <h3>Información de transferencia</h3>
      
      <div
        style={{
          borderRadius: "8px",
          border: "1px solid #e8f4e1",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
        }}
      >
       
        <TransferSuspenseLaggingParametersForm
          filterForm={filterFormCaseApplication}
          handleFilterSubmit={handleFilterSubmit}
          handleFilterReset={handleFilterReset}
        />
      </div>
    </div>
  );
};
