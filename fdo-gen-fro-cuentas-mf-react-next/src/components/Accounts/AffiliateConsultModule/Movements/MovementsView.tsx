"use client";

import React from "react";

import { BoxMessage, Loader } from "@/components/common";

import { MovementsFilterForm } from "./form";
import { IMovementsViewProps } from "./IMovements";
import { MovementsTable } from "./MovementsTable";

export const MovementsView: React.FC<IMovementsViewProps> = ({
  setPage,
  handleFilterReset,
  handleFilterSubmit,
  handleDownloadMovements,
  page,
  pageSize,
  isLoading,
  errorMessage,
  totalRecords,
  conceptOptions,
  movimientosData,
  filterFormMovements,
}) => {
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
          <MovementsFilterForm
            conceptOptions={conceptOptions}
            filterFormMovements={filterFormMovements}
            handleFilterSubmit={handleFilterSubmit}
            handleFilterReset={handleFilterReset}
            handleDownloadMovements={handleDownloadMovements}
          />
        </div>
      </div>
      <div style={{ marginTop: 24, position: "relative" }}>
        <Loader isLoading={isLoading} />
        {errorMessage ? (
          <BoxMessage errorMessage={errorMessage} />
        ) : (
          <MovementsTable
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            records={movimientosData}
            totalRecords={totalRecords}
          />
        )}
      </div>
    </div>
  );
};
