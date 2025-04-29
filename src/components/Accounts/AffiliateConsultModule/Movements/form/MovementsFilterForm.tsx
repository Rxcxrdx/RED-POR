"use client";

import React from "react";
import { Button, Group, TextInput, Select } from "@mantine/core";

import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { PRIMARY_COLOR } from "@/common/constants";
import { IMovementsFilterFormProps } from "../IMovements";

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

export const MovementsFilterForm: React.FC<IMovementsFilterFormProps> = ({
  filterFormMovements,
  handleFilterSubmit,
  handleFilterReset,
  handleDownloadMovements,
  conceptOptions,
}) => {
  const tipoMovimientoOptions = [
    { value: "All", label: "Todos" },
    { value: "VOL", label: "Voluntarios" },
  ];

  const handlePeriodoInicialChange = (event: any) => {
    const value = event.currentTarget.value;
    const formattedValue = formatPeriod(value);
    filterFormMovements.setFieldValue("periodoPago", formattedValue);

    if (formattedValue) {
      const errorMessage = validatePeriodFormat(formattedValue);
      if (errorMessage) {
        filterFormMovements.setFieldError("periodoPago", errorMessage);
      } else {
        filterFormMovements.clearFieldError("periodoPago");
      }
    }
  };

  const handlePeriodoFinalChange = (event: any) => {
    const value = event.currentTarget.value;
    const formattedValue = formatPeriod(value);
    filterFormMovements.setFieldValue("periodoPagoFin", formattedValue);

    if (formattedValue) {
      const errorMessage = validatePeriodFormat(formattedValue);
      if (errorMessage) {
        filterFormMovements.setFieldError("periodoPagoFin", errorMessage);
      } else {
        filterFormMovements.clearFieldError("periodoPagoFin");
      }
    }
  };

  return (
    <form
      onSubmit={filterFormMovements.onSubmit((values) => {
        let hasErrors = false;

        if (values.periodoPago) {
          const errorMessage = validatePeriodFormat(values.periodoPago);
          if (errorMessage) {
            filterFormMovements.setFieldError("periodoPago", errorMessage);
            hasErrors = true;
          }
        }

        if (values.periodoPagoFin) {
          const errorMessage = validatePeriodFormat(values.periodoPagoFin);
          if (errorMessage) {
            filterFormMovements.setFieldError("periodoPagoFin", errorMessage);
            hasErrors = true;
          }
        }

        if (!values.periodoPago && values.periodoPagoFin) {
          filterFormMovements.setFieldError(
            "periodoPago",
            "Si especifica periodo final, debe especificar periodo inicial"
          );
          hasErrors = true;
        }

        if (values.periodoPago && values.periodoPagoFin) {
          const inicio = values.periodoPago.replace(/-/g, "");
          const fin = values.periodoPagoFin.replace(/-/g, "");

          if (parseInt(inicio) > parseInt(fin)) {
            filterFormMovements.setFieldError(
              "periodoPagoFin",
              "El periodo final debe ser mayor o igual al inicial"
            );
            hasErrors = true;
          }
        }

        if (!hasErrors) {
          handleFilterSubmit(values);
        }
      })}
      data-testid="movements-form"
    >
      <div style={{ padding: "16px 16px 0px 16px" }}>
        <Group grow justify="space-between" mb="md">
          <TextInput
            label="Periodo inicial"
            placeholder="AAAA-MM"
            size="xs"
            data-testid="periodo-inicial-input"
            value={filterFormMovements.values.periodoPago || ""}
            onChange={handlePeriodoInicialChange}
            error={filterFormMovements.errors.periodoPago}
            maxLength={7}
          />
          <TextInput
            label="Periodo final"
            placeholder="AAAA-MM"
            size="xs"
            data-testid="periodo-final-input"
            value={filterFormMovements.values.periodoPagoFin || ""}
            onChange={handlePeriodoFinalChange}
            error={filterFormMovements.errors.periodoPagoFin}
            maxLength={7}
          />
          <Select
            size="xs"
            label="Tipo de Movimiento"
            placeholder="Selecciona tipo de movimiento"
            data={tipoMovimientoOptions}
            data-testid="tipo-movimiento-select"
            {...filterFormMovements.getInputProps("tipoMovimiento")}
          />
          <Select
            size="xs"
            label="Tipo de Concepto"
            placeholder="Selecciona tipo de concepto"
            data={conceptOptions}
            data-testid="tipo-concepto-select"
            {...filterFormMovements.getInputProps("conceptoId")}
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
        <Button
          onClick={handleDownloadMovements}
          color={PRIMARY_COLOR}
          size="xs"
          data-testid="descargar-movimientos-button"
        >
          Descargar movimientos
        </Button>
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
