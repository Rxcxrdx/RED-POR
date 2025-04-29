import React, { useContext, useEffect, useState } from "react";
import { useForm } from "@mantine/form";

import {
  fieldMappingContribution,
  fieldMappingContributionDetail,
} from "@/common/constants";
import { getFileName, saveFile } from "@/common/utils";
import { AffiliateAccountContext } from "@/context";
import {
  contributionDetailPost,
  contributionPost,
  movementsPost,
} from "@/services";

import {
  ContributionFilterFormValues,
  IAporte,
  IAporteDetalle,
  IContributionDetailResponse,
  IContributionPayload,
  IContributionTotalDetailsResponse,
} from "./IContribution";

import { ContributionView } from "./ContributionView";

const Contribution: React.FC = () => {
  const { cuentaId } = useContext(AffiliateAccountContext);

  const [contributionData, setContributionData] = useState<IAporte[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElementsDatail, setTotalElementsDatail] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<IAporte | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<
    IContributionDetailResponse["data"] | null
  >(null);
  const [totalDetailsData, setTotalDetailsData] = useState<
    IContributionTotalDetailsResponse["data"] | null
  >(null);
  const [movementsData, setMovementsData] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [consultError, setConsultError] = useState<string>("");
  const [detailError, setDetailError] = useState<string>("");
  const [movementsError, setMovementsError] = useState<string>("");

  const filterFormContribution = useForm<ContributionFilterFormValues>({
    initialValues: {
      periodoPago: "",
      periodoPagoFin: "",
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

    const { periodoPago, idDisponible, periodoPagoFin, tipoMovimiento } =
      filterFormContribution.values;

    const payload: IContributionPayload = {
      cuentaId: cuentaId,
      periodoPago: periodoPago ? periodoPago.replace(/-/g, "") : periodoPago,
      cuentaAporteId: null,
      idDisponible: idDisponible === "All" ? "" : idDisponible,
      periodoPagoFin: periodoPagoFin
        ? periodoPagoFin.replace(/-/g, "")
        : periodoPagoFin,
      tipoMovimiento: tipoMovimiento === "All" ? "" : tipoMovimiento,
      page: {
        page: page - 1,
        size: pageSize,
      },
    };

    try {
      const response = await contributionPost(payload);

      const statusCode = response?.status?.statusCode;
      const statusDescription = response?.status?.statusDescription;

      if (response && response.data && response.data.aporte) {
        const contribution = response.data.aporte;
        const contributionConUniqueId = contribution.map((aporte, index) => ({
          ...aporte,
          uniqueId: `${aporte.cuentaId ?? "concepto"}-${index}`,
        }));

        setContributionData(contributionConUniqueId);
        setTotalRecords(response.data.page.totalElement);
        setTotalPages(response.data.page.totalPage + 1);
      } else if (statusCode === 206) {
        setContributionData([]);
        setErrorMessage(
          statusDescription ||
            "No hay información para los criterios seleccionados."
        );
      } else if (statusCode === 400) {
        setContributionData([]);
        setErrorMessage(statusDescription || "Error en los datos enviados.");
      } else {
        console.error(
          "No se encontraron contribution en la respuesta:",
          response
        );
        setContributionData([]);
        setErrorMessage(statusDescription || "Error en los datos enviados.");
      }
    } catch (error) {
      console.error("Error al llamar al servicio:", error);
      setContributionData([]);
      setErrorMessage("Error al consultar aportes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultDetail = async () => {
    if (!selectedRecord) return;

    setIsLoadingDetail(true);
    setShowDetail(true);
    setDetailError("");
    setMovementsError("");

    try {
      const [detailResponse, movementsResponse] = (await Promise.all([
        contributionDetailPost({
          cuentaAporteId: selectedRecord.cuentaAporteId,
          cuentaId: selectedRecord.cuentaId,
          page: {
            page: 0,
            size: 50,
          },
        }),
        movementsPost({
          cuentaId: selectedRecord.cuentaId,
          cuentaAporteId: selectedRecord.cuentaAporteId,
          periodoPago: null,
          periodoPagoFin: null,
          conceptoId: null,
          codigoOperacionId: null,
          page: { page: 0, size: 100 },
        }),
      ])) as [any, any];

      if (!detailResponse?.data && !movementsResponse?.data) {
        throw new Error("Error global en la consulta");
      }

      setDetailData(detailResponse?.data || null);
      setMovementsData(movementsResponse?.data?.movimiento || []);

      if (!detailResponse?.data) {
        setDetailError("Error al obtener detalles del aporte");
      }
      if (!movementsResponse?.data) {
        setMovementsError("Error al obtener movimientos");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al obtener los datos");
      setShowDetail(false);
      setSelectedRecord(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDownloadTotalContributions = async () => {
    if (!cuentaId) return;

    setIsLoading(true);
    setConsultError("");

    try {
      const [consultResponse] = (await Promise.all([
        contributionDetailPost({
          cuentaAporteId: null,
          cuentaId: cuentaId,
          page: { page: 0, size: 20 },
        }),
      ])) as [any];

      if (!consultResponse?.data?.page?.totalElement) {
        throw new Error("Error al obtener el total de registros");
      } else {
        setTotalElementsDatail(
          consultResponse?.data?.page?.totalElement || null
        );
      }

      if (!consultResponse?.data) {
        setConsultError("Error al obtener detalles del aporte");
      }

      const [fullResponse] = (await Promise.all([
        contributionDetailPost({
          cuentaAporteId: null,
          cuentaId: cuentaId,
          page: {
            page: 0,
            size: consultResponse?.data?.page?.totalElement,
          },
        }),
      ])) as [any];

      if (fullResponse?.data?.aporte) {
        setTotalDetailsData(fullResponse?.data || null);
        const renamedAndReorderedData = renameAndReorderFields(
          fullResponse.data.aporte,
          "ContributionDetail"
        );
        const filename = getFileName("Detalles-Aportes", "Cuenta-Id", cuentaId);
        saveFile(renamedAndReorderedData, filename);
      }
    } catch (error) {
      console.error("Error:", error);
      setConsultError("Error al obtener los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadContributions = async () => {
    if (!cuentaId) {
      setConsultError("No se ha seleccionado una cuenta.");
      return;
    }

    setIsLoading(true);
    setConsultError("");

    try {
      const { periodoPago, idDisponible, periodoPagoFin, tipoMovimiento } =
        filterFormContribution.values;

      const payload: IContributionPayload = {
        cuentaId: cuentaId,
        periodoPago: periodoPago ? periodoPago.replace(/-/g, "") : periodoPago,
        cuentaAporteId: null,
        idDisponible: idDisponible,
        periodoPagoFin: periodoPagoFin
          ? periodoPagoFin.replace(/-/g, "")
          : periodoPagoFin,
        tipoMovimiento: tipoMovimiento,
        page: {
          page: 0,
          size: totalRecords,
        },
      };

      const response = await contributionPost(payload);

      if (response?.data.aporte) {
        const renamedAndReorderedData = renameAndReorderFields(
          response.data.aporte,
          "Contribution"
        );
        const filename = getFileName("Aportes", "Cuenta-Id", cuentaId);
        saveFile(renamedAndReorderedData, filename);
      } else {
        setConsultError("No se encontraron aportes.");
      }
    } catch (error) {
      setConsultError("Error al descargar los aportes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentaId, page, pageSize]);

  const handleFilterSubmit = () => {
    setPage(1);
    fetchContributionData();
  };

  const handleFilterReset = () => {
    filterFormContribution.reset();
    setPage(1);
  };

  const handleBackToContributions = () => {
    setShowDetail(false);
    setDetailData(null);
    setMovementsData([]);
    setSelectedRecord(null);
    setErrorMessage("");
  };

  const renameAndReorderFields = <T extends IAporte | IAporteDetalle>(
    data: T[],
    type: string
  ) => {
    const fieldMapping =
      data.length > 0 && type === "Contribution"
        ? fieldMappingContribution
        : fieldMappingContributionDetail;

    return data.map((item) => {
      const newItem: { [key: string]: any } = {};
      Object.keys(fieldMapping).forEach((key) => {
        if (key in item) {
          newItem[fieldMapping[key]] = item[key as keyof T];
        }
      });
      return newItem;
    });
  };

  const contributionViewProps = {
    setPage,
    setPageSize,
    setSelectedRecord,
    handleFilterReset,
    handleFilterSubmit,
    handleConsultDetail,
    handleBackToContributions,
    handleDownloadContributions,
    handleDownloadTotalContributions,
    cuentaId,
    page,
    pageSize,
    isLoading,
    detailData,
    totalDetailsData,
    showDetail,
    totalPages,
    detailError,
    errorMessage,
    totalRecords,
    movementsData,
    movementsError,
    selectedRecord,
    isLoadingDetail,
    contributionData,
    filterFormContribution,
  };

  return <ContributionView {...contributionViewProps} />;
};

export { Contribution };
