import React from "react";

import { AffiliateConsultResponse100 } from "./AffiliateConsultResponse100";
import { AffiliateConsultResponse2381 } from "./AffiliateConsultResponse2381";
import { AffiliateConsultResponseUserDetail } from "./AffiliateConsultResponseUserDetail";

interface AffiliateConsultResponseViewProps {
  accountData: any;
  pensionAccounts: any;
}

const AffiliateConsultResponseView: React.FC<
  AffiliateConsultResponseViewProps
> = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "32px",
          paddingBottom: "100px",
        }}
      >
        <AffiliateConsultResponseUserDetail />
        <AffiliateConsultResponse2381 />
        <AffiliateConsultResponse100 />
      </div>
    </>
  );
};

export { AffiliateConsultResponseView };
