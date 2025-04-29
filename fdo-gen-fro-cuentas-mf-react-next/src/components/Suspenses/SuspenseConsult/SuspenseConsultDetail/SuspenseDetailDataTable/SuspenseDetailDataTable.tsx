import React, { useContext, useEffect, useState } from "react";
import {
  ISuspense,
} from "../../SuspenseConsultFormView/ISuspenseConsultForm";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { BaseTable } from "@/components/SharedComponent/BaseTable";
import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";
import { formatCurrency } from "@/common/utils";

interface SuspenseDetailDatatableViewProps {
  columns: Column[];
  page: number;
  records: ISuspense[];
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  setPage: (page: number) => void;
}

export const SuspenseDetailDataTable: React.FC = () => {

  const { suspense, setSuspense } = useContext(SuspenseConsultContext);
  const [records, setRecords] = useState<ISuspense[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: Column[] = [
    { $key: "rezagoId", $header: "Folio rezago"},
    {
      $key: "tipoRezagoId",
      $header: "Tipo rezago",
    },
    { $key: "causalRezagoId", $header: "Causal rezago" },
    { $key: "saldoPesos", 
      $header: "Valor rezago", 
      $format: (value) => formatCurrency(value) },
    {
      $key: "periodoPago",
      $header: "Periodo",
    },
    {
      $key: "tipoIdDetalle",
      $header: "Tipo id afiliado",
    },
    {
      $key: "numeroIdDetalle",
      $header: "Id. afiliado",
    },
    { $key: "primerApellido", $header: "Primer apellido" },
    { $key: "segundoApellido", $header: "Segundo apellido" },
    { $key: "primerNombre", $header: "Primer nombre" },
    { $key: "segundoNombre", $header: "Segundo nombre" },
    { $key: "tipoIdNitPago", $header: "Tipo id empleador" },
    { $key: "nitPago", $header: "Id. empleador" },
    { $key: "fechaPago", $header: "Fecha pago" },
    { $key: "estadoLevante", $header: "Levante" },
    { $key: "indicadorCongelamiento", $header: "Congelado" },            
  ];

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    setRecords(suspense);
  } , [suspense]);

  const SuspenseDetailDatatableViewProps: SuspenseDetailDatatableViewProps = {
    columns,
    page,
    records,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    setPage,
  };
  
  return (
    <BaseTable {...SuspenseDetailDatatableViewProps} />
  );
};
