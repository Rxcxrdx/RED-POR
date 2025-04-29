import React from "react";
import { DataBox } from "@/components/common";
import { UserDetailViewProps } from "./IUserDetail";
import { ReportDownloadList } from "../ReportDownloadPopover";

export const UserDetailView: React.FC<UserDetailViewProps> = ({
  userDetail,
  reports,
  opened,
  onToggle,
  hiddenFields = [],
}) => {
  if (!userDetail) return null;

  const {
    infoTabla,
    numeroCuenta,
    nombreCompleto,
    estadoAfiliado,
    subestadoAfiliado,
    tipoIdentificacion,
    numeroIdentificacion,
    folio,
    barrio,
    razonSocial,
    ultimoIbcPago,
    vinculacion,
  } = userDetail;

  const filterFieldsByVisibility = (fields: any) => {
    return fields.filter((field: any) => !hiddenFields.includes(field.label));
  };

  const userInformation = [
    {
      label: `${tipoIdentificacion} - ${numeroIdentificacion}`,
      value: nombreCompleto,
    },
    { label: "FECHA DE NACIMIENTO", value: infoTabla?.["Fecha de Nacimiento"] },
    { label: "EDAD", value: infoTabla?.edad },
    { label: "CUENTA No.", value: numeroCuenta },
    { label: "FOLIO", value: folio },
    { label: "ESTADO AFILIADO", value: estadoAfiliado },
    { label: "SUBESTADO", value: subestadoAfiliado },
    { label: "VINCULACION", value: vinculacion },
    { label: "SARLAFT", value: infoTabla?.Sarlaft },
    { label: "EMPLEADOR", value: razonSocial },
    { label: "IBC INFORMADO", value: ultimoIbcPago },
  ];

  const userAdditionalInformation = [
    { label: "GÉNERO", value: infoTabla?.["Género"] },
    { label: "REGISTRADURÍA", value: infoTabla?.Registraduría },
    { label: "TRANSICIÓN", value: infoTabla?.Transición },
    { label: "CIUDAD", value: infoTabla?.Ciudad },
    { label: "BARRIO", value: barrio },
    { label: "DIRECCIÓN", value: infoTabla?.Dirección },
    { label: "EMAIL", value: infoTabla?.Email },
    { label: "OCUPACIÓN", value: infoTabla?.Ocupación },
    { label: "TELÉFONO", value: infoTabla?.Teléfono },
    { label: "CELULAR", value: infoTabla?.Celular },
  ];

  const visibleUserInformation = filterFieldsByVisibility(userInformation);
  const visibleUserAdditionalInformation = filterFieldsByVisibility(
    userAdditionalInformation
  );

  const hasVisibleAdditionalFields =
    visibleUserAdditionalInformation.length > 0;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e8f4e1",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          {visibleUserInformation.map(({ label, value }: any) => (
            <DataBox key={label} label={label} value={value} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: "8px",
            marginLeft: "8px",
          }}
        >
          {hasVisibleAdditionalFields && (
            <button
              type="button"
              onClick={onToggle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "8px ",
                backgroundColor: "#3E6C33",
                color: "#FFFF",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "700",
                border: "none",
              }}
            >
              {opened ? "Ver menos" : "Ver más"}
            </button>
          )}
          {reports && <ReportDownloadList userDetail={userDetail} />}
        </div>
      </div>

      {opened && hasVisibleAdditionalFields && (
        <div style={{ marginTop: "16px", width: "100%" }}>
          <hr style={{ marginBottom: "16px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {visibleUserAdditionalInformation.map(({ label, value }: any) => (
              <DataBox key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
