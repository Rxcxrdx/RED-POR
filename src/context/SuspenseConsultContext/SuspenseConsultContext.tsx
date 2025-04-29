import { ISuspenseMovement } from "@/components/Suspenses/SuspenseConsult/SuspenseConsultDetail/SuspenseDetailMovements/ISuspenseDetailMovements";
import { ISuspenseUpdate } from "@/components/Suspenses/SuspenseConsult/SuspenseConsultDetail/SuspenseDetailUpdate/ISuspenseDetailUpdate";
import { ISuspense } from "@/components/Suspenses/SuspenseConsult/SuspenseConsultFormView/ISuspenseConsultForm";
import { ICuentaRaw } from "@/hooks/useAffiliateData/IuseAffiliateData";
import { _TransformValues } from "@mantine/form/lib/types";
import { createContext, useState, FC, ReactNode } from "react";

interface ISuspenseConsultContext {
  cuentaId: number | null;
  setCuentaId: React.Dispatch<React.SetStateAction<number | null>>;
  isShowConsultForm: boolean;
  setIsShowConsultForm: React.Dispatch<React.SetStateAction<boolean>>;
  suspense: ISuspense[];
  setSuspense: React.Dispatch<React.SetStateAction<ISuspense[]>>;
  account: ICuentaRaw[];
  setAccount: React.Dispatch<React.SetStateAction<ICuentaRaw[]>>;
  update: ISuspenseUpdate[];
  setUpdate: React.Dispatch<React.SetStateAction<ISuspenseUpdate[]>>;
  movements: ISuspenseMovement[];
  setMovements: React.Dispatch<React.SetStateAction<ISuspenseMovement[]>>;
}

interface ISuspenseProviderProps {
  children: ReactNode;
}

export const SuspenseConsultContext = createContext<ISuspenseConsultContext>(
  {} as ISuspenseConsultContext
);

export const SuspenseConsulttProvider: FC<ISuspenseProviderProps> = ({
  children,
}) => {
  const [cuentaId, setCuentaId] = useState<number | null>(null);
  const [isShowConsultForm, setIsShowConsultForm] = useState<boolean>(true);
  const [suspense, setSuspense] = useState<ISuspense[]>([]);
  const [account, setAccount] = useState<ICuentaRaw[]>([]);
  const [update, setUpdate] = useState<ISuspenseUpdate[]>([]);
  const [movements, setMovements] = useState<ISuspenseMovement[]>([]);

  //   const [userDetail, setUserDetail] = useState<UserDetailType>(null);

  return (
    <SuspenseConsultContext.Provider
      value={{
        cuentaId,
        setCuentaId,
        isShowConsultForm,
        setIsShowConsultForm,
        suspense,
        setSuspense,
        account,
        setAccount,
        update,
        setUpdate,
        movements,
        setMovements,
      }}
    >
      {children}
    </SuspenseConsultContext.Provider>
  );
};
