import React from "react";

import { Loader } from "@/components/common";
import { AffiliateForm, AffiliateList } from "@/components/SharedComponent";
import {
  IFormattedAccount,
  IFormattedAffiliate,
  IFormattedPensionAccount,
} from "@/hooks/useAffiliateData/IuseAffiliateData";

interface AffiliateConsultViewProps {
  handleFilterSubmit: (values: any) => void;
  handleFilterReset: () => void;
  isLoading: boolean;
  accountData: IFormattedAccount[];
  errorMessage?: string;
  pensionAccounts: IFormattedPensionAccount[];
  affiliateConsultData?: IFormattedAffiliate[];
  filterFormAffiliateConsult: any;
  isNameSearchModalOpen: boolean;
  onCloseNameSearchModal: () => void;
  getNameSearchData: (page: number, pageSize: number) => Promise<any>;
  setSelectedAffiliate: any;
}

const AffiliateConsultViewForm: React.FC<AffiliateConsultViewProps> = ({
  handleFilterReset,
  getNameSearchData,
  handleFilterSubmit,
  onCloseNameSearchModal,
  isLoading,
  setSelectedAffiliate,
  isNameSearchModalOpen,
  filterFormAffiliateConsult,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "24px 0px 0px 0px",
        }}
      >
        <AffiliateForm
          form={filterFormAffiliateConsult}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
          config={{
            showAccountNumber: true,
            showIdentification: true,
            showName: true,
          }}
          isArrears={false}
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
          <Loader isLoading={isLoading} />
        </div>
      </div>
      <AffiliateList
        modalTitle="Resultados de la búsqueda"
        getData={getNameSearchData}
        isModalOpen={isNameSearchModalOpen}
        onCloseModal={onCloseNameSearchModal}
        initialPageSize={10}
        setSelectedAffiliate={setSelectedAffiliate}
      />
    </>
  );
};

export { AffiliateConsultViewForm };
