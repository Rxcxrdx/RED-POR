import React, { useContext, useEffect, useState } from "react";

import { AffiliateAccountContext } from "@/context";
import {
  BoxMessage,
  CustomCard,
  Loader,
  UserDetail,
} from "@/components/common";
import { TabsWithLogic } from "@/components/SharedComponent/";

import { Movements, Contribution, Balance, Validity } from "../../index";

import { formatUserDetail } from "./ConsultResult.common";

export const ConsultResult = () => {
  const tabElements = [
    { id: "contribution", $title: "Aportes", component: <Contribution /> },
    { id: "movements", $title: "Movimientos", component: <Movements /> },
    { id: "balance", $title: "Saldos", component: <Balance /> },
    { id: "validity", $title: "Vigencias", component: <Validity /> },
  ];

  const {
    cuentaId: accountId,
    userDetail,
    accountData,
  } = useContext(AffiliateAccountContext);

  const saldo =
    accountData && accountData.length > 0 ? accountData[0].saldo : undefined;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchData = () => {
    if (!accountId) {
      setErrorMessage("No se ha seleccionado una cuenta.");
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    fetchData();
  }, [accountId]);

  return (
    <>
      <Loader isLoading={isLoading} />
      {errorMessage && <BoxMessage title={errorMessage} />}
      {!errorMessage && (
        <>
          <UserDetail
            userInformation={formatUserDetail(userDetail)}
            saldo={saldo}
          />
          <CustomCard style={{ margin: "16px 0" }}>
            <TabsWithLogic tabElements={tabElements} />
          </CustomCard>
        </>
      )}
    </>
  );
};
