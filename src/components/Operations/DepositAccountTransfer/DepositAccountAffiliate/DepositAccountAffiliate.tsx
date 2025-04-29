import { useContext } from "react";
import { useForm } from "react-hook-form";

import { useAffiliateData } from "@/hooks";
import { DepositAccountTransferContext } from "@/context";
import { DepositAccountAffiliateView } from "./DepositAccountAffiliateView";

export const DepositAccountAffiliate: React.FC = () => {
  const context = useContext(DepositAccountTransferContext);

  const filterFormDepositAccountAffiliate = useForm<any>({
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
  } = useAffiliateData({ form: filterFormDepositAccountAffiliate, context });

  const transferSuspenseAccountViewProps = {
    isLoading,
    accountData,
    errorMessage,
    pensionAccounts,
    affiliateConsultData,
    isNameSearchModalOpen,
    filterFormDepositAccountAffiliate,
    handleFilterReset,
    getNameSearchData,
    handleFilterSubmit,
    setSelectedAffiliate,
    onCloseNameSearchModal,
  };

  return <DepositAccountAffiliateView {...transferSuspenseAccountViewProps} />;
};
