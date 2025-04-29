import React from "react";
import { Button, Group, TextInput, Select } from "@mantine/core";
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { PRIMARY_COLOR } from "@/common/constants";
import { IContributionFilterFormProps } from "../IContribution";

dayjs.extend(customParseFormat);

const formatPeriod = (value: any) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 6) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
  }
  return cleaned;
};

const validatePeriodFormat = (value: string) => {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(value)) {
    return "Formato inválido. Use AAAA-MM";
  }

  const month = parseInt(value.split("-")[1]);
  if (month < 1 || month > 12) {
    return "Mes inválido. Debe estar entre 01 y 12";
  }

  return null;
};

const ContributionFilterForm: React.FC<IContributionFilterFormProps> = ({
  cuentaId,
  contributionData,
  filterFormContribution,
  handleFilterSubmit,
  handleFilterReset,
  handleDownloadContributions,
  handleDownloadTotalContributions,
  totalDetailsData = { aporte: [] },
}) => {

  debugger;

  const tipoMovimientoOptions = [
    { value: "All", label: "Todos" },
    { value: "VOL", label: "Voluntarios" },
  ];

  const tipoConceptoOptions = [
    { value: "All", label: "Todos" },
    { value: "S", label: "Si" },
    { value: "N", label: "No" },
  ];

  const handlePeriodoInicialChange = (event: any) => {
    const value = event.currentTarget.value;
    const formattedValue = formatPeriod(value);
    filterFormContribution.setFieldValue("periodoPago", formattedValue);

    if (formattedValue) {
      const errorMessage = validatePeriodFormat(formattedValue);
      if (errorMessage) {
        filterFormContribution.setFieldError("periodoPago", errorMessage);
      } else {
        filterFormContribution.clearFieldError("periodoPago");
      }
    }
  };

  const handlePeriodoFinalChange = (event: any) => {
    const value = event.currentTarget.value;
    const formattedValue = formatPeriod(value);
    filterFormContribution.setFieldValue("periodoPagoFin", formattedValue);

    if (formattedValue) {
      const errorMessage = validatePeriodFormat(formattedValue);
      if (errorMessage) {
        filterFormContribution.setFieldError("periodoPagoFin", errorMessage);
      } else {
        filterFormContribution.clearFieldError("periodoPagoFin");
      }
    }
  };

  return (
    <form
      data-testid="contribution-form"
      onSubmit={filterFormContribution.onSubmit((values) => {
        let hasErrors = false;

        if (values.periodoPago) {
          const errorMessage = validatePeriodFormat(values.periodoPago);
          if (errorMessage) {
            filterFormContribution.setFieldError("periodoPago", errorMessage);
            hasErrors = true;
          }
        }

        if (values.periodoPagoFin) {
          const errorMessage = validatePeriodFormat(values.periodoPagoFin);
          if (errorMessage) {
            filterFormContribution.setFieldError(
              "periodoPagoFin",
              errorMessage
            );
            hasErrors = true;
          }
        }

        if (!values.periodoPago && values.periodoPagoFin) {
          filterFormContribution.setFieldError(
            "periodoPago",
            "Si especifica periodo final, debe especificar periodo inicial"
          );
          hasErrors = true;
        }

        if (values.periodoPago && values.periodoPagoFin) {
          const inicio = values.periodoPago.replace(/-/g, "");
          const fin = values.periodoPagoFin.replace(/-/g, "");

          if (parseInt(inicio) > parseInt(fin)) {
            filterFormContribution.setFieldError(
              "periodoPagoFin",
              "El periodo final debe ser mayor o igual al inicial"
            );
            hasErrors = true;
          }
        }

        if (!hasErrors) {
          handleFilterSubmit();
        }
      })}
    >
      <div style={{ padding: "16px 16px 0px 16px" }}>
        <Group grow justify="space-between" mb="md">
          <TextInput
            label="Periodo inicial"
            placeholder="AAAA-MM"
            size="xs"
            data-testid="periodo-inicial-input"
            value={filterFormContribution.values.periodoPago || ""}
            onChange={handlePeriodoInicialChange}
            error={filterFormContribution.errors.periodoPago}
            maxLength={7}
          />
          <TextInput
            label="Periodo final"
            placeholder="AAAA-MM"
            size="xs"
            data-testid="periodo-final-input"
            value={filterFormContribution.values.periodoPagoFin || ""}
            onChange={handlePeriodoFinalChange}
            error={filterFormContribution.errors.periodoPagoFin}
            maxLength={7}
          />
          <Select
            size="xs"
            label="Disponibilidad"
            placeholder="Seleccionala disponibilidad"
            data={tipoConceptoOptions}
            data-testid="disponibilidad-select"
            {...filterFormContribution.getInputProps("idDisponible")}
          />
          <Select
            size="xs"
            label="Tipo de Movimiento"
            placeholder="Selecciona tipo de movimiento"
            data={tipoMovimientoOptions}
            data-testid="tipo-movimiento-select"
            {...filterFormContribution.getInputProps("tipoMovimiento")}
          />
        </Group>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: "16px",
          width: "100%",
          padding: " 0px 16px 16px 16px",
        }}
      >
        {cuentaId ? (          
          <>
            <Button
              onClick={handleDownloadContributions}
              color={PRIMARY_COLOR}
              size="xs"
              data-testid="csv-download-contributions"
            >
              Descargar aportes
            </Button>
            <Button
              onClick={handleDownloadTotalContributions}
              color={PRIMARY_COLOR}
              size="xs"
              data-testid="csv-download-details"
            >
              Descargar detalles
            </Button>
          </>
        ) : null}
        <Button
          type="submit"
          color={PRIMARY_COLOR}
          size="xs"
          data-testid="consultar-button"
        >
          Consultar
        </Button>
        <Button
          onClick={handleFilterReset}
          color={PRIMARY_COLOR}
          variant="outline"
          size="xs"
          data-testid="limpiar-filtros-button"
        >
          Limpiar Filtros
        </Button>
      </div>
    </form>
  );
};

export { ContributionFilterForm };
