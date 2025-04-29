import React from "react";
import styles from "./SectionPanel.module.scss";

export const SectionPanel = ({ children }: any) => {
  return <div className={styles.sectionPanel}>{children}</div>;
};
