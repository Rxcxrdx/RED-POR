import React, { ReactNode } from "react";
import { Enfasis } from "pendig-fro-transversal-lib-react";

import styles from "./Databox.module.scss";

interface IDataBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string | number | ReactNode;
}

export const DataBox: React.FC<IDataBoxProps> = ({ label, value }) => {
  return (
    <div className={styles.DataBoxContainer}>
      <Enfasis className={styles.fontTitle} fontWeight={700}>
        {label}
      </Enfasis>
      <Enfasis className={styles.fontText}>{value || "-"}</Enfasis>
    </div>
  );
};
