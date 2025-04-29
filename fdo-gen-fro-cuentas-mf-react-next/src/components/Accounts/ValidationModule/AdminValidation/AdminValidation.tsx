import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button, Dropdown } from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS } from "@/common/constants";
import {
  BoxMessage,
  Loader,
  TableWithHeader,
  TextWithDivider,
} from "@/components";
import { postSearchValidationsService } from "@/services";
import { useTableData } from "@/hooks";

import UpdateAdminValidation from "./UpdateAdminValidation";
import { CreateValidationForm } from "./CreateValidationForm";
import { IValidationCatalog, IValidationElement } from "./IAdminValidation";
import { tableValidationColumns } from "../validation.common";

import styles from "./adminValidation.module.scss";

const AdminValidation = () => {
  const { NO_INFORMATION } = COMMON_LABELS;
  const { control, handleSubmit, reset, setValue } = useForm();

  const [adminValidationData, setAdminValidationData] = useState<
    IValidationElement[]
  >([]);
  const [validationCatalog, setValidationCatalog] = useState<
    IValidationCatalog[]
  >([]);
  const [tableData, setTableData] = useState({
    totalPages: 0,
    totalItems: 100,
    currentPage: 0,
    itemsPerPage: 10,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInformation, setModalInformation] = useState({});

  const { tableProperties, fetchInitialData } = useTableData({
    serviceInfo: {
      service: postSearchValidationsService,
      body: { validationId: null },
      dataArgument: "listValidacion",
      beforeService: () => {
        setIsLoading(true);
      },
      afterService: () => {
        setIsLoading(false);
      },
    },
  });

  const updateColumn = {
    $header: "Actualizar",
    $key: "custom",
    $render: (item: any) => (
      <Button
        $color="primary"
        onClick={() => {
          setModalOpen(true);
          setModalInformation(item);
        }}
      >
        Actualizar
      </Button>
    ),
  };

  const searchValidations = async (validation?: string) => {
    setIsLoading(true);
    try {
      const response = await postSearchValidationsService({
        validacionId: validation || null,
        page: { page: tableData.currentPage, size: 10 },
      });
      const { listValidacion: validations, page } = response?.data;

      setAdminValidationData(validations);
      setTableData((prevState) => ({
        ...prevState,
        totalItems: page.totalElement,
        currentPage: page.actualPage,
        totalPages: page.totalPage,
      }));
      setErrorMessage(validations.length > 0 ? "" : NO_INFORMATION);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await searchValidations(data.validationName?.value);
    } catch (error) {
      setErrorMessage("Error al consultar validaciones.");
      setAdminValidationData([]);
    } finally {
      setIsLoading(false);
    }
  });

  const fetchValidations = async () => {
    setIsLoading(true);
    try {
      const response = await postSearchValidationsService({
        validacionId: null,
        page: { page: 0, size: 30 },
      });
      const {
        listValidacion: validations,
      }: { listValidacion: IValidationElement[] } = response?.data;

      if (validations.length > 0) {
        setValidationCatalog(
          validations.map((element) => ({
            text: element.nombre,
            value: `${element.validacionId}`,
          }))
        );
      }
    } catch (error) {
      setErrorMessage("Error al consultar validaciones.");
      setValidationCatalog([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseModal = () => {
    searchValidations();
    setModalOpen(false);
  };

  const onCleanFilter = () => {
    reset();
    setErrorMessage(NO_INFORMATION);
    setAdminValidationData([]);
  };

  useEffect(() => {
    setErrorMessage(NO_INFORMATION);
    fetchValidations();
    fetchInitialData();
  }, []);

  return (
    <div className={styles.adminValidationContainer}>
      <Loader isLoading={isLoading} />

      <form className={styles.filterFormContainer} onSubmit={onSearch}>
        <Controller
          name="validationName"
          control={control}
          render={({ field }) => (
            <Dropdown
              $w="max-content"
              $title="Validaciones"
              placeholder="Seleccione validación"
              $options={validationCatalog}
              value={field.value?.textContent}
              onChange={({ target: { textContent, value } }) => {
                setValue("validationName", { textContent, value });
              }}
            />
          )}
        />

        <div className={styles.buttonsContainer}>
          <Button type="button" $color="secondary" onClick={onCleanFilter}>
            Limpiar
          </Button>
          <Button type="submit" $color="primary">
            Consultar
          </Button>
        </div>
      </form>

      <TextWithDivider>Coincidencias de consulta</TextWithDivider>
      {errorMessage ? (
        <BoxMessage errorMessage={errorMessage} style={{ width: "initial" }} />
      ) : (
        <TableWithHeader
          title="Validaciones"
          tableProps={{
            ...tableProperties,
            $columns: tableValidationColumns([updateColumn]),
            $variants: ["headerGray", "withShadow", "stripedRows"],
          }}
        />
      )}
      {/* TODO: add text to table <p>Validaciones por operación</p> */}
      <UpdateAdminValidation
        $isOpen={modalOpen}
        validationInformation={tableValidationColumns([updateColumn])}
        modalInformation={modalInformation}
        onClose={onCloseModal}
        onSecondaryAction={() => setModalOpen(false)}
        setIsLoading={setIsLoading}
      />

      <TextWithDivider>Crear una nueva validaciòn</TextWithDivider>
      <CreateValidationForm />
    </div>
  );
};

export default AdminValidation;
