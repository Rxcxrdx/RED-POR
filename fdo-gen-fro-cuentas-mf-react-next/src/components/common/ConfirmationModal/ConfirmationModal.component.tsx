import React from "react";
import { Button, Modal } from "pendig-fro-transversal-lib-react";

import { ModalConfirmationProps } from "./IConfirmationModal";

import styles from "./ConfirmationModal.module.scss";

export const ConfirmationModal = ({
  children,
  $title,
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  ...props
}: ModalConfirmationProps) => {
  return (
    <Modal
      {...props}
      className={`${styles.confirmationModal} ${props.className}`}
      $w={props.$w ? `${props.$w}` : "70%"}
    >
      {$title && <h1>{$title}</h1>}
      {children}
      <div className={styles.buttonsContainer}>
        {secondaryLabel && (
          <Button $color="secondary" onClick={onSecondaryAction}>
            {secondaryLabel}
          </Button>
        )}
        {primaryLabel && (
          <Button $color="primary" onClick={onPrimaryAction}>
            {primaryLabel}
          </Button>
        )}
      </div>
    </Modal>
  );
};
