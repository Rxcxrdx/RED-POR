"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { contributionPost } from "@/services";
import { TransferSuspenseContext } from "@/context";
import {
  IAporte,
  IContributionPayload,
  IContributionResponse,
  ContributionFilterFormValues,
} from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";

import { TransferSuspenseContributionView } from "./TransferSuspenseContributionView";
import { SelectedContribution } from "./ITransferSuspenseContribution";
import { formatPeriodForService } from "@/common/utils";

interface ContributionViewProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  contributionData: IAporte[];
  selectedRecord: SelectedContribution[] | null;
  filterFormContributionTransferSuspense: ReturnType<
    typeof useForm<ContributionFilterFormValues>
  >;
  setPage: (page: number) => void;
  handleItemsPerPageChangeTransferSuspense: (newSize: number) => void;
  handleFilterResetTransferSuspense: () => void;
  handleFilterSubmitTransferSuspense: () => void;
  handleSelectionChangeTransferSuspense: (selectedRows: any[]) => void;
}

const TransferSuspenseContribution: React.FC = () => {
  const { cuentaId, setSelectedContributions } = useContext(
    TransferSuspenseContext
  );

  const [contributionData, setContributionData] = useState<IAporte[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<
    SelectedContribution[] | null
  >(null);

  const filterFormContributionTransferSuspense =
    useForm<ContributionFilterFormValues>({
      mode: "onChange",
      defaultValues: {
        periodoPago: null,
        periodoPagoFin: null,
        idDisponible: null,
        tipoMovimiento: null,
      },
    });

  const fetchContributionDataTransferSuspense = async () => {
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
        filterFormContributionTransferSuspense.getValues();

      const payload: IContributionPayload = {
        cuentaId,
        periodoPago: formatPeriodForService(periodoPago),
        periodoPagoFin: formatPeriodForService(periodoPagoFin),
        cuentaAporteId: null,
        idDisponible: idDisponible === "All" ? "" : idDisponible,
        tipoMovimiento: tipoMovimiento === "All" ? "" : tipoMovimiento,
        page: {
          page: page - 1,
          size: pageSize,
        },
      };

      const response = (await contributionPost(
        payload
      )) as IContributionResponse;
      handleContributionResponseTransferSuspense(response);
    } catch (error) {
      handleFetchErrorTransferSuspense(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributionResponseTransferSuspense = (
    response: IContributionResponse
  ) => {
    const { status, data } = response;
    const statusCode = status?.statusCode;
    const statusDescription = status?.statusDescription;

    if (data?.aporte && data.aporte.length > 0) {
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
      resetContributionDataTransferSuspense("La consulta no generan datos");
      return;
    }
    if (statusCode === 400) {
      resetContributionDataTransferSuspense(
        "Los parámetros de consulta no generan información"
      );
      return;
    }
    if (!data?.aporte || data.aporte.length === 0) {
      console.error("No se encontraron aportes en la respuesta:", response);
      resetContributionDataTransferSuspense("La consulta no generan datos");
      return;
    }

    resetContributionDataTransferSuspense(
      statusDescription || "Error en los datos enviados"
    );
  };

  const handleFetchErrorTransferSuspense = (error: unknown) => {
    console.error("Error al llamar al servicio:", error);
    resetContributionDataTransferSuspense("Error al consultar aportes");
  };

  const resetContributionDataTransferSuspense = (errorMsg: string) => {
    setContributionData([]);
    setTotalRecords(0);
    setTotalPages(0);
    setErrorMessage(errorMsg);
  };

  const handleFilterSubmitTransferSuspense = () => {
    setPage(1);
    fetchContributionDataTransferSuspense();
  };

  const handleFilterResetTransferSuspense = () => {
    filterFormContributionTransferSuspense.reset();
    setPage(1);
  };

  const handleItemsPerPageChangeTransferSuspense = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleSelectionChangeTransferSuspense = (selectedRows: any[]) => {
    if (selectedRows.length === 0) {
      setSelectedRecord(null);
      setSelectedContributions(null);
      return;
    }

    const selectedContributionsTransferSuspense: any[] = selectedRows.map(
      (row) => ({
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
      })
    );

    setSelectedRecord(selectedContributionsTransferSuspense);
    setSelectedContributions(selectedContributionsTransferSuspense);
  };

  useEffect(() => {
    setPage(1);
  }, [cuentaId]);

  useEffect(() => {
    fetchContributionDataTransferSuspense();
  }, [cuentaId, page, pageSize]);

  const contributionViewProps: ContributionViewProps = {
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    selectedRecord,
    contributionData,
    filterFormContributionTransferSuspense,
    setPage,
    handleFilterResetTransferSuspense,
    handleSelectionChangeTransferSuspense,
    handleFilterSubmitTransferSuspense,
    handleItemsPerPageChangeTransferSuspense,
  };

  return <TransferSuspenseContributionView {...contributionViewProps} />;
};

export { TransferSuspenseContribution };
