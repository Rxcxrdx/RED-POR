import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { TransferSuspenseContext } from "@/context";
import { TransferSuspenseContribution } from "../TransferSuspenseContribution";
import { contributionPost } from "@/services";
import { formatPeriodForService } from "@/common/utils";

jest.mock("@/services", () => ({
  contributionPost: jest.fn(),
}));

jest.mock("@/common/utils", () => ({
  formatPeriodForService: jest.fn(),
}));

jest.mock("../TransferSuspenseContributionView", () => ({
  TransferSuspenseContributionView: (props: any) => (
    <div data-testid="mock-view" {...props}>
      <button
        onClick={props.handleFilterSubmitTransferSuspense}
        data-testid="submit-button"
      >
        Consultar
      </button>
      <button
        onClick={props.handleFilterResetTransferSuspense}
        data-testid="reset-button"
      >
        Limpiar
      </button>
      <select
        data-testid="page-size-select"
        onChange={(e) =>
          props.handleItemsPerPageChangeTransferSuspense(Number(e.target.value))
        }
      >
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
      {props.errorMessage && (
        <div data-testid="error-message">{props.errorMessage}</div>
      )}
      {props.isLoading && <div data-testid="loading">Cargando...</div>}
      {props.contributionData?.length > 0 && (
        <div data-testid="contribution-data">
          {props.contributionData.map((item: any) => (
            <div
              key={item.uniqueId}
              onClick={() =>
                props.handleSelectionChangeTransferSuspense([item])
              }
              data-testid={`row-${item.uniqueId}`}
            >
              {item.cuentaId}
            </div>
          ))}
        </div>
      )}
      <div data-testid="total-records">{props.totalRecords}</div>
      <div data-testid="total-pages">{props.totalPages}</div>
      <div data-testid="current-page">{props.page}</div>
    </div>
  ),
}));

describe("TransferSuspenseContribution", () => {
  const mockCuentaId = "123456";
  const mockContextValue = {
    cuentaId: mockCuentaId,
    setCuentaId: jest.fn(),
    setSelectedContributions: jest.fn(),
  };

  const mockContributionResponse = {
    status: {
      statusCode: 200,
      statusDescription: "Success",
    },
    data: {
      aporte: [
        {
          cuentaId: mockCuentaId,
          cuentaAporteId: "AP001",
          fondoId: "F001",
          tipoIdAportante: "CC",
          numeroIdAportante: "12345",
          codigoOperacionId: "OP001",
          fechaPago: "2024-01-15",
          idDisponible: "S",
          periodoPago: "2024-01",
          salarioBase: 1000000,
          salarioBaseCal: 1000000,
          diasInformado: 30,
          diasCalculado: 30,
        },
      ],
      page: {
        totalElement: 1,
        totalPage: 0,
      },
    },
  };

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (contributionPost as jest.Mock).mockResolvedValue(mockContributionResponse);
    (formatPeriodForService as jest.Mock).mockImplementation((value) => value);
  });

  const renderComponent = () => {
    return render(
      <TransferSuspenseContext.Provider value={mockContextValue}>
        <TransferSuspenseContribution />
      </TransferSuspenseContext.Provider>
    );
  };

  it("realiza la consulta inicial cuando hay un cuentaId", async () => {
    renderComponent();

    await waitFor(() => {
      expect(contributionPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaId: mockCuentaId,
          page: { page: 0, size: 20 },
        })
      );
    });
  });

  it("muestra mensaje de error cuando no hay cuentaId", async () => {
    render(
      <TransferSuspenseContext.Provider
        value={{ ...mockContextValue, cuentaId: null }}
      >
        <TransferSuspenseContribution />
      </TransferSuspenseContext.Provider>
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "No se ha seleccionado una cuenta."
    );
  });

  it("maneja la selección de registros correctamente", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("contribution-data")).toBeInTheDocument();
    });

    const row = screen.getByTestId(
      `row-${mockContributionResponse.data.aporte[0].cuentaId}-0`
    );
    fireEvent.click(row);

    expect(mockContextValue.setSelectedContributions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          cuentaId: mockCuentaId,
          cuentaAporteId: "AP001",
        }),
      ])
    );
  });

  it("actualiza la página al cambiar cuentaId", async () => {
    const { rerender } = render(
      <TransferSuspenseContext.Provider value={mockContextValue}>
        <TransferSuspenseContribution />
      </TransferSuspenseContext.Provider>
    );

    rerender(
      <TransferSuspenseContext.Provider
        value={{ ...mockContextValue, cuentaId: "789" }}
      >
        <TransferSuspenseContribution />
      </TransferSuspenseContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });
  });

  it("maneja el envío del formulario con filtros", async () => {
    renderComponent();

    await act(async () => {
      fireEvent.click(screen.getByTestId("submit-button"));
    });

    await waitFor(() => {
      expect(contributionPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaId: mockCuentaId,
          page: { page: 0, size: 20 },
        })
      );
    });
  });

  it("maneja errores del servicio con código 206", async () => {
    (contributionPost as jest.Mock).mockResolvedValue({
      status: { statusCode: 206 },
      data: { aporte: [] },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "La consulta no generan datos"
      );
    });
  });

  it("maneja respuestas sin datos correctamente", async () => {
    (contributionPost as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { aporte: [] },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "La consulta no generan datos"
      );
    });
  });

  it("formatea correctamente el periodo para el servicio", async () => {
    renderComponent();

    await waitFor(() => {
      expect(formatPeriodForService).toHaveBeenCalled();
    });
  });

  it("actualiza totalRecords y totalPages correctamente", async () => {
    (contributionPost as jest.Mock).mockResolvedValue({
      ...mockContributionResponse,
      data: {
        ...mockContributionResponse.data,
        page: {
          totalElement: 100,
          totalPage: 4,
        },
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("total-records")).toHaveTextContent("100");
      expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
    });
  });

  it("reinicia la página al cambiar el tamaño de página", async () => {
    renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByTestId("page-size-select"), {
        target: { value: "50" },
      });
    });

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });
});
