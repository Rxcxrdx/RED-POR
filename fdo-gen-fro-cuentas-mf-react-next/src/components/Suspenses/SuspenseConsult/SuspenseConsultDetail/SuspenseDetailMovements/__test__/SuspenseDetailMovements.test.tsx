import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { SuspenseDetailMovements } from "../SuspenseDetailMovements";
import { suspenseMovementsPost } from "@/services/suspenses";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { formatCurrency } from "@/common/utils";

jest.mock("@/services/suspenses", () => ({
  suspenseMovementsPost: jest.fn(),
}));

jest.mock("../../../../../SharedComponent/BaseTable", () => ({
  BaseTable: (props: any) => (
    <div data-testid="mock-view" {...props}>
      <button
        onClick={() => props.setPage(2)}
        data-testid="next-page-button"
      >
        Next Page
      </button>
      <button
        onClick={() => props.handleItemsPerPageChange(50)}
        data-testid="change-page-size-button"
      >
        Change Page Size
      </button>
      <button
        onClick={props.handleDownload}
        data-testid="download-button"
      >
        Download
      </button>
      {props.errorMessage && (
        <div data-testid="error-message">{props.errorMessage}</div>
      )}
      {props.isLoading && <div data-testid="loading">Loading...</div>}
      <table>
        <thead>
          <tr>
            {props.columns.map((column: any) => (
              <th key={column.$key}>{column.$header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.records.map((record: any, index: number) => (
            <tr key={index}>
              <td>{record.codigoOperacionId}</td>
              <td>{record.fechaCreacion}</td>
              <td>{formatCurrency(record.salarioBase)}</td>
              <td>{formatCurrency(record.valorPesos)}</td>
              <td>{formatCurrency(record.numeroUnidades)}</td>
              <td>{formatCurrency(record.valorPesosHistorico)}</td>
              <td>{formatCurrency(record.numeroUnidadesHistorico)}</td>
              <td>{record.porcentaje}</td>
              <td>{record.fechaOperacion}</td>
              <td>{record.rezagoMovimientoId}</td>
              <td>{record.idDisponible}</td>
              <td>{record.fechaGiro}</td>
              <td>{record.idBeneficiario}</td>
              <td>{record.diasInformado}</td>
              <td>{record.diasCalculado}</td>
              <td>{record.casoId}</td>
              <td>{record.numeroAsientoId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

describe("SuspenseDetailMovements", () => {
  const mockSuspense = [
    {
      rezagoId: "RZ123",
    },
  ];
  const mockMovementsResponse = {
    status: {
      statusCode: 200,
      statusDescription: "Success",
    },
    data: {
      listaRezagoMovimientoResponseDto: [
        {
          codigoOperacionId: "OP123",
          fechaCreacion: "2023-01-01",
          salarioBase: 100000,
          valorPesos: 50000,
          numeroUnidades: 1000,
          valorPesosHistorico: 30000,
          numeroUnidadesHistorico: 500,
          porcentaje: "15.00",
          fechaOperacion: "2023-01-02",
          rezagoMovimientoId: "RM123",
          idDisponible: "Disponible",
          fechaGiro: "2023-01-03",
          idBeneficiario: "Benef123",
          diasInformado: 30,
          diasCalculado: 25,
          casoId: "Caso123",
          numeroAsientoId: "Asiento123",
        },
      ],
      page: {
        totalElement: 1,
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
    (suspenseMovementsPost as jest.Mock).mockResolvedValue(mockMovementsResponse);
  });

  const renderComponent = (suspense: any[] = [], movements: any[] = []) => {
    return render(
      <SuspenseConsultContext.Provider
        value={{ suspense, movements, setMovements: jest.fn() }}
      >
        <SuspenseDetailMovements />
      </SuspenseConsultContext.Provider>
    );
  };

  it("realiza la consulta inicial correctamente", async () => {
    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(suspenseMovementsPost).toHaveBeenCalledWith({
        rezagoId: mockSuspense[0].rezagoId,
        page: { page: 1, size: 20 },
      });
    });
  });

  it("muestra mensaje de error cuando no hay datos", async () => {
    (suspenseMovementsPost as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { listaRezagoMovimientoResponseDto: [] },
    });

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Los parámetros de consulta no generan información"
      );
    });
  });

  it("maneja errores del servicio correctamente", async () => {
    (suspenseMovementsPost as jest.Mock).mockRejectedValue(new Error("Error"));

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Ocurrió un error al realizar la consulta de novedades por rezago"
      );
    });
  });

  it("muestra mensaje de error cuando no se selecciona un rezago", async () => {
    renderComponent([]);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No se ha seleccionado un rezago."
      );
    });
  });

  it("cambia de página correctamente", async () => {
    renderComponent(mockSuspense);

    fireEvent.click(screen.getByTestId("next-page-button"));

    await waitFor(() => {
      expect(suspenseMovementsPost).toHaveBeenCalledWith({
        rezagoId: mockSuspense[0].rezagoId,
        page: { page: 1, size: 20 },
      });
    });
  });

  it("cambia el tamaño de página correctamente", async () => {
    renderComponent(mockSuspense);

    fireEvent.click(screen.getByTestId("change-page-size-button"));

    await waitFor(() => {
      expect(suspenseMovementsPost).toHaveBeenCalledWith({
        rezagoId: mockSuspense[0].rezagoId,
        page: { page: 1, size: 20 },
      });
    });
  });

  it("muestra mensaje de error al descargar sin movimientos", async () => {
    renderComponent([]);

    fireEvent.click(screen.getByTestId("download-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No se encontraron movimientos del rezago."
      );
    });
  });

  it("muestra mensaje de error cuando ocurre un error inesperado", async () => {
    (suspenseMovementsPost as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Ocurrió un error al realizar la consulta de novedades por rezago"
      );
    });
  });

  it("formatea correctamente los valores monetarios usando CURRENCY_FORMATTER", async () => {
    renderComponent(mockSuspense, mockMovementsResponse.data.listaRezagoMovimientoResponseDto);

    await waitFor(() => {
      expect(screen.getByText("$ 100.000")).toBeInTheDocument();
      expect(screen.getByText("$ 50.000")).toBeInTheDocument();
      expect(screen.getByText("$ 30.000")).toBeInTheDocument();
      expect(screen.getByText("$ 1.000")).toBeInTheDocument();
      expect(screen.getByText("$ 500")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de error al intentar descargar sin un rezagoId", async () => {
    renderComponent([{ rezagoId: null }]);

    fireEvent.click(screen.getByTestId("download-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No se encontraron movimientos del rezago."
      );
    });
  });

  it("muestra mensaje de error cuando se prodeuce un error 500 al consultar los movimientos a descargar", async () => {
    (suspenseMovementsPost as jest.Mock).mockResolvedValue({
      status: { statusCode: 500 },
      data: { listaRezagoMovimientoResponseDto: [] },
    });

    renderComponent(mockSuspense);

    fireEvent.click(screen.getByTestId("download-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al descargar los movimientos"
      );
    });
  });

  it("muestra mensaje de error al fallar la descarga", async () => {
    (suspenseMovementsPost as jest.Mock).mockRejectedValue(new Error("Error"));

    renderComponent(mockSuspense);

    fireEvent.click(screen.getByTestId("download-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al descargar los movimientos."
      );
    });
  });

  it("muestra mensaje de error cuando el servicio devuelve un código de estado diferente a 200", async () => {
    (suspenseMovementsPost as jest.Mock).mockResolvedValue({
      status: { statusCode: 400 },
      data: { listaRezagoMovimientoResponseDto: [] },
    });

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Los parámetros de consulta no generan información"
      );
    });
  });

  it("muestra mensaje de error cuando no hay un rezagoId en el suspense", async () => {
    renderComponent([{ rezagoId: null }]);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No se ha seleccionado un rezago."
      );
    });
  });

  it("muestra mensaje de error cuando ocurre un error inesperado", async () => {
    (suspenseMovementsPost as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Ocurrió un error al realizar la consulta de novedades por rezago"
      );
    });
  });

});