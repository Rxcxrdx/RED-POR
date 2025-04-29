import React, { useState } from "react";

import { Tabs } from "pendig-fro-transversal-lib-react";
import { TabProps } from "pendig-fro-transversal-lib-react/dist/components/Tabs/Tab/ITab";

import { CustomCard } from "@/components/common";

import { ValidationOperation } from "./ValidationOperation/ValidationOperation";
import AdminValidation from "./AdminValidation/AdminValidation";

import styles from "./validation.module.scss";

export const ValidationView = () => {
  const tabElements = [
    {
      title: "Validaciones por Operación",
      id: "validationOperation",
      component: <ValidationOperation />,
    },
    {
      title: "Administración Validaciones Operación",
      id: "AdminValidation",
      component: <AdminValidation />,
    },
  ];
  const [currentTab, setCurrentTab] = useState(tabElements[0]);

  const tabOptions = tabElements.map<TabProps>((element) => ({
    $badge: undefined,
    $title: element.title,
    id: element.id,
    type: "bordered",
    active: element.id === currentTab.id,
  }));

  const handleTabClick = (tab: TabProps) => {
    const selectedTab = tabElements.find(
      (element) => element.title === tab.$title
    );
    if (selectedTab) {
      setCurrentTab(selectedTab);
    }
  };

  return (
    <CustomCard style={{ padding: "16px" }}>
      <h2 className={styles.validationView__title}>
        Administración validaciones en cuenta
      </h2>
      <Tabs
        className={styles.tabNavigation}
        $type="bordered"
        $activeTab={tabOptions.find((tab) => tab.id === currentTab.id)}
        $tabs={tabOptions}
        $onTabClick={handleTabClick}
      />
      {tabElements.map((element) => (
        <div
          key={element.id}
          style={{
            display: element.id === currentTab.id ? "block" : "none",
            width: "100%",
          }}
        >
          {element.component}
        </div>
      ))}
    </CustomCard>
  );
};
