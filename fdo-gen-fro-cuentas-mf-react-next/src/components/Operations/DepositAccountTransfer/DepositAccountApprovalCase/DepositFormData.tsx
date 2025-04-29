import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Dropdown } from "pendig-fro-transversal-lib-react";

import styles from "./DepositAccountApprovalCase.module.scss";

interface DepositFormDataProps {
  filterForm: UseFormReturn<any>;
  bankList: any[];
  officeList: any[];
  accountList: any[];
}

const DepositFormData = ({
  filterForm,
  bankList,
  officeList,
  accountList,
}: DepositFormDataProps) => {
  const { control, watch } = filterForm;
  return (
    <div className={styles.sectionContainer}>
      <h3>Datos del deposito</h3>
      <div className={styles.depositDataContainer}>
        <Controller
          name="bank"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $size="small"
              $title="Banco"
              placeholder="Selecciona Banco"
              $Value={field.value}
              onChange={field.onChange}
              $options={bankList}
            />
          )}
        />
        <Controller
          name="office"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $title="Oficinas"
              $size="small"
              placeholder="Selecciona Oficinas"
              disabled={watch("bank") === undefined}
              $Value={field.value}
              onChange={field.onChange}
              $options={officeList}
            />
          )}
        />
        <Controller
          name="account"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              $title="Cuenta"
              $size="small"
              placeholder="Selecciona cuenta"
              disabled={watch("office") === undefined}
              $Value={field.value}
              onChange={field.onChange}
              $options={accountList}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DepositFormData;
