"use client";
import React, { useContext, useEffect, useState } from "react";

import { AffiliateAccountContext } from "@/context";
import { BoxMessage, Loader } from "@/components";
import { getBalanceByAccountNumber, getDispersionService } from "@/services";

import { BalanceView } from "./BalanceView";
import { DispersionView } from "./Dispersion/DispersionView";
import { IDispersion } from "./Dispersion/IDispersion";

export const Balance = () => {
  const { cuentaId: accountId, setBalanceData: setContextBalanceData } =
    useContext(AffiliateAccountContext);

  const [balanceData, setBalanceData] = useState([]);
  const [dispersionData, setDispersionData] = useState([]);
  const [currentDispersion, setCurrentDispersion] = useState<any>();
  const [historicDispersion, setHistoricDispersion] = useState<Array<any>>([]);

  const [balanceErrorMessage, setBalanceErrorMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dispersionErrorMessage, setDispersionErrorMessage] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBalanceData = async () => {
    if (!accountId) {
      setBalanceData([]);
      setContextBalanceData(null);
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setBalanceErrorMessage("");
    try {
      const response = await getBalanceByAccountNumber(accountId);
      if (response?.status?.statusCode === 200) {
        const { saldos: balances } = response.data;
        if (balances) {
          setBalanceData(balances);
          setContextBalanceData(balances);
        } else {
          setBalanceData([]);
          setContextBalanceData(null);
        }
      }
    } catch (error) {
      setBalanceData([]);
      setContextBalanceData(null);
      setBalanceErrorMessage("Error al consultar saldos.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDispersionData = async () => {
    if (!accountId) {
      setDispersionData([]);
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setDispersionErrorMessage("");
    try {
      const dispersionResponse = await getDispersionService(accountId);
      if (dispersionResponse?.status?.statusCode === 200) {
        const { dispersiones } = dispersionResponse.data;
        if (dispersiones) {
          setDispersionData(dispersiones);
        } else {
          setDispersionData([]);
        }
      }
    } catch (error) {
      setDispersionData([]);
      setDispersionErrorMessage("Error al consultar dispersiones.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accountId) {
      setBalanceData([]);
      setDispersionData([]);
      setContextBalanceData(null);
      setErrorMessage("No se ha seleccionado una cuenta.");
    } else {
      fetchBalanceData();
      fetchDispersionData();
    }
  }, [accountId]);

  useEffect(() => {
    setCurrentDispersion(
      dispersionData.find((item: IDispersion) => item.estado === "ACTIVO")
    );
    setHistoricDispersion(
      dispersionData.filter((item: IDispersion) => item.estado !== "ACTIVO")
    );
  }, [dispersionData]);

  if (errorMessage) {
    return <BoxMessage errorMessage={errorMessage} />;
  } else if (balanceErrorMessage) {
    return <BoxMessage errorMessage={balanceErrorMessage} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Loader isLoading={isLoading} />
      <BalanceView
        balanceData={balanceData}
        currentDispersion={currentDispersion}
      />
      <DispersionView historicDispersion={historicDispersion} />
    </div>
  );
};
