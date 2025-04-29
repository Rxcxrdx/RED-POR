import { useContext } from "react";
import { useForm } from "react-hook-form";

import { useAffiliateData } from "@/hooks";
import { TransferSuspenseContext } from "@/context";
import { TransferSuspenseAccountView } from "./TransferSuspenseAccountView";

export const TransferSuspenseAccount: React.FC = () => {
  const context = useContext(TransferSuspenseContext);
  const filterFormTransferSuspenseAccount = useForm<any>({
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
  } = useAffiliateData({ form: filterFormTransferSuspenseAccount, context });

  const transferSuspenseAccountViewProps = {
    isLoading,
    accountData,
    errorMessage,
    pensionAccounts,
    affiliateConsultData,
    isNameSearchModalOpen,
    filterFormTransferSuspenseAccount,
    handleFilterReset,
    getNameSearchData,
    handleFilterSubmit,
    setSelectedAffiliate,
    onCloseNameSearchModal,
  };

  return <TransferSuspenseAccountView {...transferSuspenseAccountViewProps} />;
};
