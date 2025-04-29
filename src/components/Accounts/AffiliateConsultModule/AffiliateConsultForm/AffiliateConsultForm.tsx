import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAffiliateData } from "@/hooks";
import { AffiliateAccountContext } from "@/context";
import { AffiliateConsultViewForm } from "./AffiliateConsultViewForm";

export const AffiliateConsultForm: React.FC = () => {
  const context = useContext(AffiliateAccountContext);

  const { setCurrentTab, userDetail } = context;
  const filterFormAffiliateConsult = useForm<any>({
    defaultValues: {
      numeroCuenta: "",
      numeroIdentificacion: "",
      tipoIdentificacion: null,
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
    },
    mode: "onChange",
  });

  const {
    isLoading,
    accountData,
    errorMessage,
    pensionAccounts,
    affiliateConsultData,
    isNameSearchModalOpen,
    getNameSearchData,
    handleFilterReset,
    handleFilterSubmit,
    setSelectedAffiliate,
    onCloseNameSearchModal,
  } = useAffiliateData({ form: filterFormAffiliateConsult, context });

  useEffect(() => {
    if (userDetail && !isLoading && !errorMessage && !isNameSearchModalOpen) {
      const timer = setTimeout(() => {
        setCurrentTab("affiliateResponse");
      }, 100000);

      return () => clearTimeout(timer);
    }
  }, [
    isLoading,
    userDetail,
    errorMessage,
    isNameSearchModalOpen,
    setCurrentTab,
  ]);

  const affiliateConsultViewProps = {
    isLoading,
    accountData,
    errorMessage,
    pensionAccounts,
    affiliateConsultData,
    isNameSearchModalOpen,
    filterFormAffiliateConsult,
    handleFilterReset,
    getNameSearchData,
    handleFilterSubmit,
    setSelectedAffiliate,
    onCloseNameSearchModal,
  };

  return <AffiliateConsultViewForm {...affiliateConsultViewProps} />;
};
