import React, { useContext, useEffect, useState } from "react";
import {
  ISuspense,
} from "../../SuspenseConsultFormView/ISuspenseConsultForm";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { BaseTable } from "@/components/SharedComponent/BaseTable";
import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";
import { formatCurrency } from "@/common/utils";

interface SuspenseDetailDataOriginTableViewProps {
  columns: Column[];
  page: number;
  records: ISuspense[];
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
}

export const SuspenseDetailDataOriginTable: React.FC = () => {

  const { suspense } = useContext(SuspenseConsultContext);
  const records: ISuspense[] = suspense || [];
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: Column[] = [
    { $key: "tipoIdDetalle", $header: "Tipo id afiliado"},
    { $key: "numeroIdDetalle",$header: "Id. afiliado"},
    { $key: "primerApellido", $header: "Primer apellido" },
    { $key: "segundoApellido", $header: "Segundo apellido" },
    { $key: "primerNombre", $header: "Primer nombre" },
    { $key: "segundoNombre", $header: "Segundo nombre" },
    { $key: "tipoCotizanteId", $header: "Tipo cotizante" },
    { $key: "tipoRecaudo", 
      $header: "Tipo recaudo",
      $render: (record: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record?.tipoRecaudo || "-"}
        </div>
      ),
     },
    { $key: "subtipoRecaudo", 
      $header: "Subtipo recaudo",
      $render: (record: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record?.subtipoRecaudo || "-"}
        </div>
      ), },
    { $key: "saldoPesos", 
      $header: "Valor aporte", 
      $format: (value) => formatCurrency(value) },
    { $key: "encabezadoPlanillaId", $header: "Planilla" },    
    { $key: "secuencia", $header: "Secuencia" },     
    { $key: "archivoId", 
      $header: "Archivo Id",
      $render: (record: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record?.archivoId || " "}
        </div>
      ), },  
    { $key: "tipoIdNitPago", $header: "Tipo id empleador" },
    { $key: "nitPago", $header: "Id. empleador" },
    { $key: "razonSocial", 
      $header: "Razón social",        
      $render: (record: any) => (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {record?.razonSocial || "-"}
      </div>
    ), },          
  ];
 
  const handleItemsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, []);

  // useEffect(() => {
  //   setTotalRecords(suspense);
  // }, [suspense]);  

  const SuspenseDetailDataOriginTableViewProps: SuspenseDetailDataOriginTableViewProps = {
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
    <BaseTable {...SuspenseDetailDataOriginTableViewProps} />
  );
};
