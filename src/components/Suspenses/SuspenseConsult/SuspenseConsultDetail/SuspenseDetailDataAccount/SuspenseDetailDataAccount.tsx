import { useState, useEffect, useContext } from "react";
import {
  accountByAccountIdGet,
} from "@/services";

import { SuspenseConsultContext } from "@/context";
import { ICuentaRaw, ICuentaResponse, IFormattedAccount, SuspenseDetailDataAccountViewProps } from "./ISuspenseDetailDataAccount";
import { BaseTable } from "@/components/SharedComponent/BaseTable";
import { Column } from "@/components/SharedComponent/BaseTable/IBaseTable";


export const SuspenseDetailDataAccount: React.FC = () => {
  
  const { cuentaId, suspense} = useContext(SuspenseConsultContext);
  

  const [records, setRecords] = useState<IFormattedAccount[]>([]);
  const [data, setData] = useState<IFormattedAccount[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const columns: Column[] = [
    { $key: "Cuenta ID", $header: "Cuenta ID" },
    { $key: "tipoIdDetalle", $header: "Tipo id afiliado" },
    { $key: "numeroIdDetalle", $header: "Identificación afiliado" },
    { $key: "primerApellido", $header: "Primer apellido" },
    { $key: "segundoApellido", $header: "Segundo apellido" },
    { $key: "primerNombre", $header: "Primer nombre" },
    { $key: "segundoNombre", $header: "Segundo nombre" },
    { $key: "Estado", $header: "Estado cuenta" },
    { $key: "Subestado", $header: "SubEstado cuenta" },
  ];


  const transformAccountData = (
    accounts: ICuentaRaw[]
  ): IFormattedAccount[] => {
    return accounts.map((account) => ({
      "tipoIdDetalle": suspense[0]?.tipoIdDetalle,
      "numeroIdDetalle": suspense[0]?.numeroIdDetalle,
      "primerApellido": suspense[0]?.primerApellido,
      "segundoApellido": suspense[0]?.segundoApellido,
      "primerNombre": suspense[0]?.primerNombre,
      "segundoNombre": suspense[0]?.segundoNombre,
      Estado: account.estadoAfiliadoFondoId,
      "Tipo Afiliado": account.tipoAfiliado,
      "Tipo Vinculación": account.tipoVinculacion,
      "Valor Último Pago": account.ultimoIbcPago
        ? account.ultimoIbcPago.toLocaleString("es-CO")
        : "-",
      "Fecha Último Pago": account.ultimaFechaPago || "-",
      "Periodo Último Pago": account.ultimoPeriodoPago || "-",
      "NIT Último Pago": account.ultimoNitPago || "-",
      "Cuenta ID": account.cuentaId,
      Subestado: account.subestadoAfiliadoFondoId || "-",
    }));
  };

  const fetchAccount = async () => {
    
    setIsLoading(true);
    setErrorMessage("");
    // setAccountData([]);

    try {
        const accountResponse = (await accountByAccountIdGet(cuentaId)) as ICuentaResponse;
        
        if (accountResponse?.status?.statusCode === 200) {
          const { account } = accountResponse.data;

          if (account?.length > 0) {
            const formattedAccounts = transformAccountData(account);
            setRecords(formattedAccounts);
            setData(formattedAccounts);
            
          } else {
            setErrorMessage(
              "No se encontraron datos para la cuenta ingresada."
            );
          }
        } else {
          setErrorMessage("No se encontraron datos para la cuenta ingresada.");
        }      

    } catch (error) {
      console.error("Error en fetchAccount:", error);
      setErrorMessage("Ocurrió un error al realizar la consulta por cuenta.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    if (cuentaId) {
      fetchAccount();
    }
    else{
      setErrorMessage("El rezago seleccionado no tiene una cuenta asociada.");
    }
  }, [cuentaId]);

  const handleItemsPerPageChange = (newSize: number) => {
    setPage(1);
  };

  const SuspenseDetailDataAccountViewProps: SuspenseDetailDataAccountViewProps = {
    columns,
    records,
    page,
    pageSize,
    isLoading,
    totalPages,
    totalRecords,
    errorMessage,
    setPage,
    handleItemsPerPageChange,
  };


  return (
    <BaseTable {...SuspenseDetailDataAccountViewProps} />
  );
};
