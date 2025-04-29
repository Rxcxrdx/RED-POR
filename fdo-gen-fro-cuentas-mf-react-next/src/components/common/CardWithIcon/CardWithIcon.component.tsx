import React from "react";
import { Icon, IconName } from "pendig-fro-transversal-lib-react";

import styles from "./CardWithIcon.module.scss";

interface CardWithIconProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  icon: IconName;
}

export const CardWithIcon = ({ label, value, icon }: CardWithIconProps) => {
  return (
    <div className={styles.CardWithIconContainer}>
      <div>
        <p className={styles.CardWithIconContainer__label}>{label}</p>
        <p className={styles.CardWithIconContainer__value}>{value}</p>
      </div>
      <div className={styles.iconContainer}>
        <Icon
          className={styles.iconContainer__icon}
          $name={icon}
          title={icon}
          $w="100%"
          $h="100%"
        />
      </div>
    </div>
  );
};
