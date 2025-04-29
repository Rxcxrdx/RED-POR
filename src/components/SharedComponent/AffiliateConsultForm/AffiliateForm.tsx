import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Dropdown,
  Icon,
} from "pendig-fro-transversal-lib-react";
import { Controller, UseFormReturn } from "react-hook-form";
import styles from "./affiliateConsult.module.scss";

interface AffiliateConsultFormProps {
  form: UseFormReturn<any>;
  onSubmit: (arg0: any) => void;
  onReset: () => void;
  config?: {
    showAccountNumber?: boolean;
    showIdentification?: boolean;
    showName?: boolean;
  };
  isArrears?: boolean;
}

const tipoDocumentoOptions = [
  { value: "CC", text: "Cédula de Ciudadanía (CC)" },
  { value: "CE", text: "Cédula de Extranjería (CE)" },
  { value: "TI", text: "Tarjeta de Identidad (TI)" },
  { value: "PAS", text: "Pasaporte (PAS)" },
  { value: "REG", text: "Registro Civil (REG)" },
  { value: "IE", text: "Identificación Errada (IE)" },
  { value: "CD", text: "Carnet Diplomatico (CD)" },
  { value: "PE", text: "Permiso Especial de Permanencia (PE)" },
  { value: "PT", text: "Permiso de Proteccion Temporal (PT)" },
  { value: "SC", text: "Salvoconducto de Permanencia (SC)" },
];

