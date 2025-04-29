import React from "react";
import { UseFormReturn } from "react-hook-form";

import {
  AffiliateList,
  AccountFdogenCard,
  UserDetailContainer,
  AffiliateForm,
} from "@/components/SharedComponent";

import { DepositAccountTransferContext } from "@/context";
import { Loader } from "@/components/common";

interface DepositAccountAffiliateViewProps {
  isLoading: boolean;
  accountData: any[];
  errorMessage?: string;
  pensionAccounts: any[];
  transferConsultData?: any[];
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  filterFormDepositAccountAffiliate: UseFormReturn<any>;
  isNameSearchModalOpen: boolean;
  onCloseNameSearchModal: () => void;
  getNameSearchData: (page: number, pageSize: number) => Promise<any>;
  setSelectedAffiliate: any;
}

export const DepositAccountAffiliateView: React.FC<
  DepositAccountAffiliateViewProps
> = ({
  handleFilterSubmit,
  handleFilterReset,
  isLoading,
  accountData,
  errorMessage,
  filterFormDepositAccountAffiliate,
  isNameSearchModalOpen,
  onCloseNameSearchModal,
  getNameSearchData,
  setSelectedAffiliate,
}) => {
  const userDetailHiddenFields = [
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
  ];

  const accountFdoGenHiddenFields = [
    "Valor Último Pago",
    "Fecha Último Pago",
    "Periodo Último Pago",
    "NIT Último Pago",
    "Cuenta ID",
    "Tipo Afiliado",
  ];
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "start",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <AffiliateForm
          form={filterFormDepositAccountAffiliate}
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
            ContextProvider={DepositAccountTransferContext}
            hiddenFields={userDetailHiddenFields}
          />
          <Loader isLoading={isLoading} />
          {errorMessage && <div>{errorMessage}</div>}
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
                hiddenFields={accountFdoGenHiddenFields}
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
