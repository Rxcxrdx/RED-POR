import React, { useContext } from "react";
import { Tabs } from "pendig-fro-transversal-lib-react";
import { TabProps } from "pendig-fro-transversal-lib-react/dist/components/Tabs/Tab/ITab";

import { CustomCard } from "@/components/common";
import {
  DepositAccountTransferContext,
  DepositAccountTransferContextProvider,
} from "@/context";

import {
  DepositAccountAffiliate,
  DepositAccountContribution,
  DepositAccountValidation,
  DepositAccountContributionDetail,
  DepositAccountApprovalCase,
} from "../index";

export const DepositAccountTransferContent: React.FC = () => {
  const { currentTab, setCurrentTab } = useContext(
    DepositAccountTransferContext
  );

  const tabElements = [
    {
      title: "Consulta Afiliado",
      id: "affiliate",
      component: <DepositAccountAffiliate />,
    },
    {
      title: "Consulta Aportes",
      id: "contribution",
      component: <DepositAccountContribution />,
    },
    {
      title: "Detalles de Aportes",
      id: "contributionDetail",
      component: <DepositAccountContributionDetail />,
    },
    {
      title: "Validaciones",
      id: "validation",
      component: <DepositAccountValidation />,
    },
    {
      title: "Aplicación caso",
      id: "approvalCase",
      component: <DepositAccountApprovalCase />,
    },
  ];

  const tabOptions = tabElements.map<TabProps>((element) => ({
    $badge: undefined,
    $title: element.title,
    id: element.id,
    type: "bordered",
    active: element.id === currentTab,
  }));

  const handleTabClick = (tab: TabProps) => {
    const selectedTab = tabElements.find(
      (element) => element.title === tab.$title
    );
    if (selectedTab) {
      setCurrentTab(selectedTab.id);
    }
  };

  return (
    <CustomCard>
      <h2>Transferencia cuenta a deposito</h2>
      <Tabs
        $type="bordered"
        $activeTab={tabOptions.find((tab) => tab.id === currentTab)}
        $tabs={tabOptions}
        $onTabClick={handleTabClick}
      />
      {tabElements.map((element) => (
        <div
          key={element.id}
          style={{
            display: element.id === currentTab ? "block" : "none",
          }}
        >
          {element.component}
        </div>
      ))}
    </CustomCard>
  );
};

export const DepositAccountTransferView: React.FC = () => {
  return (
    <DepositAccountTransferContextProvider>
      <DepositAccountTransferContent />
    </DepositAccountTransferContextProvider>
  );
};