export const AffiliateForm: React.FC<AffiliateConsultFormProps> = ({
  form,
  onSubmit,
  onReset,
  config = {
    showAccountNumber: true,
    showIdentification: true,
    showName: true,
  },
  isArrears,
}) => {
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  const [activeSearchMethod, setActiveSearchMethod] = useState<
    "identification" | "account" | "name" | null
  >(null);

  const [previousMethod, setPreviousMethod] = useState<
    "identification" | "account" | "name" | null
  >(null);

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = form;

  const numeroCuenta = watch("numeroCuenta");
  const numeroIdentificacion = watch("numeroIdentificacion");
  const tipoIdentificacion = watch("tipoIdentificacion");
  const primerNombre = watch("primerNombre");
  const segundoNombre = watch("segundoNombre");
  const primerApellido = watch("primerApellido");
  const segundoApellido = watch("segundoApellido");

  const isIdentificationInUse =
    numeroIdentificacion?.trim() !== "" ||
    (tipoIdentificacion !== null && tipoIdentificacion !== "");
  const isAccountInUse = numeroCuenta?.trim() !== "";
  const isNameInUse =
    primerNombre?.trim() !== "" ||
    primerApellido?.trim() !== "" ||
    segundoNombre?.trim() !== "" ||
    segundoApellido?.trim() !== "";

  const isFormActive = isIdentificationInUse || isAccountInUse || isNameInUse;

  useEffect(() => {
    if (activeSearchMethod !== null) {
      setPreviousMethod(activeSearchMethod);
    }

    if (isIdentificationInUse) {
      setActiveSearchMethod("identification");
    } else if (isAccountInUse) {
      setActiveSearchMethod("account");
    } else if (isNameInUse) {
      setActiveSearchMethod("name");
    } else {
      setActiveSearchMethod(null);
    }
  }, [isIdentificationInUse, isAccountInUse, isNameInUse]);

  useEffect(() => {
    if (previousMethod !== activeSearchMethod) {
      switch (previousMethod) {
        case "identification":
          clearErrors(["tipoIdentificacion", "numeroIdentificacion"]);
          break;
        case "account":
          clearErrors(["numeroCuenta"]);
          break;
        case "name":
          clearErrors([
            "primerNombre",
            "primerApellido",
            "segundoNombre",
            "segundoApellido",
          ]);
          break;
      }
    }
  }, [activeSearchMethod, previousMethod, clearErrors]);

  const handleNameSectionToggle = () => {
    setIsNameExpanded(!isNameExpanded);
    if (!isNameExpanded && activeSearchMethod === "name") {
      trigger(["primerNombre", "primerApellido"]);
    }
  };

  const isDropdownDisabled =
    activeSearchMethod !== null && activeSearchMethod !== "identification";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="base-search-form"
      autoComplete="off"
    >
      <div
        style={{
          width: isArrears ? "350px" : "746px",
          padding: "24px 32px 48px 32px",
          margin: "3px 16px 16px 16px",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0px 4px 8px 0px rgba(41, 41, 41, 0.10), 0px 2px 4px 0px rgba(41, 41, 41, 0.11), 0px 0px 2px 0px rgba(41, 41, 41, 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <h6
            style={{
              fontFamily: "Banda Bold",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "32px",
            }}
          >
            Consulta de afiliado
          </h6>
          <p
            style={{
              fontFamily: "Banda Regular",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "20px",
            }}
          >
            Puedes hacer la consulta ingresando cualquiera de los siguientes
            parámetros{" "}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "24px",
              width: "100%",
              flexWrap: isArrears ? "wrap" : "nowrap",
            }}
          >
            {config.showIdentification && (
              <>
                <Controller
                  name="tipoIdentificacion"
                  control={control}
                  rules={{
                    required: {
                      value: activeSearchMethod === "identification",
                      message: "El tipo de identificación es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Dropdown
                      $title="Tipo de identificación"
                      $size="normal"
                      $w="100%"
                      $options={isDropdownDisabled ? [] : tipoDocumentoOptions}
                      placeholder="Seleccionar"
                      disabled={isDropdownDisabled}
                      $Value={field.value}
                      onChange={(e) => {
                        if (!isDropdownDisabled) {
                          field.onChange(e);
                          if (e) {
                            trigger("numeroIdentificacion");
                          }
                        }
                      }}
                      $isError={
                        !!error && activeSearchMethod === "identification"
                      }
                      $errorMessage={error?.message}
                      $helpText={
                        activeSearchMethod === "identification"
                          ? error?.message
                          : ""
                      }
                      data-testid="tipo-identificacion-select"
                    />
                  )}
                />

                <Controller
                  name="numeroIdentificacion"
                  control={control}
                  rules={{
                    required: {
                      value:
                        tipoIdentificacion !== null &&
                        tipoIdentificacion !== "" &&
                        activeSearchMethod === "identification",
                      message: "El número de identificación es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      $title="Número de identificación"
                      $size="normal"
                      $w="100%"
                      placeholder="Ingresa el número de identificación"
                      disabled={
                        activeSearchMethod !== null &&
                        activeSearchMethod !== "identification"
                      }
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (
                          tipoIdentificacion &&
                          activeSearchMethod === "identification"
                        ) {
                          trigger("numeroIdentificacion");
                        } else if (e.target.value) {
                          trigger("tipoIdentificacion");
                        }
                      }}
                      $isError={
                        !!error && activeSearchMethod === "identification"
                      }
                      $errorMessage={error?.message}
                      $helpText={
                        activeSearchMethod === "identification"
                          ? error?.message
                          : ""
                      }
                      name="numeroIdentificacion"
                      data-testid="numero-identificacion-input"
                      type="number"
                    />
                  )}
                />
              </>
            )}
          </div>

          {config.showAccountNumber && (
            <Controller
              name="numeroCuenta"
              control={control}
              rules={{
                required: {
                  value: activeSearchMethod === "account",
                  message: "El número de cuenta es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  $title="Número de cuenta"
                  $size="normal"
                  $w="100%"
                  placeholder="Ingresa el número de cuenta"
                  disabled={
                    activeSearchMethod !== null &&
                    activeSearchMethod !== "account"
                  }
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value && activeSearchMethod === "account") {
                      trigger("numeroCuenta");
                    }
                  }}
                  $isError={!!error && activeSearchMethod === "account"}
                  $errorMessage={error?.message}
                  $helpText={
                    activeSearchMethod === "account" ? error?.message : ""
                  }
                  name="numeroCuenta"
                  data-testid="numero-cuenta-input"
                  type="number"
                />
              )}
            />
          )}

          {config.showName && (
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  marginBottom: isNameExpanded ? "16px" : "0",
                }}
                onClick={handleNameSectionToggle}
              >
                <span
                  style={{
                    color: "#3E6C33",
                    textAlign: "center",
                    fontFamily: "Banda Bold",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "24px",
                  }}
                >
                  Consulta por nombre
                </span>

                {isNameExpanded ? (
                  <Icon
                    className={styles.icon_green}
                    $name="keyboardArrowUp"
                    $w="16px"
                    $h="16px"
                    title="keyboardArrowUp"
                  />
                ) : (
                  <Icon
                    className={styles.icon_green}
                    $name="keyBoardArrowDown"
                    $w="16px"
                    $h="16px"
                    title="keyBoardArrowDown"
                  />
                )}
              </div>

              {isNameExpanded && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: "24px",
                      width: "100%",
                      flexWrap: isArrears ? "wrap" : "nowrap",
                    }}
                  >
                    <Controller
                      name="primerApellido"
                      control={control}
                      rules={{
                        required: {
                          value: activeSearchMethod === "name",
                          message: "El primer apellido es requerido",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']*$/,
                          message: "Solo se permiten letras en este campo",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          type="text"
                          $title="Primer apellido*"
                          $size="normal"
                          $w="100%"
                          placeholder="Ingresa primer apellido"
                          disabled={
                            activeSearchMethod !== null &&
                            activeSearchMethod !== "name"
                          }
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            if (
                              e.target.value &&
                              activeSearchMethod === "name"
                            ) {
                              trigger("primerNombre");
                            }
                          }}
                          $isError={!!error && activeSearchMethod === "name"}
                          $errorMessage={error?.message}
                          $helpText={
                            activeSearchMethod === "name" ? error?.message : ""
                          }
                          name="primerApellido"
                        />
                      )}
                    />
                    <Controller
                      name="segundoApellido"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']*$/,
                          message: "Solo se permiten letras en este campo",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          type="text"
                          $title="Segundo apellido"
                          $size="normal"
                          $w="100%"
                          placeholder="Ingresa segundo apellido"
                          disabled={
                            activeSearchMethod !== null &&
                            activeSearchMethod !== "name"
                          }
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          $isError={!!error && activeSearchMethod === "name"}
                          $errorMessage={error?.message}
                          $helpText={
                            activeSearchMethod === "name" ? error?.message : ""
                          }
                          name="segundoApellido"
                        />
                      )}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: "24px",
                      width: "100%",
                      flexWrap: isArrears ? "wrap" : "nowrap",
                    }}
                  >
                    <Controller
                      name="primerNombre"
                      control={control}
                      rules={{
                        required: {
                          value: activeSearchMethod === "name",
                          message: "El primer nombre es requerido",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']*$/,
                          message: "Solo se permiten letras en este campo",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          type="text"
                          $title="Primer nombre*"
                          $size="normal"
                          $w="100%"
                          placeholder="Ingresa primer nombre"
                          disabled={
                            activeSearchMethod !== null &&
                            activeSearchMethod !== "name"
                          }
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            if (
                              e.target.value &&
                              activeSearchMethod === "name"
                            ) {
                              trigger("primerApellido");
                            }
                          }}
                          $isError={!!error && activeSearchMethod === "name"}
                          $errorMessage={error?.message}
                          $helpText={
                            activeSearchMethod === "name" ? error?.message : ""
                          }
                          name="primerNombre"
                        />
                      )}
                    />
                    <Controller
                      name="segundoNombre"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']*$/,
                          message: "Solo se permiten letras en este campo",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          type="text"
                          $title="Segundo nombre"
                          $size="normal"
                          $w="100%"
                          placeholder="Ingresa segundo nombre"
                          disabled={
                            activeSearchMethod !== null &&
                            activeSearchMethod !== "name"
                          }
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          $isError={!!error}
                          $errorMessage={error?.message}
                          $helpText={error?.message}
                          name="segundoNombre"
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <Button
            type="button"
            onClick={onReset}
            $size="small"
            $color="tertiary"
            $type="soft"
            disabled={!isFormActive}
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            color="primary"
            $size="small"
            disabled={!isFormActive}
          >
            Consultar
          </Button>
        </div>
      </div>
    </form>
  );
};
