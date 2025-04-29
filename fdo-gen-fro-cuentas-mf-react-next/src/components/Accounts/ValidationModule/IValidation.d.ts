import { ModalConfirmationProps } from "@/components/common/ConfirmationModal/IConfirmationModal";

// TODO: add documentation
export interface IModalValidation extends ModalConfirmationProps {
  /**
   * Modal children content
   */
  children?: React.ReactNode;
  /**
   * information about the validation that has been used in to show the columns in the table
   */
  validationInformation: Array<any>;
  /**
   * an object with all the information of the modal
   */
  modalInformation: any;

  setIsLoading?: (state: boolean) => void;
}
