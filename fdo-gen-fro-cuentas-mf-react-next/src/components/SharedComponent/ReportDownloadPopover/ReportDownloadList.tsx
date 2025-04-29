import React, { useState } from "react";
import {
  H6,
  Toast,
  Modal,
  Button,
  ParagraphSmall,
} from "pendig-fro-transversal-lib-react";

import { Loader } from "@/components/common";
import styles from "./ReportDownloadList.module.scss";
import { downloadAffiliateCertificate } from "@/services";

// Importa los SVGs (si es necesario)
// import personSvg from '@/assets/icons/person.svg';
// import moveUpSvg from '@/assets/icons/moveUp.svg';
// etc...

interface CertificateResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    ruta: string;
  };
}

interface ReportType {
  id:
    | "affiliation"
    | "retention"
    | "contributions"
    | "graduates"
    | "account"
    | "pension"
    | "transfers"
    | "laboralHistory";
  label: string;
  iconSrc: string; // Cambiado de 'icon' a 'iconSrc' para reflejar que ahora es una ruta
}

const REPORT_TYPES: ReportType[] = [
  {
    id: "affiliation",
    label: "Certificado de afiliación",
    iconSrc: "person.svg",
  },
  {
    id: "retention",
    label: "Informe movimiento cuenta",
    iconSrc: "move_up.svg",
  },
  {
    id: "contributions",
    label: "Certificado de retención",
    iconSrc: "attribution.svg",
  },
  {
    id: "graduates",
    label: "Extracto pensión obligatoria",
    iconSrc: "blind.svg",
  },
  {
    id: "account",
    label: "Certificado aportes cuenta",
    iconSrc: "monetization_on.svg",
  },
  {
    id: "pension",
    label: "Informe valores trasladados",
    iconSrc: "transfer_within_a_station.svg",
  },
  {
    id: "transfers",
    label: "Certificado de egresados",
    iconSrc: "article.svg",
  },
  { id: "laboralHistory", label: "Historial laboral", iconSrc: "history.svg" },
];

interface ReportButtonProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  iconSrc,
  label,
  onClick,
}) => (
  <button type="button" onClick={onClick} className={styles.reportButton}>
    <div className={styles.buttonContent}>
      <img src={iconSrc} alt={`${label} icon`} />
      <ParagraphSmall
        justify="start"
        direction="row"
        color="#3E6C33"
        fontWeight={700}
      >
        {label}
      </ParagraphSmall>
    </div>
  </button>
);

interface UserDetailType {
  nombreCompleto?: string;
  numeroIdentificacion?: string;
  tipoIdentificacion?: string;
}

interface ReportDownloadListProps {
  userDetail: UserDetailType;
}

export const ReportDownloadList: React.FC<ReportDownloadListProps> = ({
  userDetail,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [showPdfLink, setShowPdfLink] = useState<boolean>(false);

  const handleReportSelect = async (report: ReportType) => {
    setShowPdfLink(false);
    setIsReportModalOpen(false);

    if (report.id === "affiliation") {
      await downloadReport(report);
    } else {
      Toast.show("Servicio no disponible", {
        $borderLeft: true,
        $iconSwap: "info",
        $color: "warning",
        $content:
          "El servicio para este tipo de informe no está disponible en este momento.",
        $type: "soft",
        $showCloseButton: true,
      });
    }
  };

  const downloadReport = async (report: ReportType) => {
    if (!userDetail?.numeroIdentificacion || !userDetail?.tipoIdentificacion) {
      Toast.show("Información incompleta", {
        $borderLeft: true,
        $iconSwap: "warningAmber",
        $color: "red",
        $content:
          "Información de identificación no disponible para descargar el certificado.",
        $type: "soft",
        $showCloseButton: true,
      });
      return;
    }

    setIsLoading(true);
    setPdfUrl("");
    setShowPdfLink(false);

    try {
      if (report.id === "affiliation") {
        const response = (await downloadAffiliateCertificate(
          userDetail.numeroIdentificacion,
          userDetail.tipoIdentificacion
        )) as CertificateResponse | undefined;

        if (response && response.data && response.data.ruta) {
          const pdfUrl = response.data.ruta;
          console.log("URL del PDF a abrir:", pdfUrl);

          setPdfUrl(pdfUrl);

          const newWindow = window.open(pdfUrl, "_blank");

          if (!newWindow) {
            try {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (e) {
              console.error("Error al abrir PDF usando el enlace:", e);
              setShowPdfLink(true);
            }
          }

          Toast.show("Documento descargado", {
            $borderLeft: true,
            $iconSwap: "check",
            $color: "primary",
            $content: "El certificado se ha descargado correctamente",
            $type: "soft",
            $showCloseButton: true,
          });
        } else {
          console.error(
            "No se encontró la URL del PDF en la respuesta:",
            response
          );
          Toast.showStatusCode(404);
        }
      }
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      Toast.showStatusCode(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPdfOpen = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <>
      <Loader isLoading={isLoading} />

      <Button
        $size="small"
        onClick={() => setIsReportModalOpen(true)}
        disabled={isLoading}
      >
        Informes
      </Button>

      {showPdfLink && pdfUrl && (
        <div className={styles.pdfLinkContainer}>
          <ParagraphSmall>
            Si el documento no se abrió automáticamente:
          </ParagraphSmall>
          <Button
            $size="small"
            onClick={handleManualPdfOpen}
            $type="solid"
            className={styles.manualOpenButton}
          >
            Ver PDF
          </Button>
        </div>
      )}

      <Modal
        $isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        $w="600px"
        $h="auto"
      >
        <div className={styles.modalContent}>
          <H6 justify="start">Selecciona un Tipo de Informe</H6>
          <div className={styles.reportsGrid}>
            {REPORT_TYPES.map((report) => (
              <ReportButton
                key={report.id}
                iconSrc={report.iconSrc}
                label={report.label}
                onClick={() => handleReportSelect(report)}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
