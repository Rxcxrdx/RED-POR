import React, { PropsWithChildren } from "react";

import styles from "./TextWithDivider.module.scss";

export const TextWithDivider = ({
  children,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className={styles.TextWithDividerContainer} {...props}>
      <p className={styles.TextWithDividerContainer__text}>{children}</p>
      <div className={styles.TextWithDividerContainer__divider}></div>
    </div>
  );
};
