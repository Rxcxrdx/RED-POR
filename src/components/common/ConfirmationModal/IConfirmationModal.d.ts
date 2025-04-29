import { ModalProps } from "pendig-fro-transversal-lib-react/dist/components/Modal/IModal";

export interface ModalConfirmationProps extends ModalProps {
  /**
   * @description title of the modal
   */
  $title?: string;
  /**
   * @description function that executes when user clicks on primary button
   */
  onPrimaryAction?: () => void;
  /**
   * @description function that executes when user clicks on secondary button
   */
  onSecondaryAction?: () => void;
  /**
   * @description label that will be show when on primary button
   */
  primaryLabel?: string;
  /**
   * @description label that will be show when on secondary button
   */
  secondaryLabel?: string;
}
