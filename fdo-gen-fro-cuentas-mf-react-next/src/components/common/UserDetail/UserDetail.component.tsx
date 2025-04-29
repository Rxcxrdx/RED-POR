import React from "react";

import { Badge } from "pendig-fro-transversal-lib-react";

import { CustomCard } from "../CustomCard/CustomCard";
import { DataBox } from "../DataBox/DataBox.component";

import styles from "./UserDetail.module.scss";

export type newUserDetailType = {
  name: string | undefined;
  documentType: string | undefined;
  documentNumber: string | number | undefined;
  accountNumber: string | number | undefined;
  status: string | undefined;
  subStatus: string | undefined;
  genre: string | undefined;
  age: string | undefined;
  balance: string | undefined;
  fechaNacimiento: string | undefined;
  transicion: string | undefined;
  sarlaft: string | undefined;
};

interface UserDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  userInformation: newUserDetailType;
  saldo: any;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  saldo,
  userInformation,
  ...props
}) => {
  const {
    age,
    name,
    genre,
    status,
    sarlaft,
    subStatus,
    transicion,
    documentType,
    accountNumber,
    documentNumber,
    fechaNacimiento,
  } = userInformation;

  console.log(userInformation, "userInformation");
  const additionalInfo = [
    { label: "Número de cuenta", value: accountNumber },
    {
      label: "Estado",
      value: status && (
        <Badge $placeholder={status} $type="solid" $color="primary" />
      ),
    },
    { label: "Sub estado", value: subStatus },
    { label: "Género", value: genre },
    { label: "Edad", value: age },
    { label: "Fecha de nacimiento", value: fechaNacimiento },
    { label: "Transición", value: transicion },
    { label: "SARLAFT", value: sarlaft },
  ];
  return (
    <CustomCard {...props}>
      <div className={styles.nameContainer}>
        <div className={styles.userInformation}>
          <p className={styles.userInformation__username}>{name}</p>
          <p className={styles.userInformation__id}>
            {documentType} {documentNumber}
          </p>
        </div>
        <div className={styles.savingsGradient}>
          <div>
            <p className={styles.savingsGradient__label}>Saldo</p>
            <p className={styles.savingsGradient__balance}>{saldo}</p>
          </div>
          <img src="savings.svg" alt="savings icon" />
        </div>
      </div>
      <div className={styles.additionalInfoContainer}>
        {additionalInfo.map((element) => (
          <DataBox label={element.label} value={element.value} />
        ))}
      </div>
    </CustomCard>
  );
};
