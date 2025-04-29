import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContributionDetail } from "../ContributionDetail/ContributionDetail";

jest.mock("@mantine/core", () => ({
  ...jest.requireActual("@mantine/core"),
  Button: jest.fn(({ children, onClick }) => (
    <button data-testid="back-button" onClick={onClick}>
      {children}
    </button>
  )),
  Text: jest.fn(({ children, mt }) => (
    <div data-testid="text-component" style={{ marginTop: mt }}>
      {children}
    </div>
  )),
  MantineProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ContributionDetail Component", () => {
  const mockSelectedRecord = {
    cuentaAporteId: "123",
    periodoPago: "202401",
    fechaPago: "2024-01-15",
    fechaCreacion: "2024-01-15",
    salarioBaseCal: 1000000,
    salarioBase: 1000000,
    numeroIdAportante: "123456789",
    razonSocial: "Empresa Test",
    codigoOperacionId: "001",
  };

  const mockAportes = [
    {
      aporteDetalleId: "1",
      concepto: "Concepto 1",
      inversionId: "INV001",
      pesos: 1000,
      unidades: 100,
      porcentaje: 10,
      afectaSaldoCuenta: "Sí",
    },
    {
      aporteDetalleId: "2",
      concepto: "Concepto 2",
      inversionId: "INV002",
      pesos: 2000,
      unidades: 200,
      porcentaje: 20,
      afectaSaldoCuenta: "No",
    },
  ];

  const mockMovements = [
    {
      fechaPago: "2024-01-15",
      fechaCreacion: "2024-01-15",
      periodoPago: "202401",
      nitPago: "123456789",
      razonSocial: "Empresa Test",
      salarioBase: 1000000,
      salarioBaseCal: 1000000,
      tipoCotizanteId: "1",
      diasInformado: 30,
      diasCalculado: 30,
      creditoPesos: 100000,
      debitoUnidades: 10,
      debitoPesos: 50000,
      creditoUnidades: 20,
      fondoID: "F001",
      afectaSaldo: "Sí",
      codigoOperacionId: "001",
      conceptoId: "C001",
      idDisponible: "D001",
      cuentaMovimientoId: "M001",
      idMovimientoOrigen: "O001",
      idMovimientoDestino: "D001",
      cuentaAporteId: "A001",
      fechaOperacion: "2024-01-16",
      encabezadoPlanillaId: "P001",
      depositoId: "DEP001",
      usuarioCreacion: "USER001",
      secuencia: 1,
      retencionContingente: 5000,
      fechaPagoOtroFondo: "2024-01-20",
      casoId: "CASO001",
      numeroAsientoId: "AST001",
    },
  ];

  const defaultProps = {
    detailData: { aporte: mockAportes },
    movementsData: mockMovements,
    onBack: jest.fn(),
    isLoadingDetail: false,
    detailError: "",
    movementsError: "",
    errorMessage: "",
    selectedRecord: mockSelectedRecord,
  };

  const renderComponent = (props = {}) => {
    return render(<ContributionDetail {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    renderComponent({ isLoadingDetail: true });
    expect(screen.getByText("Cargando información...")).toBeInTheDocument();
  });

  it("renders error message when present", () => {
    const errorMessage = "Error de prueba";
    renderComponent({ errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders back button and handles click", () => {
    renderComponent();
    const backButton = screen.getByText("Volver");
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it("renders summary section correctly", () => {
    renderComponent();
    expect(screen.getByText("Resumen del Aporte")).toBeInTheDocument();
  });

  it("renders details section with correct data", () => {
    renderComponent();
    expect(screen.getByText("Detalle del Aporte")).toBeInTheDocument();
  });

  it("renders no details message when aporte array is empty", () => {
    renderComponent({ detailData: { aporte: [] } });
    expect(
      screen.getByText("No hay detalles para mostrar")
    ).toBeInTheDocument();
  });

  it("renders detail error message when present", () => {
    renderComponent({ detailError: "Error en detalle" });
    expect(screen.getByText("Error en detalle")).toBeInTheDocument();
  });

  it("renders movements section with correct data", () => {
    renderComponent();
    const movementsButton = screen.getByText("Movimientos");
    fireEvent.click(movementsButton);
    expect(screen.getByText("Detalle de movimientos")).toBeInTheDocument();
  });

  it("renders no movements message when movements array is empty", () => {
    renderComponent({ movementsData: [] });
    expect(
      screen.getByText("No hay movimientos disponibles para este aporte")
    ).toBeInTheDocument();
  });

  it("renders movements error message when present", () => {
    renderComponent({ movementsError: "Error en movimientos" });
    expect(screen.getByText("Error en movimientos")).toBeInTheDocument();
  });

  it("renders both detail and movements errors when present", () => {
    renderComponent({
      detailError: "Error en detalle",
      movementsError: "Error en movimientos",
    });
    // const errorMessages = screen.getAllByTestId("box-message");
    // expect(errorMessages).toHaveLength(2);
    expect(screen.getByText("Error en detalle")).toBeInTheDocument();
    expect(screen.getByText("Error en movimientos")).toBeInTheDocument();
  });

  it("renders null detailData correctly", () => {
    renderComponent({ detailData: null });
    const detailsButton = screen.getByText("Aportes");
    fireEvent.click(detailsButton);
    expect(screen.getByText("No hay detalles para mostrar")).toBeVisible();
  });

  it("renders null movementsData correctly", () => {
    renderComponent({ movementsData: null });
    const movementsButton = screen.getByText("Movimientos");
    fireEvent.click(movementsButton);
    expect(
      screen.getByText("No hay movimientos disponibles para este aporte")
    ).toBeVisible();
  });

  it("renders correctly with all data present", () => {
    renderComponent();
    expect(screen.getByText("Resumen del Aporte")).toBeInTheDocument();
    expect(screen.getByText("Aportes")).toBeInTheDocument();
    expect(screen.getByText("Movimientos")).toBeInTheDocument();
  });
});