import { newUserDetailType } from "@/components/common";
import { UserDetailType } from "@/hooks/useAffiliateData/IuseAffiliateData";

export const formatUserDetail = (
  userDetailInfo: UserDetailType
): newUserDetailType => ({
  name: userDetailInfo?.nombreCompleto,
  documentType: userDetailInfo?.tipoIdentificacion,
  documentNumber: userDetailInfo?.numeroIdentificacion,
  accountNumber: userDetailInfo?.numeroCuenta,
  status: userDetailInfo?.estadoAfiliado,
  subStatus: userDetailInfo?.subestadoAfiliado,
  genre: userDetailInfo?.infoTabla["Género"],
  age: userDetailInfo?.infoTabla?.edad,
  balance: "XXXX",
  fechaNacimiento: userDetailInfo?.infoTabla?.fechaNacimiento,
  transicion: userDetailInfo?.infoTabla?.transicion, 
  sarlaft: userDetailInfo?.infoTabla?.sarlaft, 
});
