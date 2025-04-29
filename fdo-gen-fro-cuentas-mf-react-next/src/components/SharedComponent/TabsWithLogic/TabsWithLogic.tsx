import React, { ReactNode, useState } from "react";
import { Tabs } from "pendig-fro-transversal-lib-react";
import { TabProps } from "pendig-fro-transversal-lib-react/dist/components/Tabs/Tab/ITab";

import styles from "./TabsWithLogic.module.scss";

interface TabsWithLogicProps {
  tabElements: { $title: string; id: string; component: ReactNode }[];
}

// TODO: check how to improve this component
export const TabsWithLogic = ({ tabElements }: TabsWithLogicProps) => {
  const [currentTab, setCurrentTab] = useState(tabElements[0]);
  const tabOptions = tabElements.map<TabProps>((element) => ({
    $badge: undefined,
    $title: element.$title,
    id: element.id,
    type: "bordered",
    active: element.id === currentTab.id,
  }));

  const handleTabClick = (tab: TabProps) => {
    const selectedTab = tabElements.find(
      (element) => element.$title === tab.$title
    );
    if (selectedTab) {
      setCurrentTab(selectedTab);
    }
  };

  return (
    <>
      <Tabs
        className={styles.tabNavigation}
        $tabs={tabOptions}
        $type="bordered"
        $onTabClick={handleTabClick}
        $activeTab={tabOptions.find((tab) => tab.id === currentTab.id)}
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
    </>
  );
};
