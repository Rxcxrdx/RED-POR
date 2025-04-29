import React from "react";

import { CustomCard } from "@/components/common";
import { TabsWithLogic } from "@/components/SharedComponent";
import CaseApproval from "./CaseApproval/CaseApproval";
import SeeCases from "./SeeCases/SeeCases";

export const ConsultCases = () => {
  const tabElements = [
    { $title: "Consulta", id: "seeCases", component: <SeeCases /> },
    { $title: "Aprobaciòn", id: "approvalCase", component: <CaseApproval /> },
  ];

  return (
    <CustomCard>
      <h2>Aprobación de casos</h2>
      <TabsWithLogic tabElements={tabElements} />
    </CustomCard>
  );
};
