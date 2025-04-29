import React, { createContext, useState, FC, useRef, useCallback } from "react";

import {
  IAffiliateDetail,
  SelectedContribution,
  ITransferSuspenseContext,
  ITransferSuspenseProviderProps,
} from "./ITransferSuspenseContext";
import { UserDetailType } from "@/hooks/useAffiliateData/IuseAffiliateData";

export const TransferSuspenseContext = createContext<ITransferSuspenseContext>(
  {} as ITransferSuspenseContext
);

export const TransferSuspenseProvider: FC<ITransferSuspenseProviderProps> = ({
  children,
}) => {
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);
  const [affiliateDetail, setAffiliateDetail] =
    useState<IAffiliateDetail | null>(null);
  const [selectedContributions, setSelectedContributions] = useState<
    SelectedContribution[] | null
  >(null);
  const [currentTab, setCurrentTab] = useState<string>("affiliate");
  const [balanceData, setBalanceData] = useState<any[] | null>(null);
  const [pensionAccounts, setPensionAccounts] = useState<any[] | null>(null);
  const [accountData, setAccountData] = useState<any[] | null>(null);
  const [currentView, setCurrentView] = useState<string>("affiliate");
  const [completedViews, setCompletedViews] = useState<string[]>(["affiliate"]);

  const resetFunctionRef = useRef<(() => void) | null>(null);

  const registerFilterReset = useCallback((resetFunction: () => void) => {
    resetFunctionRef.current = resetFunction;
  }, []);

  const handleFilterReset = useCallback(() => {
    if (resetFunctionRef.current) {
      resetFunctionRef.current();
    }
  }, []);

  return (
    <TransferSuspenseContext.Provider
      value={{
        balanceData,
        setBalanceData,
        cuentaId,
        setCuentaId,
        userDetail,
        setUserDetail,
        affiliateDetail,
        setAffiliateDetail,
        selectedContributions,
        setSelectedContributions,
        currentTab,
        setCurrentTab,
        pensionAccounts,
        setPensionAccounts,
        accountData,
        setAccountData,
        currentView,
        setCurrentView,
        completedViews,
        setCompletedViews,
        handleFilterReset,
        registerFilterReset,
      }}
    >
      {children}
    </TransferSuspenseContext.Provider>
  );
};
