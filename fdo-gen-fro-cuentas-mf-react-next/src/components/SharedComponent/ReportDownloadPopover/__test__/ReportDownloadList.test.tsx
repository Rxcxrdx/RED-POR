import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReportDownloadList } from "../ReportDownloadList";

jest.mock("@/services", () => ({
  downloadAffiliateCertificate: jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: {
        statusCode: 200,
        statusDescription: "Transaccion Exitosa",
      },
      data: {
        ruta: "https://example.com/sample.pdf",
      },
    })
  ),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Modal: ({ children, $isOpen, onClose }) =>
    $isOpen ? <div data-testid="mock-modal">{children}</div> : null,
  Icon: ({ $name }) => <div data-testid="mock-icon">{$name}</div>,
  ParagraphSmall: ({ children }) => (
    <p data-testid="mock-paragraph">{children}</p>
  ),
  Button: ({ children, $size, onClick, disabled }) => (
    <button
      data-testid="mock-button"
      data-size={$size}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  H6: ({ children }) => <h6 data-testid="mock-h6">{children}</h6>,
  Toast: {
    show: jest.fn(),
    showStatusCode: jest.fn(),
  },
}));

jest.mock("@/components/common", () => ({
  Loader: ({ isLoading, $message }) =>
    isLoading && <div data-testid="mock-loader">{$message}</div>,
}));

const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe("ReportDownloadList", () => {
  const mockUserDetail = {
    nombreCompleto: "Test User",
    numeroIdentificacion: "123456789",
    tipoIdentificacion: "CC",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it("renders the reports button correctly", () => {
    render(<ReportDownloadList userDetail={mockUserDetail} />);
    expect(screen.getByText("Informes")).toBeInTheDocument();
  });

  it("opens modal when clicking the reports button", () => {
    render(<ReportDownloadList userDetail={mockUserDetail} />);
    const reportsButton = screen.getByText("Informes");
    fireEvent.click(reportsButton);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByTestId("mock-h6")).toHaveTextContent(
      "Selecciona un Tipo de Informe"
    );
  });

  it("starts download when selecting 'Certificado de afiliación'", async () => {
    const { downloadAffiliateCertificate } = require("@/services");
    const { Toast } = require("pendig-fro-transversal-lib-react");

    render(<ReportDownloadList userDetail={mockUserDetail} />);

    fireEvent.click(screen.getByText("Informes"));

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    const certificadoButton = buttons.find((button) =>
      button.textContent.includes("Certificado de afiliación")
    );

    fireEvent.click(certificadoButton);

    await waitFor(() => {
      expect(downloadAffiliateCertificate).toHaveBeenCalledWith(
        "123456789",
        "CC"
      );
    });

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://example.com/sample.pdf",
      "_blank"
    );

    expect(Toast.show).toHaveBeenCalled();
  });

  it("shows error toast when user identification is missing", async () => {
    const { Toast } = require("pendig-fro-transversal-lib-react");

    render(<ReportDownloadList userDetail={{}} />);

    fireEvent.click(screen.getByText("Informes"));

    const buttons = screen.getAllByRole("button");
    const certificadoButton = buttons.find((button) =>
      button.textContent.includes("Certificado de afiliación")
    );

    fireEvent.click(certificadoButton);

    expect(Toast.show).toHaveBeenCalledWith(
      "Información incompleta",
      expect.objectContaining({
        $color: "red",
      })
    );
  });

  it("shows toast for other report types that are not implemented", async () => {
    const { Toast } = require("pendig-fro-transversal-lib-react");

    render(<ReportDownloadList userDetail={mockUserDetail} />);

    fireEvent.click(screen.getByText("Informes"));

    const buttons = screen.getAllByRole("button");
    const otroInformeButton = buttons.find((button) =>
      button.textContent.includes("Informe movimiento cuenta")
    );

    fireEvent.click(otroInformeButton);

    expect(Toast.show).toHaveBeenCalledWith(
      "Servicio no disponible",
      expect.objectContaining({
        $color: "warning",
      })
    );
  });

  it("handles download errors correctly", async () => {
    const { downloadAffiliateCertificate } = require("@/services");
    const { Toast } = require("pendig-fro-transversal-lib-react");

    downloadAffiliateCertificate.mockImplementationOnce(() =>
      Promise.reject(new Error("Service error"))
    );

    render(<ReportDownloadList userDetail={mockUserDetail} />);

    fireEvent.click(screen.getByText("Informes"));

    const buttons = screen.getAllByRole("button");
    const certificadoButton = buttons.find((button) =>
      button.textContent.includes("Certificado de afiliación")
    );

    fireEvent.click(certificadoButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error al descargar el reporte:",
        expect.any(Error)
      );
    });

    expect(Toast.showStatusCode).toHaveBeenCalledWith(500);
  });

  it("shows loader when downloading", async () => {
    const { downloadAffiliateCertificate } = require("@/services");

    let resolvePromise;
    downloadAffiliateCertificate.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<ReportDownloadList userDetail={mockUserDetail} />);

    fireEvent.click(screen.getByText("Informes"));

    const buttons = screen.getAllByRole("button");
    const certificadoButton = buttons.find((button) =>
      button.textContent.includes("Certificado de afiliación")
    );

    fireEvent.click(certificadoButton);

    expect(screen.getByTestId("mock-loader")).toBeInTheDocument();

    resolvePromise({
      status: {
        statusCode: 200,
        statusDescription: "Transaccion Exitosa",
      },
      data: {
        ruta: "https://example.com/sample.pdf",
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId("mock-loader")).not.toBeInTheDocument();
    });
  });
});
