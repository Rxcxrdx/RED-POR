import { useContext } from "react";

import { AffiliateAccountContext } from "@/context";
import { AffiliateConsultResponseView } from "./AffiliateConsultResponseView";

export const AffiliateConsultResponse: React.FC = () => {
  const { pensionAccounts, accountData } = useContext(AffiliateAccountContext);

  const affiliateConsultViewProps = {
    accountData,
    pensionAccounts,
  };

  return <AffiliateConsultResponseView {...affiliateConsultViewProps} />;
};
