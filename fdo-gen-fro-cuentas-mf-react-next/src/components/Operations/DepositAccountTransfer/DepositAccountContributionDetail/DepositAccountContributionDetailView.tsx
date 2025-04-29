import React from "react";

import { DepositAccountTransferContext } from "@/context";
import { UserDetailContainer } from "@/components/SharedComponent";
import { TableWithHeader } from "@/components/common";

export const DepositAccountContributionDetailView = ({
  depositContributionColumns,
}: any) => {
  return (
    <>
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
      <TableWithHeader
        title="Detalles Aportes"
        tableProps={depositContributionColumns}
      />
    </>
  );
};
