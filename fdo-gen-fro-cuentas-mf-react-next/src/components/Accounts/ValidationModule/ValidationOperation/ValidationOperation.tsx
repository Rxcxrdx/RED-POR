import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Button,
  Dropdown,
  Table,
  Toast,
} from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS } from "@/common/constants";
import {
  BoxMessage,
  Loader,
  TextWithDivider,
  ToggleButton,
} from "@/components/common";
import {
  getOperationsTypeService,
  postValidationOperationService,
  updateValidationStateService,
} from "@/services";

import { tableValidationColumns, validationStates } from "../validation.common";
import AssociateValidation from "./AssociateValidation";

import styles from "./ValidationOperation.module.scss";

export const ValidationOperation = () => {
  const { NO_INFORMATION } = COMMON_LABELS;
  const [validationOperationData, setValidationOperationData] = useState([]);
  const [operationTypes, setOperationTypes] = useState<
    { value: string; text: string } | any
  >([]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({});

  const [tableData, setTableData] = useState({
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 100,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateColumn = {
    $header: "Estado",
    $key: "custom",
    $render: (item: any) => (
      <ToggleButton
        isActive={item.estado === "ACTIVO"}
        onClick={() => onUpdateValidation(item)}
      />
    ),
  };
  const newOffsets = [0, 10, 20, 30];
  const validationOperationColumns = tableValidationColumns([updateColumn])
    .slice(1)
    .map((item, index) => ({
      ...item,
      $stickyOffset: `${newOffsets[index]}rem`,
    }));

  const onSearch = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const response = await postValidationOperationService({
        codigoOperacionId: data.operationType?.value,
        estado: data.status?.value || null,
        page: { page: tableData.currentPage, size: 10 },
      });

      const { status, data: infoResponse } = response;

      if (status?.statusCode === 200) {
        const { listValidacion: validation, page } = infoResponse;

        setValidationOperationData(validation);
        setTableData((prevState) => ({
          ...prevState,
          totalItems: page.totalElement,
          currentPage: page.actualPage,
          totalPages: page.totalPage,
        }));
        setErrorMessage(validation.length > 0 ? "" : NO_INFORMATION);
        Toast.showStatusCode(200);
      } else if (status?.statusCode === 206) {
        Toast.showStatusCode(206);
        setErrorMessage(status.statusDescription);
      }
    } catch (error) {
      setErrorMessage("Error al consultar validaciones");
      setValidationOperationData([]);
    } finally {
      setIsLoading(false);
    }
  });

  const onUpdateValidation = async (validationInformation: any) => {
    setIsLoading(true);
    try {
      const response = await updateValidationStateService({
        validacionId: validationInformation.validacionId,
        codigoOperacionId: validationInformation.codigoOperacionId,
        estado:
          validationInformation.estado !== "ACTIVO" ? "ACTIVO" : "INACTIVO",
        usuarioUltimaModificacion: "test",
      });
      Toast.showStatusCode(response?.status?.statusCode || 400);
    } catch (error) {
      Toast.showStatusCode(400);
    } finally {
      onSearch();
      setIsLoading(false);
    }
  };

  const fetchOperationsType = async () => {
    setIsLoading(true);
    try {
      const response = await getOperationsTypeService();

      if (response?.status?.statusCode === 200) {
        setOperationTypes(
          response.data.map(({ codigoOperacionId, descripcionLarga }) => ({
            value: codigoOperacionId,
            text: descripcionLarga,
          }))
        );
      }
    } catch (error) {
      setOperationTypes([]);
      Toast.showStatusCode(400);
    } finally {
      onSearch();
      setIsLoading(false);
    }
  };

  const onCleanFilter = () => {
    reset();
    setErrorMessage(NO_INFORMATION);
    setValidationOperationData([]);
  };

  useEffect(() => {
    Toast.init();
    fetchOperationsType();
    setErrorMessage(NO_INFORMATION);
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} />
      <div className={styles.validationOperationContainer}>
        <form className={styles.filterFormContainer} onSubmit={onSearch}>
          <Controller
            name="operationType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Dropdown
                $w="35%"
                name="operationType"
                $title="Tipo de Operación"
                placeholder="Seleccione operación"
                $options={operationTypes}
                $Value={field?.value?.text}
                onChange={(item) =>
                  setValue("operationType", {
                    text: item.target.textContent,
                    value: item.target.value,
                  })
                }
                $isError={
                  errors.hasOwnProperty("operationType") &&
                  watch("operationType") === undefined
                }
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Dropdown
                $w="30%"
                name="status"
                $title="Estado"
                placeholder="Todos"
                $Value={field?.value?.text}
                $options={validationStates}
                onChange={(item) =>
                  setValue("status", {
                    text: item.target.textContent,
                    value: item.target.value,
                  })
                }
                readOnly
              />
            )}
          />
          <div className={styles.buttonsContainer}>
            <Button
              type="button"
              $color="secondary"
              onClick={onCleanFilter}
              disabled={
                watch("operationType") === undefined &&
                watch("status") === undefined
              }
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              $color="primary"
              disabled={watch("operationType") === undefined}
            >
              Consultar
            </Button>
          </div>
        </form>

        <TextWithDivider>Coincidencias de consulta</TextWithDivider>

        {errorMessage ? (
          <BoxMessage
            errorMessage={errorMessage}
            style={{ width: "initial" }}
          />
        ) : (
          <div className={styles.tableInfo}>
            <Table
              $columns={validationOperationColumns}
              $data={validationOperationData}
              $currentPage={tableData.currentPage}
              $totalPages={tableData.totalPages}
              $itemsPerPage={tableData.itemsPerPage}
              $totalItems={tableData.totalItems}
              $onPageChange={() => {}}
              $onItemsPerPageChange={() => {}}
              $itemsPerPageOptions={[2, 10, 20, 30]}
              $onSelectionChange={() => {}}
              $onSort={() => {}}
              $selectionType="none"
              $variants={["headerGray", "withShadow", "stripedRows"]}
            />
          </div>
        )}

        <TextWithDivider>Asociar Validación</TextWithDivider>
        <AssociateValidation operationType={watch("operationType")} />
      </div>
    </>
  );
};
