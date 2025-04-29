import { httpAdapter } from "../serviceAdapter";
import { IResponseData } from "../services";

export const downloadAffiliateCertificate = async (
  numeroIdentificacion: any,
  tipoIdentificacion: any
): Promise<IResponseData<any[]> | undefined> => {
  try {
    const customHeaders = {
      "X-RqUID": "1",
      "X-Channel": "AHL",
      "X-IPAddr": "10.10.10.10",
      "X-CompanyId": "0098",
      "Content-Type": "application/json",
      "X-IdentSerialNum": "1234567890",
      "X-GovIssueIdentType": "cc",
      "cuentaId": null,
      "numeroIdentificacion": numeroIdentificacion,
      "tipoIdentificacion": tipoIdentificacion
    };

    return await httpAdapter.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/service/fgngen/cuentas/certificado/api/obtenerCertificadoAfiliacion`,
      { headers: customHeaders }
    );
  } catch (error) {
    console.error("Error fetching certificate by identification number:", error);
    throw error;
  }
};