import React from "react";
import { Dropdown, Button, Checkbox } from "pendig-fro-transversal-lib-react";
import { Controller, UseFormReturn } from "react-hook-form";

interface TransferSuspenseLaggingParametersFormProps {
  handleFilterReset: () => void;
  filterForm: UseFormReturn<any>;
  handleFilterSubmit: () => void;
}

export const TransferSuspenseLaggingParametersForm: React.FC<
  TransferSuspenseLaggingParametersFormProps
> = ({ handleFilterReset, filterForm, handleFilterSubmit }) => {
  
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = filterForm;

  const pagoAdministradoraOptions = [
    { value: "conRendimientos", text: "Con Rendimientos" },
    { value: "conRendimientoIPC", text: "Con rendimiento IPC" },
    { value: "sinRendimientos", text: "Sin rendimientos" },
  ];

  const pagoAseguradoraOptions = [
    { value: "conRendimientos", text: "Con Rendimientos" },
    { value: "sinRendimientos", text: "Sin Rendimientos" },
    { value: "noPagar", text: "No pagar" },
  ];

  return (
    <form onSubmit={handleSubmit(handleFilterSubmit)} autoComplete="off">
      <div
        style={{ padding: "16px 16px 0px 16px", width: "100%", height: "100%" }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <Controller
            name="entidadGiro"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                $title="Entidades de giro"
                $size="small"
                $options={[]}
                placeholder="Selecciona la entidad de giro"
                $Value={field.value}
                onChange={field.onChange}
                $isError={!!error}
              />
            )}
          />

          <Controller
            name="pagoAdministradora"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                $title="Pago Administradora"
                $size="small"
                $options={pagoAdministradoraOptions}
                placeholder="Selecciona tipo de pago"
                $Value={field.value}
                onChange={field.onChange}
                $isError={!!error}
              />
            )}
          />

          <Controller
            name="pagoAseguradora"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                $title="Pago Aseguradora"
                $size="small"
                $options={pagoAseguradoraOptions}
                placeholder="Selecciona tipo de pago"
                $Value={field.value}
                onChange={field.onChange}
                $isError={!!error}
              />
            )}
          />
          <Controller
            name="tipoRezagoBloqueado"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Checkbox
                $type="solid"
                $style="plain"
                $size="default"
                $w="100%"
                id="tipoRezagoBloqueado"
                name={field.name}
                value="bloqueado"
                checked={field.value}
                $handleChange={field.onChange}
                $label="Tipo de Rezago Bloqueado"
                $variant={error ? "invalid" : undefined}
              />
            )}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          padding: "0px 16px 16px 16px",
        }}
      >
        <Button type="submit" color="primary" $size="small">
          Aplicar Filtros
        </Button>
        <Button
          type="button"
          onClick={handleFilterReset}
          color="primary"
          $size="small"
        >
          Limpiar Filtros
        </Button>
      </div>
    </form>
  );
};

export default TransferSuspenseLaggingParametersForm;
