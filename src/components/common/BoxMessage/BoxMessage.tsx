import React, { PropsWithChildren } from "react";
import {
  Icon,
  IconName,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS } from "@/common/constants";

import styles from "./BoxMessage.module.scss";

interface IBoxMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  errorMessage?: string;
  icon?: IconName;
}

export const BoxMessage = ({
  title,
  children,
  errorMessage = COMMON_LABELS.NO_INFORMATION,
  icon = "fileDownloadSearch",
  ...props
}: PropsWithChildren<IBoxMessageProps>) => {
  return (
    <div className={styles.BoxMessage} {...props}>
      <Icon
        className={styles.BoxMessage__icon}
        $name={icon}
        title={icon}
        $w="36px"
        $h="40px"
      />
      <div>
        {title && <p className={styles.BoxMessage__title}>{title}</p>}
        {errorMessage && (
          <ParagraphNormal
            className={styles.BoxMessage__message}
            fontWeight={400}
          >
            {errorMessage}
          </ParagraphNormal>
        )}
        {children && <>{children}</>}
      </div>
    </div>
  );
};
