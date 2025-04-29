import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Contribution } from "../Contribution";
import { AffiliateAccountContext } from "@/context";
import {
  contributionPost,
  contributionDetailPost,
  movementsPost,
} from "@/services";
import { mockContributionResponse, mockDetailResponse } from "@/mocks";

jest.mock("@/services", () => ({
  contributionPost: jest.fn(),
  contributionDetailPost: jest.fn(),
  movementsPost: jest.fn(),
}));

jest.mock("../ContributionView", () => ({
  ContributionView: ({
    contributionData,
    errorMessage,
    handleFilterSubmit,
    handleFilterReset,
    handleConsultDetail,
    handleBackToContributions,
    handleDownloadTotalContributions,
    handleDownloadContributions,
    setSelectedRecord,
    showDetail,
    detailData,
    movementsData,
  }: any) => (
    <div data-testid="contribution-view">
      <div data-testid="error-message">{errorMessage}</div>
      <button onClick={handleFilterSubmit} data-testid="submit-button">
        Submit
      </button>
      <button onClick={handleFilterReset} data-testid="reset-button">
        Reset
      </button>
      <button onClick={handleConsultDetail} data-testid="detail-button">
        Ver Detalle
      </button>
      <button onClick={handleBackToContributions} data-testid="back-button">
        Volver
      </button>
      <button
        onClick={handleDownloadTotalContributions}
        data-testid="download-total-button"
      >
        Descargar Total
      </button>
      <button
        onClick={handleDownloadContributions}
        data-testid="download-contributions-button"
      >
        Descargar Aportes
      </button>
      <div data-testid="contribution-data">
        {contributionData.map((item: any) => (
          <button
            key={item.uniqueId}
            onClick={() => setSelectedRecord(item)}
            data-testid={`record-${item.cuentaAporteId}`}
          >
            {item.cuentaId}
          </button>
        ))}
      </div>
      {showDetail && detailData && (
        <div data-testid="detail-view">
          Detalle visible
          {movementsData && movementsData.length > 0 && (
            <div data-testid="movements-data">
              {movementsData.length} movimientos
            </div>
          )}
        </div>
      )}
    </div>
  ),
}));

describe("Contribution Component", () => {
  const mockContextValue = {
    cuentaId: "123456",
    userDetail: null,
    setCuentaId: jest.fn(),
    setUserDetail: jest.fn(),
  };

  const mockMovementsResponse = {
    status: {
      statusCode: 200,
      statusDescription: "Success",
    },
    data: {
      movimiento: [{ id: "1", descripcion: "Movimiento 1" }],
      page: { totalElement: 1, totalPage: 0 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (contributionPost as jest.Mock).mockResolvedValue(mockContributionResponse);
    (contributionDetailPost as jest.Mock).mockResolvedValue(mockDetailResponse);
    (movementsPost as jest.Mock).mockResolvedValue(mockMovementsResponse);
  });

  const customRender = (ui: any, options = {}) =>
    render(
      <MantineProvider>
        <AffiliateAccountContext.Provider value={mockContextValue}>
          {ui}
        </AffiliateAccountContext.Provider>
      </MantineProvider>,
      options
    );

  test("fetches contribution data on mount when cuentaId exists", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(contributionPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaId: "123456",
          page: { page: 0, size: 20 },
        })
      );
    });
  });

  test("shows error message when no cuentaId is provided", async () => {
    const noIdContext = { ...mockContextValue, cuentaId: null };

    await act(async () => {
      render(
        <MantineProvider>
          <AffiliateAccountContext.Provider value={noIdContext}>
            <Contribution />
          </AffiliateAccountContext.Provider>
        </MantineProvider>
      );
    });

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "No se ha seleccionado una cuenta."
    );
  });

  test("handles filter submit successfully", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("submit-button"));
    });

    await waitFor(() => {
      expect(contributionPost).toHaveBeenCalledTimes(2);
    });
  });

  test("handles filter reset successfully", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("reset-button"));
    });

    await waitFor(() => {
      expect(contributionPost).toHaveBeenCalled();
    });
  });

  test("handles contribution detail view successfully", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("record-54181595")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("record-54181595"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("detail-button"));
    });

    await waitFor(() => {
      expect(contributionDetailPost).toHaveBeenCalledWith({
        cuentaAporteId: 54181595,
        cuentaId: 94199,
        page: { page: 0, size: 50 },
      });
      expect(movementsPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaAporteId: 54181595,
          cuentaId: 94199,
          periodoPago: null,
          periodoPagoFin: null,
          conceptoId: null,
          codigoOperacionId: null,
          page: { page: 0, size: 100 },
        })
      );
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("detail-view")).toBeInTheDocument();
        expect(screen.getByTestId("movements-data")).toHaveTextContent(
          "1 movimientos"
        );
      },
      { timeout: 3000 }
    );
  });

  test("handles error in contribution fetch", async () => {
    (contributionPost as jest.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al consultar aportes."
      );
    });
  });

  test("handles back to contributions list", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("back-button"));
    });

    expect(screen.queryByTestId("detail-view")).not.toBeInTheDocument();
  });

  test("handles status code 206 response", async () => {
    (contributionPost as jest.Mock).mockResolvedValue({
      status: {
        statusCode: 206,
        statusDescription:
          "No hay información para los criterios seleccionados.",
      },
    });

    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No hay información para los criterios seleccionados."
      );
    });
  });

  test("handles status code 400 response", async () => {
    (contributionPost as jest.Mock).mockResolvedValue({
      status: {
        statusCode: 400,
        statusDescription: "Error en los datos enviados.",
      },
    });

    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error en los datos enviados."
      );
    });
  });


  test("cleans up states when returning to contribution list", async () => {
    await act(async () => {
      customRender(<Contribution />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("record-54181595")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("record-54181595"));
    await act(async () => {
      fireEvent.click(screen.getByTestId("detail-button"));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("back-button"));
    });

    expect(screen.queryByTestId("detail-view")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).toHaveTextContent("");
  });

});
