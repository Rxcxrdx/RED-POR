import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "pendig-fro-transversal-lib-react";

import { COMMON_LABELS } from "@/common/constants";
import {
  BoxMessage,
  Loader,
  TableWithHeader,
  TextWithDivider,
} from "@/components/common";
import { postCasesService } from "@/services/operations";

import { seeCasesTableColumns } from "../ConsultCases.common";
import styles from "../consultCases.module.scss";
import SeeCasesFilter from "./SeeCasesFilter";

const SeeCases = () => {
  const filterFormSeeCases = useForm<any>({
    mode: "onChange",
    defaultValues: {
      caseNumber: "",
      accountId: "",
      // this field doesn't do anything
      requirementType: "",
      operationType: "",
      operationStatus: "",
      initialDate: "",
      finalDate: "",
      user: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [seeCasesData, setSeeCasesData] = useState<any[]>([]);

  const [tableData, setTableData] = useState({
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 100,
  });

  // TODO: check pagination
  const onSearch = filterFormSeeCases.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const response = await postCasesService({
        casoId: data?.caseNumber,
        cuentaId: data?.accountId,
        estado: data?.operationStatus?.value,
        codigoOperacionId: data?.operationType?.value,
        fechaInicial: data?.initialDate,
        fechaFinal: data?.finalDate,
        usuario: data?.user,
        page: { page: 0, size: 10 },
      });
      const { listCasos: cases, page } = response?.data;

      setSeeCasesData(cases);

      setTableData((prevState) => ({
        ...prevState,
        totalItems: page.totalElement,
        currentPage: page.actualPage,
        totalPages: page.totalPage,
      }));
      setErrorMessage(cases.length > 0 ? "" : COMMON_LABELS.NO_INFORMATION);
    } catch (error) {
      Toast.showStatusCode(400);
      setErrorMessage("Error al consultar consultas");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    setErrorMessage(COMMON_LABELS.NO_INFORMATION);
    Toast.init();
  }, []);

  return (
    <div className={styles.accordionContainer}>
      <Loader isLoading={isLoading} />

      <SeeCasesFilter onSearch={onSearch} filterForm={filterFormSeeCases} />

      <TextWithDivider>Coincidencias de Consulta</TextWithDivider>

      {errorMessage ? (
        <BoxMessage errorMessage={errorMessage} />
      ) : (
        <TableWithHeader
          title="Casos"
          tableProps={{
            $columns: seeCasesTableColumns,
            $data: seeCasesData,
            $currentPage: tableData.currentPage,
            $totalPages: tableData.totalPages,
            $itemsPerPage: tableData.itemsPerPage,
            $totalItems: tableData.totalItems,
            $onPageChange: () => {},
            $onItemsPerPageChange: () => {},
            $itemsPerPageOptions: [2, 10, 20, 30],
            $onSelectionChange: () => {},
            $onSort: () => {},
            $selectionType: "radio",
            $variants: ["headerGray", "withShadow", "stripedRows"],
          }}
        />
      )}
    </div>
  );
};

export default SeeCases;
