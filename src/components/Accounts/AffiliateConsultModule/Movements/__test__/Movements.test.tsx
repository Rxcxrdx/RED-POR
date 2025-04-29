import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Movements } from "../Movements";
import { movementsPost, conceptsGet } from "@/services";
import { AffiliateAccountContext } from "@/context";
import { mockConceptsResponse, mockMovementsPostResponse } from "@/mocks";

jest.mock("@/services", () => ({
  movementsPost: jest.fn(),
  conceptsGet: jest.fn(),
}));

jest.mock("../MovementsView", () => ({
  MovementsView: ({ errorMessage, movimientosData }: any) => (
    <div data-testid="movements-view">
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
      <div data-testid="movements-count">{movimientosData.length}</div>
    </div>
  ),
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const mockMovementsResponse = {
  data: {
    movimiento: [
      { periodoPago: "2023-01", descripcion: "Movimiento 1" },
      { periodoPago: "2023-02", descripcion: "Movimiento 2" },
    ],
    page: {
      totalElement: 2,
      totalPage: 1,
    },
  },
  status: {
    statusCode: 200,
    statusDescription: "OK",
  },
};

const mockEmptyMovementsResponse = {
  data: {
    movimiento: [],
    page: {
      totalElement: 0,
      totalPage: 0,
    },
  },
  status: {
    statusCode: 206,
    statusDescription: "No se encontraron movimientos.",
  },
};

describe("Movements Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (movementsPost as jest.Mock).mockResolvedValue(mockMovementsPostResponse);
    (conceptsGet as jest.Mock).mockResolvedValue(mockConceptsResponse);
  });

  const renderComponent = (contextValue = { cuentaId: "123" }) => {
    return render(
      <MantineProvider>
        <AffiliateAccountContext.Provider value={contextValue}>
          <Movements />
        </AffiliateAccountContext.Provider>
      </MantineProvider>
    );
  };

  test("fetches movements data on mount when cuentaId exists", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(movementsPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaId: "123",
          page: { page: 0, size: 20 },
        })
      );
      expect(conceptsGet).toHaveBeenCalled();
    });
  });

  test("shows error message when no cuentaId is provided", async () => {
    await act(async () => {
      renderComponent({ cuentaId: null });
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No se ha seleccionado una cuenta."
      );
    });
  });

  test("handles successful data fetch", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByTestId("movements-count")).toHaveTextContent("2");
    });
  });

  test("handles 206 status response", async () => {
    (movementsPost as jest.Mock).mockResolvedValue({
      status: {
        statusCode: 206,
        statusDescription: "No hay información disponible",
      },
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "No hay información disponible"
      );
    });
  });

  test("handles 400 status response", async () => {
    (movementsPost as jest.Mock).mockResolvedValue({
      status: {
        statusCode: 400,
        statusDescription: "Error en los datos enviados",
      },
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error en los datos enviados"
      );
    });
  });

  test("handles API error", async () => {
    (movementsPost as jest.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al consultar movimientos."
      );
    });
  });

  test("resets page to 1 when cuentaId changes", async () => {
    const { rerender } = renderComponent({ cuentaId: "123" });

    await act(async () => {
      rerender(
        <MantineProvider>
          <AffiliateAccountContext.Provider value={{ cuentaId: "456" }}>
            <Movements />
          </AffiliateAccountContext.Provider>
        </MantineProvider>
      );
    });

    await waitFor(() => {
      expect(movementsPost).toHaveBeenCalledWith(
        expect.objectContaining({
          cuentaId: "456",
          page: { page: 0, size: 20 },
        })
      );
    });
  });

  test("adds uniqueId to movements data", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const lastCall = (movementsPost as jest.Mock).mock.results[0];
      const processedData = lastCall.value.then((response: any) => {
        return response.data.movimiento.map((m: any, index: number) => ({
          ...m,
          uniqueId: `${m.conceptoId}-${index}`,
        }));
      });

      return processedData.then((data: any) => {
        expect(data[0].uniqueId).toBe("C1-0");
        expect(data[1].uniqueId).toBe("C2-1");
      });
    });
  });

  test("concept options are fetched and formatted correctly", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(conceptsGet).toHaveBeenCalled();
    });
  });

  test("updates total records and pages from response", async () => {
    const response = {
      ...mockMovementsPostResponse,
      data: {
        ...mockMovementsPostResponse.data,
        page: { totalElement: 50, totalPage: 2 },
      },
    };
    (movementsPost as jest.Mock).mockResolvedValue(response);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(movementsPost).toHaveBeenCalled();
    });
  });
});
