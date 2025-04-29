"use client";
import React, { useContext, useEffect, useState } from "react";

import { BoxMessage, Loader } from "@/components";
import { AffiliateAccountContext } from "@/context";
import { getValidityService } from "@/services";

import { ValidityView } from "./ValidityView";

export const Validity = () => {
  const { cuentaId: accountId } = useContext(AffiliateAccountContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validityData, setValidityData] = useState([]);

  const fetchValidityData = async () => {
    if (!accountId) {
      setValidityData([]);
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getValidityService(accountId);
      const { vigencias } = response?.data;

      if (vigencias) {
        setValidityData(vigencias);
      }
    } catch (error) {
      setValidityData([]);
      setErrorMessage("Error al consultar vigencias.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidityData();
  }, [accountId]);

  if (errorMessage) {
    return <BoxMessage errorMessage={errorMessage} />;
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      <ValidityView validityData={validityData} />
    </>
  );
};
