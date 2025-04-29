"use client";

import React, { useContext, useEffect, useState } from "react";
import { TransferSuspenseContext } from "@/context";
import { useForm } from "react-hook-form";

import { TransferSuspenseLaggingParametersView } from "./TransferSuspenseLaggingParametersView";

interface TransferSuspenseCaseApplicationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  errorMessage: string;
  contributionData: any[];
  selectedRecord: any | null;
  filterFormContribution: ReturnType<typeof useForm<any>>;
  setPage: (page: number) => void;
  handleItemsPerPageChange: (newSize: number) => void;
  handleFilterReset: () => void;
  handleFilterSubmit: () => void;
  setSelectedRecord: (record: any | null) => void;
}

export const TransferSuspenseLaggingParameters: React.FC = () => {
  
  const { cuentaId } = useContext(TransferSuspenseContext);

  const [contributionData, setContributionData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const filterFormCaseApplication = useForm<laggingParametersFormValues>({
    mode: "onChange",
    defaultValues: {
      numeroCaso: "",
      tipoRequerimiento: "",
      numeroTareaCRM: "",
      radicadoJuzgado: "",
      relacionadoCon: "",
      documentoSoporte: "",
      observacion: "",
      tipoCausal: "",
    },
  });

  const fetchContributionData = async () => {};

  const handleFetchError = (error: unknown) => {
    console.error("Error al llamar al servicio:", error);
    resetContributionData("Error al consultar aportes.");
  };

  const resetContributionData = (errorMsg: string) => {
    setContributionData([]);
    setErrorMessage(errorMsg);
  };

  const handleFilterSubmit = () => {
  };

  const handleFilterReset = () => {
    filterFormCaseApplication.reset();
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [cuentaId]);

  useEffect(() => {
    fetchContributionData();
  }, [cuentaId, page, pageSize]);

  const caseApplicationViewProps: any = {
    page,
    pageSize,
    totalPages,
    totalRecords,
    isLoading,
    errorMessage,
    contributionData,
    selectedRecord,
    filterFormCaseApplication: filterFormCaseApplication,
    setPage,
    setPageSize: handleItemsPerPageChange,
    handleFilterReset,
    handleFilterSubmit,
    setSelectedRecord,
  };

  return (
    <TransferSuspenseLaggingParametersView {...caseApplicationViewProps} />
  );
};
