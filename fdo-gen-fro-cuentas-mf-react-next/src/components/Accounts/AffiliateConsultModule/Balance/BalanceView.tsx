import React from "react";

import {
  CardWithIcon,
  CustomCard,
  DataBox,
  TextWithDivider,
} from "@/components/common";

import { IBalance } from "./IBalance";
import { balanceColumns } from "./balance.common";

import styles from "./balance.module.scss";
import { IDispersion } from "./Dispersion/IDispersion";

export const BalanceView = ({
  balanceData,
  currentDispersion,
}: {
  balanceData: IBalance[];
  currentDispersion: IDispersion;
}) => {
  const columnsMainDispersion = [
    { title: "Porcentaje", value: currentDispersion?.porcentaje },
    { title: "Fecha de solicitud", value: currentDispersion?.fechaSolicitud },
    { title: "Fecha de activación", value: currentDispersion?.fechaActivacion },
    { title: "Origen", value: currentDispersion?.origen },
    { title: "Estado", value: currentDispersion?.estado },
  ];

  return (
    <CustomCard className={styles.balanceContainer}>
      <h3>Saldos obligatorios</h3>

      {balanceData[0] !== undefined && (
        <div className={styles.cardsContainer}>
          {balanceColumns(balanceData[0]).map(({ $header, $key, icon }) => (
            <CardWithIcon label={$header} value={$key} icon={icon as any} />
          ))}
        </div>
      )}

      {/* TODO: check this text with divider */}
      <TextWithDivider>Dispersión</TextWithDivider>
      <div className={styles.dispersionInfoContainer}>
        {columnsMainDispersion.map((element) => (
          <DataBox label={element.title} value={element.value} />
        ))}
      </div>
    </CustomCard>
  );
};
