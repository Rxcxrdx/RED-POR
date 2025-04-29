import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Toast } from "pendig-fro-transversal-lib-react";

import { Loader } from "@/components/common";
import { createValidationService } from "@/services";

import styles from "./adminValidation.module.scss";

export const CreateValidationForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { handleSubmit, control } = useForm({
    defaultValues: { validationName: "", validationDescription: "" },
  });

  const onCreateValidation = handleSubmit(async (data) => {
    setIsLoading(true);
    const { validationDescription, validationName } = data;
    try {
      const response = await createValidationService({
        nombre: validationName,
        descripcion: validationDescription,
        usuarioCreacion: "test",
      });
      Toast.showStatusCode(response.status?.statusCode || 400);
    } catch (error: any) {
      Toast.showStatusCode(error?.status);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Loader isLoading={isLoading} />
      <form
        className={styles.creationFormContainer}
        onSubmit={onCreateValidation}
      >
        <Controller
          name="validationName"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <Input
              name="validationName"
              type="text"
              $title="Nombre de Validación"
              required
              value={field.value}
              onChange={field.onChange}
              $isError={!!error}
              $size="large"
              $w="40%"
            />
          )}
        />

        <Controller
          name="validationDescription"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <Input
              name="validationDescription"
              type="text"
              $title="Descripción de Validación"
              required
              value={field.value}
              onChange={field.onChange}
              $isError={!!error}
              $size="large"
              $w="40%"
            />
          )}
        />

        <Button type="submit" $color="primary" onClick={onCreateValidation}>
          Crear
        </Button>
      </form>
    </>
  );
};
