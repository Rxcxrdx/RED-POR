import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { ContributionView } from "../ContributionView";

jest.mock("../form/ContributionFilterForm", () => ({
  ContributionFilterForm: ({
    handleFilterSubmit,
    handleFilterReset,
    totalDetailsData,
  }: any) => (
    <div data-testid="filter-form">
      <button onClick={handleFilterSubmit} data-testid="submit-button">
        Submit
      </button>
      <button onClick={handleFilterReset} data-testid="reset-button">
        Reset
      </button>
      {totalDetailsData?.aporte && (
        <button data-testid="download-button">Descargar detalles</button>
      )}
    </div>
  ),
}));

jest.mock("../ContributionTable", () => ({
  ContributionTable: ({ records, setSelectedRecord }: any) => (
    <div data-testid="contribution-table">
      {records.map((record: any) => (
        <div key={record.id} onClick={() => setSelectedRecord(record)}>
          {record.id}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../ContributionDetail/ContributionDetail", () => ({
  ContributionDetail: ({ onBack }: any) => (
    <div data-testid="contribution-detail">
      <button onClick={onBack} data-testid="back-button">
        Back
      </button>
    </div>
  ),
}));

jest.mock("@/components/SharedComponent", () => ({
  UserDetailContainer: () => <div data-testid="user-detail">User Detail</div>,
}));

describe("ContributionView Component", () => {
  const defaultProps = {
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    handleFilterReset: jest.fn(),
    setSelectedRecord: jest.fn(),
    handleFilterSubmit: jest.fn(),
    handleConsultDetail: jest.fn(),
    handleBackToContributions: jest.fn(),
    page: 1,
    pageSize: 10,
    isLoading: false,
    detailData: null,
    showDetail: false,
    totalPages: 1,
    errorMessage: "",
    totalRecords: 0,
    selectedRecord: null,
    contributionData: [],
    filterFormContribution: {
      onSubmit: jest.fn(),
      getInputProps: jest.fn(),
    },
    totalDetailsData: null,
  };

  const renderComponent = (props = {}) => {
    return render(<ContributionView {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders main components when not showing detail", () => {
    renderComponent();

    expect(screen.getByTestId("filter-form")).toBeInTheDocument();
    expect(screen.getByTestId("contribution-table")).toBeInTheDocument();
  });

  test("shows error message when provided", () => {
    const errorMessage = "Test error message";
    renderComponent({ errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId("contribution-table")).not.toBeInTheDocument();
  });

  test("renders ContributionDetail when showDetail is true", () => {
    renderComponent({ showDetail: true });

    expect(screen.getByTestId("contribution-detail")).toBeInTheDocument();
    expect(screen.queryByTestId("filter-form")).not.toBeInTheDocument();
  });

  test("shows consultation detail button when record is selected and no error", () => {
    renderComponent({
      selectedRecord: { id: 1 },
      errorMessage: "",
      showDetail: false,
    });

    const consultButton = screen.getByText("Consultar detalle del aporte");
    expect(consultButton).toBeInTheDocument();
  });

  test("handles back button click in detail view", () => {
    renderComponent({ showDetail: true });

    const backButton = screen.getByTestId("back-button");
    fireEvent.click(backButton);

    expect(defaultProps.handleBackToContributions).toHaveBeenCalled();
  });

  test("handles filter form submission", () => {
    renderComponent();

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(defaultProps.handleFilterSubmit).toHaveBeenCalled();
  });

  test("handles filter form reset", () => {
    renderComponent();

    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    expect(defaultProps.handleFilterReset).toHaveBeenCalled();
  });

  test("does not show consultation button when there is an error", () => {
    renderComponent({
      selectedRecord: { id: 1 },
      errorMessage: "Some error",
      showDetail: false,
    });

    expect(
      screen.queryByText("Consultar detalle del aporte")
    ).not.toBeInTheDocument();
  });

  test("renders contribution table with correct data", () => {
    const mockData = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
    ];

    renderComponent({
      contributionData: mockData,
      totalRecords: 2,
    });

    expect(screen.getByTestId("contribution-table")).toBeInTheDocument();
    mockData.forEach((item) => {
      expect(screen.getByText(item.id.toString())).toBeInTheDocument();
    });
  });

  test("handles consultation detail button click", () => {
    renderComponent({
      selectedRecord: { id: 1 },
    });

    const consultButton = screen.getByText("Consultar detalle del aporte");
    fireEvent.click(consultButton);

    expect(defaultProps.handleConsultDetail).toHaveBeenCalled();
  });

  test("renders download button when totalDetailsData is provided", () => {
    const totalDetailsData = {
      aporte: [
        {
          aporteDetalleId: "12806",
          cuentaId: "52504333",
          aporteId: "2692",
          fondoId: "1",
          inversionId: "1",
          concepto: "SOL",
          pesos: "7380",
          unidades: "6.81971689",
          unidadesRecaudador: "6.81971689",
          tercero: null,
          porcentaje: "1",
          fechaCreacion: "1994-12-27 00:00:00.0",
          usuarioCreacion: "OPS$CTMAG89",
          fechaModificacion: null,
          usuarioModificacion: null,
          descripcionInversion: null,
          afectaSaldoCuenta: null,
          periodoPago: "200408",
          fechaPago: "2004-09-09 00:00:00.0",
          tipoIdAportante: "NIT",
          numeroIdAportante: "830120003",
          diasInformado: "30",
          diasCalculado: "30",
          salarioBase: "1000000",
          salarioBaseCal: "1000000",
          tipoCotizanteId: "DEPENDIENTE",
          codigoOperacionId: "RECAUDO_NORMAL_CCAI",
          codigoAfp: "null",
          fechaOtroFondo: "null",
          fechaProceso: "2004-09-15 00:00:00.0",
        },
      ],
    };

    renderComponent({ totalDetailsData });

    expect(screen.getByTestId("download-button")).toBeInTheDocument();
  });

  test("does not render download button when totalDetailsData is not provided", () => {
    renderComponent();

    expect(screen.queryByTestId("download-button")).not.toBeInTheDocument();
  });
});
