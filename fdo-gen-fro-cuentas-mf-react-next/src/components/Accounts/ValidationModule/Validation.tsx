import React, { useEffect, useState } from "react";

import { Toast } from "pendig-fro-transversal-lib-react";

import { BoxMessage, Loader, UserDetailContainer } from "@/components";
import { AffiliateAccountContext } from "@/context";
import { ValidationView } from "./ValidationView";

export const Validation = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkUserData = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    Toast.init();
    checkUserData();
  }, []);

  if (errorMessage) {
    return <BoxMessage errorMessage={errorMessage} />;
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      <UserDetailContainer ContextProvider={AffiliateAccountContext} />
      <ValidationView />
    </>
  );
};
