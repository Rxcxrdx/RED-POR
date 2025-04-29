import React from "react";
import { Button, Dropdown, Input } from "pendig-fro-transversal-lib-react";
import { Controller, UseFormReturn } from "react-hook-form";

import {
  causalTypeOptions,
  relatedWithOptions,
  requirementTypeOptions,
} from "@/common/constants";

interface CaseApplicationFormProps {
  filterForm: UseFormReturn<any>;
}

export const CaseApplicationForm: React.FC<CaseApplicationFormProps> = ({
  filterForm,
}) => {
  const { control } = filterForm;

  return (
    <>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "16px",
        }}
      >
        <Controller
          name="tipoRequerimiento"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $title="Tipo de Requerimiento"
              $size="small"
              $options={requirementTypeOptions}
              placeholder="Seleccione el tipo de requerimiento"
              $Value={field.value}
              onChange={field.onChange}
              $isError={!!error}
            />
          )}
        />

        <Controller
          name="tipoCausal"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $title="Tipo de causal"
              $size="small"
              $options={causalTypeOptions}
              placeholder="Seleccione el tipo de causal"
              $Value={field.value}
              onChange={field.onChange}
              $isError={!!error}
            />
          )}
        />
      </div>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "16px",
        }}
      >
        <Controller
          name="relacionadoCon"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $title="Relacionado con"
              $size="small"
              $options={relatedWithOptions}
              placeholder="Seleccione relación"
              $Value={field.value}
              onChange={field.onChange}
              $isError={!!error}
            />
          )}
        />
        <Controller
          name="documentoSoporte"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              $w="100%"
              $title="Documento soporte *"
              $size="small"
              placeholder="Ingrese el documento soporte"
              value={field.value}
              onChange={field.onChange}
              $isError={!!error}
              required
            />
          )}
        />
      </div>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "16px",
        }}
      >
        <Controller
          name="observacion"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              $w="100%"
              $title="Observación *"
              $size="small"
              placeholder="Ingrese la observación"
              value={field.value}
              onChange={field.onChange}
              $isError={!!error}
              required
            />
          )}
        />
      </div>
    </>
  );
};
