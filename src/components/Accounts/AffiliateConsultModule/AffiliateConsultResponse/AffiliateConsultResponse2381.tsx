import { FlatTable } from "@/components/SharedComponent";
import { AffiliateAccountContext } from "@/context";
import {
  H6,
  Icon,
  Button,
  Subtitulo,
  ParagraphSmall,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";
import React, { useContext } from "react";
import styles from "./styles/AffiliateConsultResponse2381.module.scss";
import { BoxError } from "@/components/common";

export interface AccountData {
  folio: number;
  saldo: string;
  estado: string;
  subestado: string;
  vinculacion: string;
  tipoAfiliado: string;
  valorUltimoPago: string;
  fechaUltimoPago: string;
  periodoUltimoPago: string;
  nitUltimoPago: string;
  cuentaId: number;
  sarlaft: string;
}

export type AccountDataArray = AccountData[] | null;

export const AffiliateConsultResponse2381 = () => {
  const { accountData, setCompletedViews, setCurrentView } = useContext(
    AffiliateAccountContext
  ) as {
    accountData: AccountDataArray;
    setCurrentTab: (tab: string) => void;
    setCompletedViews: any;
    setCurrentView: any;
  };

  const handleConsultButtonClick = () => {
    setCompletedViews((prev: any) => {
      if (!prev.includes("affiliateResponseAccounts")) {
        return [...prev, "affiliateResponseAccounts"];
      }
      return prev;
    });

    setCurrentView("affiliateResponseAccounts");
  };

  console.log(accountData, "accountData");

  const renderAccountContent = () => {
    if (!accountData || accountData.length === 0) {
      return (
        <div style={{ marginTop: "16px" }}>
          <BoxError />
        </div>
      );
    }

    const { saldo, estado, subestado, cuentaId, sarlaft, vinculacion } =
      accountData[0] || ({} as AccountData);

    const datos = [
      {
        id: "row-1",
        estadoSub: estado || "-",
        subEstado: subestado || "-",
        sarlaf: sarlaft || "-",
        vinculacion: vinculacion || "-",
      },
    ];

    const columnas = [
      { key: "vinculacion", label: "Vinculación" },
      { key: "estadoSub", label: "Estado" },
      { key: "subEstado", label: "Sub estado afiliado" },
    ];

    return (
      <div className={styles.accountContainer}>
        <div className={styles.accountHeader}>
          <div className={styles.accountInfo}>
            <ParagraphSmall color="#000000" fontWeight={600}>
              Cuenta número
            </ParagraphSmall>
            <H6 justify="start" className={styles.accountNumber}>
              {cuentaId || "-"}
            </H6>
          </div>

          <div className={styles.balanceContainer}>
            <div className={styles.balanceHeader}>
              <img src="payments.svg" alt="savings icon" />
              <ParagraphSmall
                className={styles.balanceLabel}
                fontWeight={400}
                color="#4C515B"
              >
                Saldo
              </ParagraphSmall>
            </div>
            <Subtitulo
              justify="start"
              className={styles.balanceAmount}
              fontWeight={700}
              color="#1B5E21"
            >
              {saldo && saldo !== "$0" ? `${saldo}` : "$0"}
            </Subtitulo>
          </div>
        </div>
        <FlatTable data={datos} columns={columnas} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <H6 justify="start" color="#000000">
            Componente Complementario Ahorro Individual - CCAI
          </H6>
          <ParagraphNormal>
            Saldos y movimientos desde 1 de julio del 2025
          </ParagraphNormal>
        </div>
        <Button
          $type="soft"
          $color="tertiary"
          onClick={handleConsultButtonClick}
        >
          Consultar cuenta
        </Button>
      </div>

      {!accountData || accountData.length === 0 ? (
        <div style={{ marginTop: "16px" }}>
          <BoxError />
        </div>
      ) : (
        renderAccountContent()
      )}
    </div>
  );
};
