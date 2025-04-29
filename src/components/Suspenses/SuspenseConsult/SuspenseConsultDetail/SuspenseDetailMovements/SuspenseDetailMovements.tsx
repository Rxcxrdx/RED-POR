import React, { useContext, useEffect, useState } from "react";
import {
  ISuspenseMovement,
  ISuspenseMovementsPayload,
  ISuspenseMovementsResponse,
} from "./ISuspenseDetailMovements";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { suspenseMovementsPost } from "@/services/suspenses";
import { CURRENCY_FORMATTER, formatDate, getFileName, saveFile } from "@/common/utils";
import { fieldMappingSuspenseMovements } from "@/common/constants";
import { BaseTable } from "@/components/SharedComponent/BaseTable";
import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";

interface SuspenseDetailMovementsViewProps {
  columns: Column[];
  page: number;
  records: ISuspenseMovement[];
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  downloadable?: boolean;
  titleButtonDownload: string;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
  handleDownload: () => void;
}

export const SuspenseDetailMovements: React.FC = () => {

  const { suspense, movements, setMovements } = useContext(SuspenseConsultContext);
  const records: ISuspenseMovement[] = movements || [];
  const downloadable = true;
  const titleButtonDownload = "Descargar movimientos";
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");


  const columns: Column[] = [
    { $key: "codigoOperacionId", $header: "Concepto operación" },
    {
      $key: "fechaCreacion",
      $header: "Fecha acreditación",
      $format: (value) => (value == null ? "" : formatDate(value)),
    },
    {
      $key: "salarioBase",
      $header: "IBC calculado",
      $format: (value) => CURRENCY_FORMATTER.format(value),
    },
    {
      $key: "valorPesos",
      $header: "Debito pesos",
      $format: (value) => CURRENCY_FORMATTER.format(value),
    },
    {
      $key: "numeroUnidades",
      $header: "Debito unidades",
      $format: (value) => CURRENCY_FORMATTER.format(value),
    },
    {
      $key: "valorPesosHistorico",
      $header: "Crédito pesos",
      $format: (value) => CURRENCY_FORMATTER.format(value),
    },
    {
      $key: "numeroUnidadesHistorico",
      $header: "Crédito unidades",
      $format: (value) => CURRENCY_FORMATTER.format(value),
    },
    { $key: "porcentaje", $header: "Porcentaje" },
    {
      $key: "fechaOperacion",
      $header: "Fecha operación",
      $format: (value) => (value == null ? "" : formatDate(value)),
    },
    { $key: "rezagoMovimientoId", $header: "id movimiento" },
    { $key: "idDisponible", $header: "Disponible" },
    {
      $key: "fechaGiro",
      $header: "Fecha giro",
      $format: (value) => (value == null ? "" : formatDate(value)),
    },
    {
      $key: "idBeneficiario",
      $header: "Id beneficiario",
      $render: (record: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record?.idBeneficiario || " "}
        </div>
      ),
    },
    { $key: "diasInformado", $header: "Días informados" },
    { $key: "diasCalculado", $header: "Días calculados" },
    { $key: "casoId", $header: "Caso id" },
    { $key: "numeroAsientoId", $header: "Asiento id" },
  ];

  const handleItemsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const fetchMovements = async () => {
    setIsLoading(true);
    setErrorMessage("");
  
    if (suspense && suspense[0]?.rezagoId) { // Verificación adicional
      try {
        const payload: ISuspenseMovementsPayload = {
          rezagoId: suspense[0]?.rezagoId,
          page: {
            page: page,
            size: pageSize,
          },
        };
  
        const suspenseMovements = (await suspenseMovementsPost(payload)) as ISuspenseMovementsResponse;
  
        if (suspenseMovements?.status?.statusCode === 200) {
          const listaRezagoMovimientoResponseDto = suspenseMovements.data.listaRezagoMovimientoResponseDto;
  
          if (listaRezagoMovimientoResponseDto?.length > 0) {
            setMovements(listaRezagoMovimientoResponseDto);
            setTotalRecords(suspenseMovements.data.page.totalElement);
          } else {
            setErrorMessage("Los parámetros de consulta no generan información");
          }
        } else {
          setErrorMessage("Los parámetros de consulta no generan información");
        }
      } catch (error) {
        console.error("Error en fetchMovements:", error);
        setErrorMessage("Ocurrió un error al realizar la consulta de novedades por rezago");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("No se ha seleccionado un rezago.");
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!suspense || !suspense[0]?.rezagoId) { // Verificación adicional
      setErrorMessage("No se encontraron movimientos del rezago.");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const payload: ISuspenseMovementsPayload = {
        rezagoId: suspense[0]?.rezagoId,
        page: {
          page: page,
          size: totalRecords,
        },
      };
  
      const suspenseMovements = (await suspenseMovementsPost(payload)) as ISuspenseMovementsResponse;
  
      if (suspenseMovements.data.listaRezagoMovimientoResponseDto) {
        const renamedAndReorderedData = renameAndReorderFields(
          suspenseMovements.data.listaRezagoMovimientoResponseDto
        );
        const filename = getFileName("Rezago-movimientos", "RezagoId", suspense[0]?.rezagoId);
        saveFile(renamedAndReorderedData, filename);
      } else {
        setErrorMessage("No se encontraron movimientos del rezago.");
      }
    } catch (error) {
      setErrorMessage("Error al descargar los movimientos.");
    } finally {
      setIsLoading(false);
    }
  };
  const renameAndReorderFields = (data: ISuspenseMovement[]) => {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {};
      Object.keys(fieldMappingSuspenseMovements).forEach((key) => {
        if (key in item) {
          newItem[fieldMappingSuspenseMovements[key]] = item[key as keyof ISuspenseMovement];
        }
      });
      return newItem;
    });
  };

  useEffect(() => {
    if (suspense) {
      fetchMovements();
    }
  }, [suspense]);

  useEffect(() => {
    setPage(1);
  }, []);

  const SuspenseDetailMovementsViewProps: SuspenseDetailMovementsViewProps = {
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
    handleDownload,
    downloadable,
    titleButtonDownload,
  };
  
  return (
    <BaseTable {...SuspenseDetailMovementsViewProps} />
  );
};
