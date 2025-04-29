"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { conceptsGet, movementsPost } from "@/services";
import { AffiliateAccountContext } from "@/context";
import { MovementsView } from "./MovementsView";
import {
  IMovimiento,
  IMovementsPayload,
  IMovementsResponse,
} from "./IMovements";
import { getFileName, saveFile } from "@/common/utils";

const Movements: React.FC = () => {
  const { cuentaId } = useContext(AffiliateAccountContext);

  const [movimientosData, setMovimientosData] = useState<IMovimiento[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDownloadMessage, setErrorDownloadMessage] = useState<string>("");
  const [conceptOptions, setConceptOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const filterFormMovements = useForm<any>({
    initialValues: {
      periodoPago: "",
      conceptoId: null,
      periodoPagoFin: "",
      tipoMovimiento: null,
    },
  });

  const fieldMappingMovement: { [key: string]: string } = {
    periodoPago: "Periodo",
    fechaPago: "Fecha de pago",
    fechaCreacion: "Fecha acreditación",
    debitoPesos: "Débito pesos",
    debitoUnidades: "Débito unidades",
    creditoPesos: "Créditos pesos",
    creditoUnidades: "Crédito unidades",
    fondoID: "Fondo",
    afectaSaldo: "Afecta saldo",
    salarioBaseCal: "IBC calculado",
    salarioBase: "IBC informado",
    nitPago: "Id Empleador",
    razonSocial: "Razón social",
    descripcionOperacion: "Operación",
    descripcionConcepto: "Concepto",
    idDisponible: "Disponible",
    cuentaMovimientoId: "ID movimiento",
    idMovimientoOrigen: "ID origen",
    idMovimientoDestino: "ID relacionado",
    cuentaAporteId: "ID aportes",
    fechaOperacion: "Fecha operación",
    encabezadoPlanillaId: "Número de planilla",
    depositoId: "Deposito id",
    usuarioCreacion: "Usuario de creación",
    secuencia: "Secuencia",
    tipoCotizanteId: "Tipo de cotizante",
    diasInformado: "Días informados",
    diasCalculado: "Días calculados",
    retencionContingente: "Retención informada",
    codigoAFP: "AFP no vinculado entrada",
    fechaPagoOtroFondo: "Fecha de pago otro fondo",
    casoId: "Caso id",
    numeroAsientoId: "Asiento id",
  };

  const fetchMovementsData = async () => {
    if (!cuentaId) {
      setMovimientosData([]);
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const { periodoPago, conceptoId, periodoPagoFin, tipoMovimiento } =
      filterFormMovements.values;

    const payload: IMovementsPayload = {
      cuentaId: cuentaId,
      periodoPago: periodoPago ? periodoPago.replace(/-/g, "") : null,
      periodoPagoFin: periodoPagoFin ? periodoPagoFin.replace(/-/g, "") : null,
      conceptoId: conceptoId === "" ? null : conceptoId,
      tipoMovimiento: tipoMovimiento === "All" ? "" : tipoMovimiento,
      inversionId: null,
      codigoOperacionId: null,
      cuentaAporteId: null,
      page: { page: page - 1, size: pageSize },
    };

    try {
      const response = (await movementsPost(payload)) as IMovementsResponse;

      const { statusCode, statusDescription } = response.status;

      if (response?.data?.movimiento) {
        const { movimiento: movements } = response.data;

        const movimientosConUniqueId = movements.map((movimiento, index) => ({
          ...movimiento,
          uniqueId: `${movimiento.periodoPago}-${index}`,
        }));

        setMovimientosData(movimientosConUniqueId);
        setTotalRecords(response.data.page.totalElement);
        setTotalPages(response.data.page.totalPage + 1);
      } else if (statusCode === 206) {
        setMovimientosData([]);
        setErrorMessage(
          statusDescription ||
            "No hay información para los criterios seleccionados."
        );
      } else if (statusCode === 400) {
        setMovimientosData([]);
        setErrorMessage(statusDescription || "Error en los datos enviados.");
      } else {
        console.error(
          "No se encontraron movimientos en la respuesta:",
          response
        );
        setMovimientosData([]);
        setErrorMessage(statusDescription || "Error en los datos enviados.");
      }
    } catch (error) {
      console.error("Error al llamar al servicio:", error);
      setMovimientosData([]);
      setErrorMessage("Error al consultar movimientos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadMovements = async () => {
    if (!cuentaId) {
      setErrorDownloadMessage("No se ha seleccionado una cuenta.");
      return;
    }

    setIsLoading(true);
    setErrorDownloadMessage("");

    try {
      const { periodoPago, conceptoId, periodoPagoFin, tipoMovimiento } =
        filterFormMovements.values;

      const payload: IMovementsPayload = {
        cuentaId: cuentaId,
        periodoPago: periodoPago ? periodoPago.replace(/-/g, "") : null,
        periodoPagoFin: periodoPagoFin
          ? periodoPagoFin.replace(/-/g, "")
          : null,
        conceptoId: conceptoId === "" ? null : conceptoId,
        tipoMovimiento: tipoMovimiento,
        inversionId: null,
        codigoOperacionId: null,
        cuentaAporteId: null,
        page: { page: page - 1, size: totalRecords },
      };

      const response = (await movementsPost(payload)) as IMovementsResponse;

      if (response.data.movimiento) {
        const renamedAndReorderedData = renameAndReorderFields(
          response.data.movimiento
        );
        const filename = getFileName("Movimientos", "Cuenta-Id", cuentaId);
        saveFile(renamedAndReorderedData, filename);
      } else {
        setErrorDownloadMessage("No se encontraron movimientos.");
      }
    } catch (error) {
      setErrorDownloadMessage("Error al descargar los movimientos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchConcepts = async () => {
      const response = (await conceptsGet()) as any;
      if (response?.data?.concept) {
        const options = response.data.concept.map((concept: any) => ({
          value: concept.conceptId,
          label: concept.descripcionLarga,
        }));
        setConceptOptions([{ value: "", label: "Todos" }, ...options]);
      }
    };
    fetchConcepts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [cuentaId]);

  useEffect(() => {
    fetchMovementsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentaId, page, pageSize]);

  const handleFilterSubmit = () => {
    fetchMovementsData();
    setPage(1);
  };

  const handleFilterReset = () => {
    filterFormMovements.reset();
  };

  const renameAndReorderFields = (data: IMovimiento[]) => {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {};
      Object.keys(fieldMappingMovement).forEach((key) => {
        if (key in item) {
          newItem[fieldMappingMovement[key]] = item[key as keyof IMovimiento];
        }
      });
      return newItem;
    });
  };

  const MovimientosViewProps = {
    setPage,
    setPageSize,
    handleFilterReset,
    handleFilterSubmit,
    handleDownloadMovements,
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    conceptOptions,
    movimientosData,
    filterFormMovements,
  };

  return <MovementsView {...MovimientosViewProps} />;
};

export { Movements };
