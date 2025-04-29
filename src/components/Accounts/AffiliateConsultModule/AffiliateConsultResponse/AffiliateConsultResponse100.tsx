import React, { useContext } from "react";
import { FlatTable } from "@/components/SharedComponent";
import {
  Button,
  H6,
  Icon,
  ParagraphNormal,
  ParagraphSmall,
  Subtitulo,
} from "pendig-fro-transversal-lib-react";
import { AffiliateAccountContext } from "@/context";
import styles from "./styles/AffiliateConsultResponse100.module.scss";
import { BoxError } from "@/components/common";

export interface PensionAccount {
  fechaCreacion: string;
  numeroCuenta: number;
  estado: string;
  subestado: string;
  semanas: string;
  saldoMenor23SMLV: string;
  saldoMayor23SMLV: string;
  esTransicion: string;
  esOportunidad: string;
  anosPension: number;
}

export const AffiliateConsultResponse100 = () => {
  const { pensionAccounts } = useContext(AffiliateAccountContext);

  const handleButtonClick = () => {
    window.open("https://mfondos.porvenir.com/multifondos/", "_blank");
  };

  if (!pensionAccounts || pensionAccounts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <H6 justify="start" color="#000000">
              Saldos Ahorro Individual con Solidaridad - RAIS
            </H6>
            <ParagraphNormal>
              Saldos y movimientos hasta 30 de junio 2025
            </ParagraphNormal>
          </div>
          <Button $type="soft" $color="tertiary" onClick={handleButtonClick}>
            Ir a multifondos
          </Button>
        </div>
        <div style={{ marginTop: "16px" }}>
          <BoxError />
        </div>
      </div>
    );
  }

  const accountData = pensionAccounts[0];

  const datos = [
    {
      id: "1",
      vinculacion: "-",
      estado: accountData.estado || "-",
      subEstadoAfiliado: accountData.subestado || "-",
      excluidoRAIS: "-",
      fechaSiniestro: "-",
      fechaPrimeraCalificacion: "-",
      inconsistenciaRegistraduria: "-",
      cuentaEmbargada: "-",
      multiafiliado: "-",
    },
  ];

  const columns = [
    { key: "vinculacion", label: "Vinculación" },
    { key: "estado", label: "Estado", showBadge: true },
    { key: "subEstadoAfiliado", label: "Sub estado afiliado" },
    { key: "excluidoRAIS", label: "Excluido RAIS" },
    { key: "fechaSiniestro", label: "Fecha siniestro" },
    {
      key: "fechaPrimeraCalificacion",
      label: "Fecha primera calificación",
    },
    {
      key: "inconsistenciaRegistraduria",
      label: "Inconsistencia Registraduría",
    },
    { key: "cuentaEmbargada", label: "Cuenta embargada" },
    { key: "multiafiliado", label: "Multiafiliado" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <H6 justify="start" color="#000000">
            Saldos Ahorro Individual con Solidaridad - RAIS
          </H6>
          <ParagraphNormal>
            Saldos y movimientos hasta 30 de junio 2025
          </ParagraphNormal>
        </div>
        <Button $type="soft" $color="tertiary" onClick={handleButtonClick}>
          Ir a multifondos
        </Button>
      </div>

      <div className={styles.accountContainer}>
        <div className={styles.accountHeader}>
          <div className={styles.accountInfo}>
            <ParagraphSmall color="#000000" fontWeight={600}>
              Cuenta número
            </ParagraphSmall>
            <H6 justify="start" className={styles.accountNumber}>
              {accountData.numeroCuenta || "-"}
            </H6>
          </div>

          <div className={styles.balanceGroup}>
            <div className={styles.balanceBox}>
              <div className={styles.balanceHeader}>
                <Icon
                  $w={"16px"}
                  $h={"16px"}
                  $name="calendarToday"
                  title="calendarToday"
                />
                <ParagraphSmall className={styles.balanceLabel}>
                  Semanas
                </ParagraphSmall>
              </div>
              <Subtitulo justify="start" fontWeight={700} color="#4C515B">
                {accountData.semanas || "-"}
              </Subtitulo>
            </div>
            <div className={styles.balanceBox}>
              <div className={styles.balanceHeader}>
                <img src="payments.svg" alt="savings icon" />
                <ParagraphSmall className={styles.balanceLabel}>
                  Saldo menor 2.3 SMLV
                </ParagraphSmall>
              </div>
              <Subtitulo
                justify="start"
                className={styles.balanceAmount}
                fontWeight={700}
                color="#696969"
              >
                {accountData.saldoMenor23SMLV || "-"}
              </Subtitulo>
            </div>
            <div className={styles.balanceBoxHighlighted}>
              <div className={styles.balanceHeader}>
                <img src="payments.svg" alt="savings icon" />
                <ParagraphSmall className={styles.balanceLabel}>
                  Saldo mayor 2.3 SMLV
                </ParagraphSmall>
              </div>
              <Subtitulo
                justify="start"
                className={styles.balanceAmountHighlighted}
                fontWeight={700}
              >
                {accountData.saldoMayor23SMLV || "-"}
              </Subtitulo>
            </div>
          </div>
        </div>
        <FlatTable data={datos} columns={columns} />
      </div>
    </div>
  );
};
