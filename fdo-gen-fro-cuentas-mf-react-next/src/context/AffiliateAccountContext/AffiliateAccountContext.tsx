import { UserDetailType } from "@/hooks/useAffiliateData/IuseAffiliateData";
import React, {
  createContext,
  useState,
  FC,
  ReactNode,
  useRef,
  useCallback,
} from "react";

interface IAffiliateAccountContext {
  cuentaId: number | null;
  setCuentaId: React.Dispatch<React.SetStateAction<number | null>>;
  userDetail: UserDetailType;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetailType>>;
  affiliateDetail: any | null;
  setAffiliateDetail: React.Dispatch<React.SetStateAction<any | null>>;
  selectedContributions: any[] | null;
  setSelectedContributions: React.Dispatch<React.SetStateAction<any[] | null>>;
  balanceData: any[] | null;
  setBalanceData: React.Dispatch<React.SetStateAction<any[] | null>>;
  accountData: any[] | null;
  setAccountData: React.Dispatch<React.SetStateAction<any[] | null>>;
  pensionAccounts: any[] | null;
  setPensionAccounts: React.Dispatch<React.SetStateAction<any[] | null>>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  completedViews: string[];
  setCompletedViews: React.Dispatch<React.SetStateAction<string[]>>;
  handleFilterReset: (() => void) | null;
  registerFilterReset: (resetFunction: () => void) => void;
}

interface IAffiliateAccountProviderProps {
  children: ReactNode;
}

export const AffiliateAccountContext = createContext<IAffiliateAccountContext>(
  {} as IAffiliateAccountContext
);

export const AffiliateAccountProvider: FC<IAffiliateAccountProviderProps> = ({
  children,
}) => {
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);
  const [affiliateDetail, setAffiliateDetail] = useState<null>(null);
  const [selectedContributions, setSelectedContributions] = useState<
    any[] | null
  >(null);
  const [balanceData, setBalanceData] = useState<any[] | null>(null);
  const [accountData, setAccountData] = useState<any[] | null>(null);
  const [pensionAccounts, setPensionAccounts] = useState<any[] | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("affiliate");
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
    <AffiliateAccountContext.Provider
      value={{
        accountData,
        setAccountData,
        pensionAccounts,
        setPensionAccounts,
        cuentaId,
        userDetail,
        currentTab,
        setCurrentTab,
        setCuentaId,
        balanceData,
        setUserDetail,
        setBalanceData,
        affiliateDetail,
        setAffiliateDetail,
        selectedContributions,
        setSelectedContributions,
        currentView,
        setCurrentView,
        completedViews,
        setCompletedViews,
        handleFilterReset,
        registerFilterReset,
      }}
    >
      {children}
    </AffiliateAccountContext.Provider>
  );
};
