import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button, Dropdown, Toast } from "pendig-fro-transversal-lib-react";

import { BoxMessage, Loader } from "@/components/common";
import {
  postAssociateValidationOperationService,
  postSearchValidationsService,
} from "@/services";

import {
  IValidationCatalog,
  IValidationElement,
} from "../AdminValidation/IAdminValidation";

import styles from "./ValidationOperation.module.scss";

const AssociateValidation = ({ operationType }: { operationType: any }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({});

  const [validationCatalog, setValidationCatalog] = useState<
    IValidationCatalog[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchValidations = async () => {
    setIsLoading(true);
    try {
      const response = await postSearchValidationsService({
        validacionId: null,
        page: { page: 0, size: 30 },
      });
      const {
        listValidacion: validations,
      }: { listValidacion: IValidationElement[] } = response?.data;

      if (validations.length > 0) {
        setValidationCatalog(
          validations.map((element) => ({
            text: element.nombre,
            value: `${element.validacionId}`,
          }))
        );
      }
      setErrorMessage(
        validations.length > 0 ? "" : "Sin validaciones para mostrar"
      );
    } catch (error) {
      setErrorMessage("Error al consultar validaciones.");
      setValidationCatalog([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await postAssociateValidationOperationService({
        codigoOperacionId: operationType?.value,
        validacionId: data.validation?.value,
        usuarioCreacion: "test",
      });
      if (response?.status?.statusCode === 200) {
        Toast.showStatusCode(200);
      } else if (response?.status?.statusCode === 206) {
        Toast.showStatusCode(206);
      }
    } catch (error) {
      Toast.showStatusCode(400);
      console.error(error);
      setErrorMessage("Ha ocurrido un error al asociar la validación");
    } finally {
      reset();
      setIsLoading(false);
    }
  });

  useEffect(() => {
    setErrorMessage(
      "Debe seleccionar una operación para realizar la asociación"
    );
    Toast.init();
  }, []);

  useEffect(() => {
    operationType !== undefined && fetchValidations();
  }, [operationType]);

  return (
    <>
      <Loader isLoading={isLoading} />
      {errorMessage && (
        <BoxMessage errorMessage={errorMessage} style={{ width: "initial" }} />
      )}
      {operationType !== undefined && (
        <form
          className={styles.associateValidation__filterFormContainer}
          onSubmit={onSubmit}
        >
          <Controller
            name="validation"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Dropdown
                $w="max-content"
                name="validations"
                $title="Validación"
                placeholder="Seleccione validación"
                $options={validationCatalog}
                $Value={field?.value?.text}
                onChange={(item) =>
                  setValue("validation", {
                    text: item.target.textContent,
                    value: item.target.value,
                  })
                }
              />
            )}
          />
          <Button
            type="submit"
            $color="primary"
            disabled={watch("validation") === undefined}
          >
            Asociar
          </Button>
        </form>
      )}
    </>
  );
};

export default AssociateValidation;
