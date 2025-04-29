import React, { useContext, useEffect, useState } from "react";
import {
  ISuspenseUpdate,
  ISuspenseUpdatePayload,
  ISuspenseUpdateResponse,
} from "./ISuspenseDetailUpdate";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { suspenseUpdatePost } from "@/services/suspenses";
import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";
import { formatDate } from "@/common/utils";
import { BaseTable } from "@/components/SharedComponent/BaseTable";

interface SuspenseDetailUpdateViewProps {
  columns: Column[];
  page: number;
  records: ISuspenseUpdate[];
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
}

export const SuspenseDetailUpdate: React.FC = () => {

  const { suspense, update, setUpdate } = useContext(SuspenseConsultContext);
  const records: ISuspenseUpdate[] = update || [];
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: Column[] = [
    { $key: "tipoNovedadId", $header: "Tipo de novedad" },
    {
      $key: "fechaInicio",
      $header: "Fecha inicio",
      $format: (value) => (value == null ? "" : formatDate(value)),
    },
    {
      $key: "fechaFin",
      $header: "Fecha fin",
      $format: (value) => (value == null ? "" : formatDate(value)),
    },
  ];
 
  const handleItemsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const fetchUpdate = async () => {

    setIsLoading(true);
    setErrorMessage("");
    

    if (suspense[0].rezagoId) {
      try {

        const payload: ISuspenseUpdatePayload = {

          rezagoId: suspense[0]?.rezagoId,
          page: {
            page: page,
            size: pageSize,
          },
        };       
          
          const suspenseUpdate = (await suspenseUpdatePost(payload)) as ISuspenseUpdateResponse;

          if (suspenseUpdate?.status?.statusCode === 200) {
            const  listaRezagoNovedadResponseDto  = suspenseUpdate.data.listaRezagoNovedadResponseDto;

            if (listaRezagoNovedadResponseDto?.length > 0) {
              // const formattedAccounts = transformAccountData(listaRezagoNovedadResponseDto);
              setUpdate(listaRezagoNovedadResponseDto);
              // setData(formattedAccounts);
              // const dataTemp = data;
            } else {
              setErrorMessage(
                "Los parámetros de consulta no generan información"
              );
              // setCuentaId(null);
            }
          } else {
            setErrorMessage("Los parámetros de consulta no generan información");
          //   setCuentaId(null);
          }      

      } catch (error) {
        console.error("Error en fetchAccount:", error);
        setErrorMessage("Ocurrió un error al realizar la consulta de novedades por rezago");
      //   setCuentaId(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    
    if (suspense) {
      fetchUpdate();
    }
  }, [suspense]);

  useEffect(() => {
    setPage(1);
  }, []);

  const SuspenseDetailUpdateViewProps: SuspenseDetailUpdateViewProps = {
    columns,
    page,
    records,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    setPage,
    handleItemsPerPageChange,
  };
  
  return (
    <BaseTable {...SuspenseDetailUpdateViewProps} />
  );
};
