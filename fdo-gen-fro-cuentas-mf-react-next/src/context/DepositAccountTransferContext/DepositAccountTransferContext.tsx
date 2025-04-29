import { UserDetailType } from "@/hooks/useAffiliateData/IuseAffiliateData";
import React, {
  createContext,
  useState,
  FC,
  ReactNode,
  useRef,
  useCallback,
} from "react";

interface IDepositAccountTransferContext {
  cuentaId: number | null;
  setCuentaId: React.Dispatch<React.SetStateAction<number | null>>;
  userDetail: UserDetailType;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetailType>>;
  affiliateDetail: any | null;
  setAffiliateDetail: React.Dispatch<React.SetStateAction<any | null>>;
  selectedContributions: any[] | null;
  setSelectedContributions: React.Dispatch<React.SetStateAction<any[] | null>>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  balanceData: any[] | null;
  setBalanceData: React.Dispatch<React.SetStateAction<any[] | null>>;
  pensionAccounts: any[] | null;
  setPensionAccounts: React.Dispatch<React.SetStateAction<any[] | null>>;
  accountData: any[] | null;
  setAccountData: React.Dispatch<React.SetStateAction<any[] | null>>;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  completedViews: string[];
  setCompletedViews: React.Dispatch<React.SetStateAction<string[]>>;
  handleFilterReset: (() => void) | null;
  registerFilterReset: (resetFunction: () => void) => void;
}

interface IDepositAccountTransferContextProviderProps {
  children: ReactNode;
}

export const DepositAccountTransferContext =
  createContext<IDepositAccountTransferContext>(
    {} as IDepositAccountTransferContext
  );

export const DepositAccountTransferContextProvider: FC<
  IDepositAccountTransferContextProviderProps
> = ({ children }) => {
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);
  const [affiliateDetail, setAffiliateDetail] = useState<null>(null);
  const [selectedContributions, setSelectedContributions] = useState<
    any[] | null
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
    <DepositAccountTransferContext.Provider
      value={{
        balanceData,
        setBalanceData,
        cuentaId,
        setCuentaId,
        userDetail,
        currentTab,
        setCurrentTab,
        setUserDetail,
        affiliateDetail,
        setAffiliateDetail,
        selectedContributions,
        setSelectedContributions,
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
    </DepositAccountTransferContext.Provider>
  );
};
