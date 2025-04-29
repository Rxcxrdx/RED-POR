import React, { useContext } from "react";
import { UseFormReturn } from "react-hook-form";

import { Loader } from "@/components/common";
import {
  AccountFdogenCard,
  AffiliateForm,
  AffiliateList,
  UserDetailContainer,
} from "@/components/SharedComponent";
import { AffiliateAccountContext, TransferSuspenseContext } from "@/context";

interface TransferSuspenseAccountViewProps {
  isLoading: boolean;
  accountData: any[];
  errorMessage?: string;
  pensionAccounts: any[];
  transferConsultData?: any[];
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  filterFormTransferSuspenseAccount: UseFormReturn<any>;
  isNameSearchModalOpen: boolean;
  onCloseNameSearchModal: () => void;
  getNameSearchData: (page: number, pageSize: number) => Promise<any>;
  setSelectedAffiliate: any;
}

export const TransferSuspenseAccountView: React.FC<
  TransferSuspenseAccountViewProps
> = ({
  handleFilterSubmit,
  handleFilterReset,
  isLoading,
  accountData,
  errorMessage,
  filterFormTransferSuspenseAccount,
  isNameSearchModalOpen,
  onCloseNameSearchModal,
  getNameSearchData,
  setSelectedAffiliate,
}) => {
  return (
    <>
      <div
        data-testid="affiliate-consult-view"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "start",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <AffiliateForm
          form={filterFormTransferSuspenseAccount}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
          config={{
            showAccountNumber: true,
            showIdentification: true,
            showName: true,
          }}
          isArrears={true}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "24px",
            width: "100%",
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
              "SARLAFT",
              "BARRIO",
              "EMPLEADOR",
              "IBC INFORMADO",
              "CUENTA No.",
              "ESTADO AFILIADO",
              "SUBESTADO",
              "FOLIO",
              "VINCULACION",
            ]}
          />

          <Loader isLoading={isLoading} />

          {errorMessage && (
            <div data-testid="error-message">{errorMessage}</div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              width: "100%",
              marginTop: "24px",
            }}
          >
            {accountData?.length > 0 && (
              <AccountFdogenCard
                accountData={accountData}
                hiddenFields={[
                  "Valor Último Pago",
                  "Fecha Último Pago",
                  "Periodo Último Pago",
                  "NIT Último Pago",
                  "Cuenta ID",
                  "Tipo Afiliado",
                ]}
              />
            )}
          </div>
        </div>
      </div>

      <AffiliateList
        modalTitle="Resultados de la búsqueda"
        getData={getNameSearchData}
        isModalOpen={isNameSearchModalOpen}
        onCloseModal={onCloseNameSearchModal}
        setSelectedAffiliate={setSelectedAffiliate}
        initialPageSize={10}
      />
    </>
  );
};
