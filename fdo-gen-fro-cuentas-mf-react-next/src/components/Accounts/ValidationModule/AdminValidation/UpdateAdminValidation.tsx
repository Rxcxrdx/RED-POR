import React, { useEffect, useState } from "react";
import { Input, TextArea, Toast } from "pendig-fro-transversal-lib-react";

import { DataBox, ConfirmationModal } from "@/components/common";
import { setStateValue } from "@/common/utils";
import { updateValidationService } from "@/services";

import { IModalValidation } from "../IValidation";

import styles from "../validation.module.scss";

const UpdateAdminValidation = ({
  validationInformation,
  modalInformation,
  onClose = () => {},
  onSecondaryAction,
  setIsLoading = () => {},
  ...props
}: IModalValidation) => {
  const [modalInformationState, setModalInformationState] =
    useState(modalInformation);

  const resetModalInformation = () => {
    setModalInformationState(modalInformation);
    onClose();
    onSecondaryAction !== undefined && onSecondaryAction();
  };

  const onUpdateValidation = async () => {
    setIsLoading(true);
    const { usuarioUltimaModificacion, descripcion, nombre, validacionId } =
      modalInformationState;

    try {
      const response = await updateValidationService({
        descripcion,
        nombre,
        usuarioUltimaModificacion,
        validacionId,
      });
      if (response?.status?.statusCode === 200) {
        Toast.showStatusCode(response?.status?.statusCode);
        onClose();
      }
    } catch (error: any) {
      Toast.showStatusCode(error?.status);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setModalInformationState(modalInformation);
  }, [modalInformation]);

  return (
    <ConfirmationModal
      {...props}
      className={styles.modalValidation}
      $title="Edición de validación"
      primaryLabel="Actualizar"
      secondaryLabel="Cancelar"
      onClose={resetModalInformation}
      onSecondaryAction={resetModalInformation}
      onPrimaryAction={onUpdateValidation}
    >
      <div className={styles.validationInfoContainer}>
        {validationInformation
          ?.filter((element) => element.$header !== "Actualizar")
          .map((element) => (
            <DataBox
              key={element.$key}
              label={element.$header}
              value={modalInformation[element.$key]}
            />
          ))}
      </div>

      <Input
        $size="large"
        $title="Validación"
        value={modalInformationState.nombre}
        onChange={(el) => setStateValue(el, setModalInformationState, "nombre")}
        onFocus={() => {}}
        required
        type="text"
      />

      <TextArea
        $state="default"
        $variant="bordered"
        $w="100%"
        $m="25px 0"
        $title="Descripción de Validación"
        placeholder="Escribe aquí..."
        value={modalInformationState.descripcion}
        onChange={(el) =>
          setStateValue(el, setModalInformationState, "descripcion")
        }
      />
    </ConfirmationModal>
  );
};

export default UpdateAdminValidation;
