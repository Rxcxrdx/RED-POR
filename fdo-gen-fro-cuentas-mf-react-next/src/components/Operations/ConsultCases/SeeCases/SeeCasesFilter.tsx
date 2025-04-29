import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Button,
  DropdownButton,
  Input,
  SingleDatePicker,
} from "pendig-fro-transversal-lib-react";

import {
  OperationStates,
  OperationTypes,
  RequirementTypes,
} from "../ConsultCases.common";

import styles from "./SeeCases.module.scss";

const SeeCasesFilter = ({
  onSearch,
  filterForm,
}: {
  onSearch: () => void;
  filterForm: UseFormReturn<any>;
}) => {
  const dateFormatRequest = "dd/mm/yyyy";
  const { control, setValue, watch } = filterForm;

  const onCleanFilter = () => {
    filterForm.reset();
  };

  return (
    <form className={styles.seeCasesFilterContainer} onSubmit={onSearch}>
      <Controller
        name="caseNumber"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            $title="Número de caso"
            type="number"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="accountId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            $title="Cuenta ID"
            type="number"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="requirementType"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DropdownButton
            $title="Tipo de requerimiento"
            placeholder="Todos"
            $options={RequirementTypes}
            value={field.value?.text}
            onChange={(item) =>
              setValue("requirementType", {
                text: item.target.textContent,
                value: item.target.value,
              })
            }
            readOnly
          />
        )}
      />

      <Controller
        name="operationType"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DropdownButton
            $title="Tipo de operación"
            placeholder="Todos"
            $options={OperationTypes}
            value={field.value?.text}
            onChange={(item) =>
              setValue("operationType", {
                text: item.target.textContent,
                value: item.target.value,
              })
            }
            readOnly
          />
        )}
      />

      <Controller
        name="operationStatus"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DropdownButton
            $title="Estado de operación"
            placeholder="Todos"
            $options={OperationStates}
            value={field.value?.text}
            onChange={(item) =>
              setValue("operationStatus", {
                text: item.target.textContent,
                value: item.target.value,
              })
            }
            readOnly
          />
        )}
      />

      {/* TODO: check clearFilter behavior for dates */}
      <Controller
        name="initialDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <SingleDatePicker
            $title="Fecha desde"
            value={field.value}
            $maxDate={watch("finalDate")}
            onChange={field.onChange}
            $dateFormatResponse={dateFormatRequest}
          />
        )}
      />

      <Controller
        name="finalDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <SingleDatePicker
            $title="Fecha hasta"
            value={field.value}
            $minDate={watch("initialDate")}
            onChange={field.onChange}
            $dateFormatResponse={dateFormatRequest}
          />
        )}
      />

      <Controller
        name="user"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            $title="Usuario"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className={styles.seeCasesFilterContainer__filterButtons}>
        <Button type="submit" $color="primary">
          Consultar
        </Button>
        <Button type="button" $color="secondary" onClick={onCleanFilter}>
          Limpiar filtros
        </Button>
      </div>
    </form>
  );
};

export default SeeCasesFilter;
