"use client";
import React from "react";

import { SuspenseDetailDataTable } from "./SuspenseDetailDataTable/SuspenseDetailDataTable";
import { SuspenseDetailDataOriginTable } from "./SuspenseDetailDataOriginTable/SuspenseDetailDataOriginTable";
import { SuspenseDetailDataAccount } from "./SuspenseDetailDataAccount/SuspenseDetailDataAccount";
import { SuspenseDetailUpdate } from "./SuspenseDetailUpdate/SuspenseDetailUpdate";

export const SuspenseDetailView: React.FC = () => {
  return (
    <div>
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
        <h3>Datos del rezago</h3>
        <SuspenseDetailDataTable />
        <h3>Datos de la cuenta</h3>
        <SuspenseDetailDataAccount />
        <h3>Datos origen del rezago</h3>
        <SuspenseDetailDataOriginTable />
        <h3>Novedades del rezago</h3>
        <SuspenseDetailUpdate />
      </div>
    </div>
  );
};
