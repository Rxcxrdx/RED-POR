import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DepositAccountTransferContext, SuspenseConsultContext } from "@/context";
import {
  ISuspense,
  ISuspensePayload,
  ISuspenseConsultResponse,
  SuspenseConsultFilterFormValues,
} from "./ISuspenseConsultForm";

import { SuspenseConsultFormView } from "./SuspenseConsultFormView";
import { formatPeriodForService, getFileName, saveFile } from "@/common/utils";
import { suspensePost } from "@/services/suspenses";
import { fieldMappingSuspenseSuspenses } from "@/common/constants";

interface SuspenseConsultViewProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  suspenseData: ISuspense[];
  setsuspenseData: (data: ISuspense[]) => void;
  selectedRecord: any[] | null;
  filterFormSuspense: ReturnType<
    typeof useForm<SuspenseConsultFilterFormValues>
  >;
  setPage: (page: number) => void;
  setErrorMessage: (message: string) => void;
  handleItemsPerPageChange: (newSize: number) => void;
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  handleDownloadSuspenses: () => void;
}

export const SuspenseConsultForm: React.FC = () => {
  const { cuentaId, setSelectedContributions } = useContext(
    DepositAccountTransferContext
  );

  const {setSuspense} = useContext(SuspenseConsultContext);

  const [suspenseData, setsuspenseData] = useState<ISuspense[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any[] | null>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const filterFormSuspense = useForm<SuspenseConsultFilterFormValues>({
    mode: "onChange",
    defaultValues: {
      tipoIdentificacion: null,
      numeroIdentificacion: null,
      tipoIdEmpleador: null,
      numeroIdEmpleador: null,
      primerApellido: null,
      segundoApellido: null,
      primerNombre: null,
      segundoNombre: null,
      periodoPago: null,
      fechaPagoInicial: null,
      fechaPagoFinal: null,
      estadoRezago: null,
      folioRezago: null,
      numeroPlanilla: null,
    },
  });

  const { 
    tipoIdentificacion,
    numeroIdentificacion,
    tipoIdEmpleador,
    numeroIdEmpleador,
    primerApellido,
    segundoApellido,
    primerNombre,
    segundoNombre,
    periodoPago,
    fechaPagoInicial,
    fechaPagoFinal,
    estadoRezago,
    folioRezago,
    numeroPlanilla 
  } = filterFormSuspense.getValues();

  const payload: ISuspensePayload = {
    tipoIdDetalle: tipoIdentificacion,
    numeroIdDetalle: numeroIdentificacion,
    tipoIdNitPago: tipoIdEmpleador,
    nitPago: numeroIdEmpleador,
    primerApellido: primerApellido,
    segundoApellido: segundoApellido,
    primerNombre: primerNombre,
    segundoNombre: segundoNombre,
    periodoPago: formatPeriodForService(periodoPago),
    fechaPagoInicial: fechaPagoInicial,
    fechaPagoFinal: fechaPagoFinal,
    estadoRezago: estadoRezago,
    rezagoId: folioRezago,
    numeroPlanilla: numeroPlanilla,
    page: {
      page: page - 1,
      size: pageSize,
    },
  };

  const fetchsuspenseData = async () => {  

    if (!isSubmit) {
      setPage(1);
      setErrorMessage(
        "No se han seleccionado filtros para realizar la consulta."
      );
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = (await suspensePost(
        payload
      )) as ISuspenseConsultResponse;
      handleContributionResponse(response);
    } catch (error) {
      handleFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributionResponse = (response: ISuspenseConsultResponse) => {
    
    const { status, data } = response;
    const statusCode = status?.statusCode;
    const statusDescription = status?.statusDescription;
  
    if (data?.rezagos && data.rezagos.length > 0) {
      const contributionConUniqueId = data.rezagos.map((rezago, index) => ({
        ...rezago,
        uniqueId: `${rezago.cuentaId ?? "concepto"}-${index}`,
      }));

      setsuspenseData(contributionConUniqueId);
      setSuspense(contributionConUniqueId);
      setTotalRecords(data.page.totalElement);
      setTotalPages(data.page.totalPage + 1);
      return;
    }

    if (statusCode === 206) {
      resetsuspenseData("Los parámetros de consulta no generan información");
      return;
    } else if (statusCode === 400) {
      resetsuspenseData("Los parámetros de consulta no generan información");
      return;
    } else if (!data?.rezagos || data.rezagos.length === 0) {
      console.error("No se encontraron aportes en la respuesta:", response);
      resetsuspenseData("La consulta no genera datos");
      return;
    }

    resetsuspenseData(statusDescription || "Error en los datos enviados");
  };

  const handleDownloadSuspenses = async () => {
      
    if (!isSubmit) {
      setPage(1);
      setErrorMessage("No se han seleccionado filtros para realizar la consulta.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      payload.page.size =  totalRecords; 
      const response = (await suspensePost(
        payload
      )) as ISuspenseConsultResponse;
      if (response.data.rezagos) {
        const renamedAndReorderedData = renameAndReorderFields(
          response.data.rezagos
        );
        const filename = getFileName("Rezagos");
        saveFile(renamedAndReorderedData, filename);
      } else {
        setErrorMessage("No se encontraron movimientos del rezago.");
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      setIsLoading(false);
    }
    
  }

  const renameAndReorderFields = (data: ISuspense[]) => {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {};
      Object.keys(fieldMappingSuspenseSuspenses).forEach((key) => {
        if (key in item) {
          newItem[fieldMappingSuspenseSuspenses[key]] = item[key as keyof ISuspense];
        }
      });
      return newItem;
    });
  };

  const resetsuspenseData = (errorMsg: string) => {
    setsuspenseData([]);
    setTotalRecords(0);
    setTotalPages(0);
    setErrorMessage(errorMsg);
  };

  const handleFetchError = (error: unknown) => {
    console.error("Error al llamar al servicio:", error);
    resetsuspenseData("Error al consultar los rezagos.");
  };

  const handleFilterSubmit = () => {
    setIsSubmit(true);
    setPage(1);
    fetchsuspenseData();
  };

  const handleFilterReset = () => {
    filterFormSuspense.reset();
    setsuspenseData([]);
    filterFormSuspense.setValue("tipoIdentificacion", "CC");
    filterFormSuspense.setValue("tipoIdEmpleador", "NIT");
    filterFormSuspense.setValue("estadoRezago", "T");
    setPage(1);
    setIsSubmit(false);
  };

  const handleItemsPerPageChange = (newSize: number) => {    
    setPageSize(newSize);
  };

  useEffect(() => {
    setPage(1);
  }, [cuentaId]);

  useEffect(() => {    
    fetchsuspenseData();
  }, [isSubmit,page, pageSize]);

  const SuspenseConsultViewProps: SuspenseConsultViewProps = {
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    setErrorMessage,
    selectedRecord,
    suspenseData,
    setsuspenseData,
    filterFormSuspense,
    setPage,
    handleFilterReset,
    handleFilterSubmit,
    handleItemsPerPageChange,
    handleDownloadSuspenses,
  };

  return <SuspenseConsultFormView {...SuspenseConsultViewProps} />;
};
