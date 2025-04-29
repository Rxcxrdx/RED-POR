"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import { BoxMessage, Loader } from "@/components/common";

import { SuspenseConsultFilterForm } from "./SuspenseConsultFiltersForm/SuspenseConsultFiltersForm";
import { SuspenseTable } from "./SuspenseConsultTable/SuspenseConsultTable";
import {
  ISuspense,
  SuspenseConsultFilterFormValues,
} from "./ISuspenseConsultForm";
import { Spinner } from "pendig-fro-transversal-lib-react";

  interface ISuspenseConsultViewProps {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    isLoading: boolean;
    errorMessage?: string;
    suspenseData: ISuspense[];
    filterFormSuspense: UseFormReturn<SuspenseConsultFilterFormValues>;
    setErrorMessage: (message: string) => void;
    handleFilterSubmit: () => void;
    handleFilterReset: () => void;
    handleItemsPerPageChange: (newSize: number) => void;
    setPage: (page: number) => void;
    handleDownloadSuspenses: () => void;
    setsuspenseData: (data: ISuspense[]) => void;
  }
export const SuspenseConsultFormView: React.FC<ISuspenseConsultViewProps> = ({ 
  page,
  pageSize,
  isLoading,
  errorMessage,
  setErrorMessage,
  totalRecords,
  suspenseData,
  setsuspenseData,
  filterFormSuspense,
  setPage,
  handleFilterReset,
  handleFilterSubmit,
  handleItemsPerPageChange,
  handleDownloadSuspenses
}: ISuspenseConsultViewProps) => {
  
    return (
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
          <SuspenseConsultFilterForm
              suspenseData={suspenseData}
              setsuspenseData={setsuspenseData}
              form={filterFormSuspense}
              onSubmit={handleFilterSubmit}
              onReset={handleFilterReset}
              handleDownloadSuspenses={handleDownloadSuspenses}
              setErrorMessage={setErrorMessage}
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
            <>
              <SuspenseTable
                records={suspenseData}
                page={page}
                pageSize={pageSize}
                totalRecords={totalRecords}
                setPage={setPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </div>  
    );
  };
