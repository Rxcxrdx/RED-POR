import React, { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Input,
  Dropdown,
  Button,
  SingleDatePicker,
} from "pendig-fro-transversal-lib-react";
import { ISuspense } from "../ISuspenseConsultForm";

interface SuspenseConsultFilterFormProps {
  suspenseData: ISuspense[];
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onReset: () => void;
  handleDownloadSuspenses: () => void;
  setErrorMessage: (message: string) => void;
  setsuspenseData: (data: ISuspense[]) => void;
}

const optionsTipoIdDetalle = [
  { value: "CC", text: "CC" },
  { value: "CE", text: "CE" },
  { value: "TI", text: "TI" },
  { value: "PAS", text: "PAS" },
  { value: "REG", text: "REG" },
  { value: "CD", text: "CD" },
  { value: "IE", text: "IE" },
  { value: "PE", text: "PE" },
  { value: "SC", text: "SC" },
  { value: "PT", text: "PT" },
];

const optionsTipoIdEmpleador = [
  { value: "NIT", text: "NIT" },
  { value: "CE", text: "CE" },
  { value: "TI", text: "TI" },
  { value: "PAS", text: "PAS" },
  { value: "REG", text: "REG" },
  { value: "CC", text: "CC" },
  { value: "CD", text: "CD" },
  { value: "IE", text: "IE" },
  { value: "PE", text: "PE" },
  { value: "SC", text: "SC" },
  { value: "PT", text: "PT" },
];

const estadoRezago = [
  { value: "T", text: "Todos" },
  { value: "S", text: "Levantados" },
  { value: "N", text: "No levantados" },
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

const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInYears =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return diffInYears <= 1;
};

export const SuspenseConsultFilterForm: React.FC<
  SuspenseConsultFilterFormProps
