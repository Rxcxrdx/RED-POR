import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { contributionPost } from "@/services";
import { DepositAccountTransferContext } from "@/context";
import {
  IAporte,
  IContributionPayload,
  IContributionResponse,
  ContributionFilterFormValues,
} from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";

import { DepositAccountContributionView } from "./DepositAccountContributionView";
import { formatPeriodForService } from "@/common/utils";

interface ContributionViewProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  contributionData: IAporte[];
  selectedRecord: any[] | null;
  filterFormContribution: ReturnType<
    typeof useForm<ContributionFilterFormValues>
  >;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  handleSelectionChange: (selectedRows: any[]) => void;
}

export const DepositAccountContribution: React.FC = () => {
  const { cuentaId, setSelectedContributions } = useContext(
    DepositAccountTransferContext
  );

  const [contributionData, setContributionData] = useState<IAporte[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any[] | null>(null);

  const filterFormContribution = useForm<ContributionFilterFormValues>({
    mode: "onChange",
    defaultValues: {
      periodoPago: null,
      periodoPagoFin: null,
      idDisponible: null,
      tipoMovimiento: null,
    },
  });

  const fetchContributionData = async () => {
    if (!cuentaId) {
      setPage(1);
      setContributionData([]);
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { periodoPago, idDisponible, periodoPagoFin, tipoMovimiento } =
        filterFormContribution.getValues();

      const payload: IContributionPayload = {
        cuentaId,
        periodoPago: formatPeriodForService(periodoPago),
        periodoPagoFin: formatPeriodForService(periodoPagoFin),
        cuentaAporteId: null,
        idDisponible: idDisponible === "All" ? "" : idDisponible,
        tipoMovimiento,
        page: {
          page: page - 1,
          size: pageSize,
        },
      };

      const response = (await contributionPost(
        payload
      )) as IContributionResponse;
      handleContributionResponse(response);
    } catch (error) {
      handleFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributionResponse = (response: IContributionResponse) => {
    const { status, data } = response;
    const { statusCode, statusDescription } = status;

    if (data?.aporte.length > 0) {
      const contributionConUniqueId = data.aporte.map((aporte, index) => ({
        ...aporte,
        uniqueId: `${aporte.cuentaId ?? "concepto"}-${index}`,
      }));

      setContributionData(contributionConUniqueId);
      setTotalRecords(data.page.totalElement);
      setTotalPages(data.page.totalPage + 1);
      return;
    }

    if (statusCode === 206) {
      resetContributionData("La consulta no generan datos");
      return;
    }

    if (statusCode === 400) {
      resetContributionData(
        "Los parámetros de consulta no generan información"
      );
      return;
    }

    if (!data?.aporte || data.aporte.length === 0) {
      console.error("No se encontraron aportes en la respuesta:", response);
      resetContributionData("La consulta no generan datos");
      return;
    }

    resetContributionData(statusDescription || "Error en los datos enviados");
  };

  const resetContributionData = (errorMsg: string) => {
    setContributionData([]);
    setTotalRecords(0);
    setTotalPages(0);
    setErrorMessage(errorMsg);
  };

  const handleFetchError = (error: unknown) => {
    console.error("Error al llamar al servicio:", error);
    resetContributionData("Error al consultar aportes");
  };

  const handleFilterSubmit = () => {
    setPage(1);
    fetchContributionData();
  };

  const handleFilterReset = () => {
    filterFormContribution.reset();
    setPage(1);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleSelectionChange = (selectedRows: any[]) => {
    if (selectedRows.length === 0) {
      setSelectedRecord(null);
      setSelectedContributions(null);
      return;
    }

    const selectedContributions: any[] = selectedRows.map((row) => ({
      cuentaAporteId: row.cuentaAporteId,
      cuentaId: row.cuentaId,
      fondoId: row.fondoId,
      tipoIdAportante: row.tipoIdAportante,
      numeroIdAportante: row.numeroIdAportante,
      codigoOperacionId: row.codigoOperacionId,
      fechaPago: row.fechaPago,
      idDisponible: row.idDisponible,
      tipoCotizanteId: row.tipoCotizanteId,
      periodoPago: row.periodoPago,
      encabezadoPlanillaId: row.encabezadoPlanillaId,
      secuencia: row.secuencia,
      depositoId: row.depositoId,
      salarioBase: row.salarioBase,
      salarioBaseCal: row.salarioBaseCal,
      diasInformado: row.diasInformado,
      diasCalculado: row.diasCalculado,
      codigoAfp: row.codigoAfp,
      fechaPagoOtroFondo: row.fechaPagoOtroFondo,
      usuarioCreacion: row.usuarioCreacion,
      fechaCreacion: row.fechaCreacion,
      usuarioUltimaModificacion: row.usuarioUltimaModificacion,
      fechaUltimaModificacion: row.fechaUltimaModificacion,
      listaDetalles: null,
    }));

    setSelectedRecord(selectedContributions);
    setSelectedContributions(selectedContributions);
  };

  useEffect(() => {
    setPage(1);
  }, [cuentaId]);

  useEffect(() => {
    fetchContributionData();
  }, [cuentaId, page, pageSize]);

  const depositAccountContributionViewProps: ContributionViewProps = {
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    selectedRecord,
    contributionData,
    filterFormContribution,
    setPage,
    handleFilterReset,
    handleFilterSubmit,
    handleSelectionChange,
    handleItemsPerPageChange,
  };

  return (
    <DepositAccountContributionView {...depositAccountContributionViewProps} />
  );
};
