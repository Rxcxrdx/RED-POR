import { BoxError } from "@/components/common";
import { AffiliateAccountContext } from "@/context";
import {
  Accordion,
  Subtitulo,
  AccordionTab,
  ParagraphSmall,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";
import React, { useContext } from "react";
import styles from "./styles/AffiliateConsultResponseUserDetail.module.scss";

interface InfoItemProps {
  label: string;
  value: any;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className={styles.infoItem}>
    <ParagraphSmall color="#000000" fontWeight={700}>
      {label}
    </ParagraphSmall>
    <ParagraphNormal>
      {value === undefined || value === null || value === "" ? "-" : value}
    </ParagraphNormal>
  </div>
);

export const AffiliateConsultResponseUserDetail = () => {
  const { userDetail } = useContext(AffiliateAccountContext);

  if (!userDetail) {
    return (
      <div className={styles.container}>
        <BoxError />
      </div>
    );
  }

  const {
    nombreCompleto,
    tipoIdentificacion,
    numeroIdentificacion,
    infoTabla = {},
  } = userDetail;

  const {
    edad,
    email,
    ciudad,
    genero,
    sarlaft,
    celular,
    telefono,
    direccion,
    ocupacion,
    transicion,
    fechaNacimiento,
  } = infoTabla;

  return (
    <>
      <div className={styles.container}>
        <Subtitulo color="#000000" fontWeight={700}>
          {nombreCompleto || "-"}
        </Subtitulo>
        <ParagraphNormal>
          {tipoIdentificacion || ""} {numeroIdentificacion || "-"}
        </ParagraphNormal>
      </div>

      <div className={styles.container}>
        <div className={styles.infoGroup}>
          <InfoItem label="Transición" value={transicion} />
          <InfoItem label="Género" value={genero} />
          <InfoItem label="Edad" value={edad} />
          <InfoItem label="Fecha de nacimiento" value={fechaNacimiento} />
          <InfoItem label="SARLAFT" value={sarlaft} />
        </div>

        <Accordion $contentColor={undefined} $activeIndex={-1}>
          <AccordionTab $header={"Información del afiliado"}>
            <>
              <div className={styles.infoGroup}>
                <InfoItem label="Dirección" value={direccion} />
                <InfoItem label="Barrio" value={userDetail.barrio} />
                <InfoItem label="Ciudad" value={ciudad} />
                <InfoItem label="Departamento" value={"-"} />
                <InfoItem label="Email" value={email} />
                <InfoItem label="Celular" value={celular} />
                <InfoItem label="Telefono" value={telefono} />
                <InfoItem label="Ocupación" value={ocupacion} />
              </div>
            </>
          </AccordionTab>
          <AccordionTab $header={"Información de afiliación"}>
            <>
              <div className={styles.infoGroup}>
                <InfoItem
                  label="Tipo de trabajador"
                  value={userDetail.tipoAfiliado}
                />
                <InfoItem
                  label="Tipo de vinculación"
                  value={userDetail.tipoVinculacion}
                />
                <InfoItem
                  label="Fecha solicitud"
                  value={userDetail.fechaSolicitud}
                />
                <InfoItem
                  label="Fecha efectividad afiliación"
                  value={userDetail.fechaIngresoPorvenir}
                />
              </div>
            </>
          </AccordionTab>
          <AccordionTab $header={"Información del empleador"}>
            <>
              <div className={styles.infoGroup}>
                <InfoItem
                  label="Id. empleador"
                  value={userDetail.afiliadoFondoId}
                />
                <InfoItem label="Razón social" value={userDetail.razonSocial} />
                <InfoItem
                  label="IBC informado"
                  value={userDetail.ultimoIbcPago}
                />
                <InfoItem
                  label="Fecha de pago"
                  value={userDetail.ultimaFechaPago}
                />
                <InfoItem
                  label="Periodo de pago"
                  value={userDetail.ultimoPeriodoPago}
                />
                <InfoItem label="Valor último pago" value={"-"} />
              </div>
            </>
          </AccordionTab>
        </Accordion>
      </div>
    </>
  );
};