> = ({
  suspenseData,
  setsuspenseData,
  form,
  onSubmit,
  onReset,
  handleDownloadSuspenses,
  setErrorMessage,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = form;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    form.setValue("tipoIdentificacion", "CC");
    form.setValue("tipoIdEmpleador", "NIT");
    form.setValue("estadoRezago", "T");
  }, [form]);

  const fields = {
    tipoIdentificacion: watch("tipoIdentificacion"),
    numeroIdentificacion: watch("numeroIdentificacion"),
    tipoIdEmpleador: watch("tipoIdEmpleador"),
    numeroIdEmpleador: watch("numeroIdEmpleador"),
    numeroCuenta: watch("numeroCuenta"),
    periodoPago: watch("periodoPago"),
    periodoPagoFin: watch("periodoPagoFin"),
    folioRezago: watch("folioRezago"),
    primerNombre: watch("primerNombre"),
    segundoNombre: watch("segundoNombre"),
    primerApellido: watch("primerApellido"),
    segundoApellido: watch("segundoApellido"),
    numeroPlanilla: watch("numeroPlanilla"),
    estadoRezago: watch("estadoRezago"),
    fechaPagoInicial: watch("fechaPagoInicial"),
    fechaPagoFinal: watch("fechaPagoFinal"),
  };

  const validations = {
    isValidCombination:
      (fields.tipoIdentificacion &&
        fields.tipoIdEmpleador &&
        fields.numeroIdentificacion &&
        fields.numeroIdEmpleador) ||
      (fields.tipoIdentificacion &&
        fields.tipoIdEmpleador &&
        fields.numeroIdentificacion &&
        !fields.numeroIdEmpleador) ||
      (fields.tipoIdentificacion &&
        fields.tipoIdEmpleador &&
        !fields.numeroIdentificacion &&
        fields.numeroIdEmpleador) ||
      (fields.tipoIdentificacion &&
        fields.numeroIdentificacion &&
        validateDateRange(fields.fechaPagoInicial, fields.fechaPagoFinal)) ||
      (fields.tipoIdEmpleador &&
        fields.numeroIdEmpleador &&
        validateDateRange(fields.fechaPagoInicial, fields.fechaPagoFinal)) ||
      (fields.primerNombre && fields.primerApellido) ||
      fields.numeroPlanilla ||
      fields.folioRezago,
    isInvalidCombination:
      (!fields.primerNombre && fields.primerApellido) ||
      (fields.primerNombre && !fields.primerApellido),
  };

  const checkFields = async () => {
    setIsButtonEnabled(
      validations.isValidCombination &&
        !validations.isInvalidCombination == true
        ? true
        : false
    );
  };

  useEffect(() => {
    checkFields();
  }, [
    fields.tipoIdentificacion,
    fields.numeroIdentificacion,
    fields.tipoIdEmpleador,
    fields.numeroIdEmpleador,
    fields.primerNombre,
    fields.primerApellido,
    fields.periodoPago,
    fields.estadoRezago,
    fields.folioRezago,
    fields.numeroPlanilla,
    fields.fechaPagoInicial,
    fields.fechaPagoFinal,
    trigger,
  ]);

  useEffect(() => {
    if (isButtonEnabled) {
      setErrorMessage("Realiza la consulta con los filtros seleccionados");
      setsuspenseData([]);
    } else {
      setErrorMessage(
        "No se han seleccionado filtros completos para realizar la consulta."
      );
    }
  }, [isButtonEnabled]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="suspense-filter-form"
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
              name="tipoIdentificacion"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  $title="Tipo id detalle"
                  $size="small"
                  $options={optionsTipoIdDetalle}
                  placeholder="Seleccionar tipo de identificación"
                  $Value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  data-testid="tipo-identificacion-select"
                  role="combobox"
                  maxLength={5}
                  type="text"
                />
              )}
            />

            <Controller
              name="numeroIdentificacion"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && !fields.tipoIdentificacion) {
                    return "Debe seleccionar el tipo de identificación";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  $title="Identificación"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa el número de identificación"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="numeroIdentificacion"
                  data-testid="numero-identificacion-input"
                  type="number"
                  maxLength={19}
                />
              )}
            />

            <Controller
              name="tipoIdEmpleador"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  $title="Tipo empleador"
                  $size="small"
                  $options={optionsTipoIdEmpleador}
                  placeholder="Seleccionar tipo empleador"
                  $Value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  data-testid="tipo-empleador-select"
                  maxLength={5}
                  type="text"
                />
              )}
            />

            <Controller
              name="numeroIdEmpleador"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && !fields.tipoIdEmpleador) {
                    return "Debe seleccionar el tipo de empleador";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  $title="Id empleador"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa la identificación del empleador"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="numeroIdEmpleador"
                  data-testid="numero-identificacion-empleador-input"
                  type="number"
                  maxLength={19}
                />
              )}
            />

            <Controller
              name="primerApellido"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && !fields.primerNombre) {
                    return "El primer nombre es requerido";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  type="text"
                  $title="Primer apellido*"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa primer apellido"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="primerApellido"
                  maxLength={19}
                />
              )}
            />

            <Controller
              name="segundoApellido"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  type="text"
                  $title="Segundo apellido"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa segundo apellido"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  maxLength={19}
                />
              )}
            />

            <Controller
              name="primerNombre"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && !fields.primerApellido) {
                    return "El primer apellido es requerido";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  type="text"
                  $title="Primer nombre*"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa primer nombre"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  maxLength={19}
                />
              )}
            />

            <Controller
              name="segundoNombre"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  type="text"
                  $title="Segundo nombre"
                  $size="small"
                  $w="100%"
                  placeholder="Ingresa segundo nombre"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  name="segundoNombre"
                  maxLength={19}
                />
              )}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", width: "100%" }}>
          <Controller
            name="periodoPago"
            control={control}
            rules={{
              validate: {
                format: (value) => {
                  if (!value) return true;
                  return (
                    validatePeriodFormat(value) || "El formato debe ser AAAA-MM"
                  );
                },
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                $w="100%"
                $title="Periodo de pago"
                $size="small"
                placeholder="AAAA-MM"
                value={field.value}
                onChange={(e) => {
                  const formattedValue = formatPeriod(e.target.value);
                  field.onChange(formattedValue);
                  trigger();
                }}
                $isError={!!error}
                $errorMessage={error?.message}
                $helpText={error?.message}
                maxLength={7}
                data-testid="periodo-pago-input"
                type="number"
              />
            )}
          />
          <div style={{ width: "100%" }}>
            <Controller
              name="fechaPagoInicial"
              control={control}
              rules={{
                validate: (value) => {
                  if (!validateDateRange(value, fields.fechaPagoFinal)) {
                    return "La diferencia entre las fechas no debe superar un año.";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <SingleDatePicker
                  $title="Fecha de pago inicial"
                  $size="small"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  maxLength={10}
                  $dateFormatResponse="dd-mm-yyyy"
                />
              )}
            />
          </div>
          <div style={{ width: "100%" }}>
            <Controller
              name="fechaPagoFinal"
              control={control}
              rules={{
                validate: (value) => {
                  if (!validateDateRange(fields.fechaPagoInicial, value)) {
                    return "La diferencia entre las fechas no debe superar un año.";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <SingleDatePicker
                  $title="Fecha de pago final"
                  value={field.value}
                  $size="small"
                  onChange={(e) => {
                    field.onChange(e);
                    trigger();
                  }}
                  $isError={!!error}
                  $errorMessage={error?.message}
                  $helpText={error?.message}
                  $dateFormatResponse="dd-mm-yyyy"
                  maxLength={10}
                />
              )}
            />
          </div>

          <Controller
            name="estadoRezago"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                $title="Estado de rezago"
                $size="small"
                $options={estadoRezago}
                placeholder="Selecciona el estado del rezago"
                $Value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  trigger();
                }}
                $isError={!!error}
                $errorMessage={error?.message}
                $helpText={error?.message}
                data-testid="estado-rezago-select"
                maxLength={19}
              />
            )}
          />

          <Controller
            name="folioRezago"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                type="number"
                $title="Folio rezago"
                $size="small"
                $w="100%"
                placeholder="Ingresa el folio del rezago"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  trigger();
                }}
                $isError={!!error}
                $errorMessage={error?.message}
                $helpText={error?.message}
                maxLength={19}
              />
            )}
          />

          <Controller
            name="numeroPlanilla"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                type="number"
                $title="Número de planilla"
                $size="small"
                $w="100%"
                placeholder="Ingresa el número de la planilla"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  trigger();
                }}
                $isError={!!error}
                $errorMessage={error?.message}
                $helpText={error?.message}
                maxLength={19}
              />
            )}
          />
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
          {suspenseData.length > 0 && isButtonEnabled ? (
            <>
              <Button
                onClick={handleDownloadSuspenses}
                $color="primary"
                $size="small"
                data-testid="csv-download-contributions"
                disabled={!isButtonEnabled}
              >
                Descargar rezagos
              </Button>
            </>
          ) : (
            <></>
          )}
          <Button
            type="submit"
            color="primary"
            $size="small"
            disabled={!isButtonEnabled}
          >
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
