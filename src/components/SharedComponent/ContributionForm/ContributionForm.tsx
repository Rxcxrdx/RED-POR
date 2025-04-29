import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input, Dropdown, Button } from "pendig-fro-transversal-lib-react";

interface ContributionFilterFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onReset: () => void;
}

const tipoMovimientoOptions = [
  { value: "All", text: "Todos" },
  { value: "VOL", text: "Voluntarios" },
];

const tipoConceptoOptions = [
  { value: "All", text: "Todos" },
  { value: "S", text: "Si" },
  { value: "N", text: "No" },
];

const validatePeriodFormat = (value: string): boolean => {
  if (!value) return true;
  const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return periodRegex.test(value);
};

const formatPeriod = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 6) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
  }
  return cleaned;
};

export const ContributionForm: React.FC<ContributionFilterFormProps> = ({
  form,
  onSubmit,
  onReset,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const periodoPago = watch("periodoPago");
  const periodoPagoFin = watch("periodoPagoFin");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="contribution-filter-form"
      autoComplete="on"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          padding: "16px 16px 16px 16px",
          height: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: "16px",
          boxShadow:
            "0px 4px 8px 0px rgba(41, 41, 41, 0.10), 0px 2px 4px 0px rgba(41, 41, 41, 0.11), 0px 0px 2px 0px rgba(41, 41, 41, 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <Controller
              name="periodoPago"
              control={control}
              rules={{
                validate: {
                  format: (value) => {
                    if (!value) return true;
                    return (
                      validatePeriodFormat(value) ||
                      "Los parámetros de consulta no generan información"
                    );
                  },
                  crossValidation: (value) => {
                    if (!value && periodoPagoFin) {
                      return "Los parámetros de consulta no generan información";
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  $w="100%"
                  $title="Periodo inicial"
                  $size="small"
                  placeholder="AAAA-MM"
                  value={field.value || ""}
                  onChange={(e) => {
                    const formattedValue = formatPeriod(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="periodoPago"
                  maxLength={7}
                  data-testid="periodo-pago-input"
                  type="number"
                />
              )}
            />

            <Controller
              name="periodoPagoFin"
              control={control}
              rules={{
                validate: {
                  format: (value) => {
                    if (!value) return true;
                    return (
                      validatePeriodFormat(value) ||
                      "Los parámetros de consulta no generan información"
                    );
                  },
                  periodComparison: (value) => {
                    if (value && periodoPago) {
                      const inicio = periodoPago.replace("-", "");
                      const fin = value.replace("-", "");
                      return (
                        parseInt(inicio) <= parseInt(fin) ||
                        "El periodo final debe ser mayor al inicial"
                      );
                    }
                    return true;
                  },
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  $w="100%"
                  $title="Periodo final"
                  $size="small"
                  placeholder="AAAA-MM"
                  value={field.value || ""}
                  onChange={(e) => {
                    const formattedValue = formatPeriod(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="periodoPagoFin"
                  maxLength={7}
                  data-testid="periodo-pago-fin-input"
                  type="number"
                />
              )}
            />

            <Controller
              name="idDisponible"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  $title="Disponibilidad"
                  $size="small"
                  $options={tipoConceptoOptions}
                  placeholder="Selecciona la disponibilidad"
                  $Value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  data-testid="disponibilidad-select"
                />
              )}
            />

            <Controller
              name="tipoMovimiento"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  $title="Tipo de Movimiento"
                  $size="small"
                  $options={tipoMovimientoOptions}
                  placeholder="Selecciona tipo de movimiento"
                  $Value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  data-testid="tipo-movimiento-select"
                />
              )}
            />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "16px",
            marginTop: "16px",
            justifyContent: "flex-end",
          }}
        >
          <Button type="submit" color="primary" $size="small">
            Consultar
          </Button>
          <Button type="button" onClick={onReset} color="primary" $size="small">
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </form>
  );
};
