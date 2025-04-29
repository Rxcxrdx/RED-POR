import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";

import { AffiliateAccountContext } from "@/context";
import * as services from "@/services";
import { mockGetBalanceResponse } from "@/mocks";
import { Balance } from "../Balance";

const mockGetDispersionResponse = {
  status: {
    statusCode: 200,
  },
  data: {
    dispersiones: [
      {
        id: 1,
        fecha: "2025-03-15",
        monto: 1500,
        estatus: "completada",
      },
      {
        id: 2,
        fecha: "2025-03-10",
        monto: 2500,
        estatus: "completada",
      },
    ],
  },
};

jest.mock("@/services", () => ({
  getBalanceByAccountNumber: jest.fn(),
  getDispersionService: jest.fn(),
}));

const mockContextValue = {
  cuentaId: 123456,
  userDetail: null,
  setCuentaId: jest.fn(),
  setUserDetail: jest.fn(),
  setBalanceData: jest.fn(),
};

const AllTheProviders = ({ children }: any) => (
  <AffiliateAccountContext.Provider value={mockContextValue}>
    {children}
  </AffiliateAccountContext.Provider>
);

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("Balance Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (services.getBalanceByAccountNumber as jest.Mock).mockResolvedValue(
      mockGetBalanceResponse
    );
    (services.getDispersionService as jest.Mock).mockResolvedValue(
      mockGetDispersionResponse
    );
  });

  test("Render component correctly", () => {
    expect(customRender(<Balance />));
  });

  test("Should show error message when no cuentaid is provided", async () => {
    const noIdContext = { ...mockContextValue, cuentaId: null };

    await act(async () => {
      render(
        <AffiliateAccountContext.Provider value={noIdContext}>
          <Balance />
        </AffiliateAccountContext.Provider>
      );
    });

    expect(screen.getByText("No se ha seleccionado una cuenta.")).toBeVisible();
  });

  test("Should fetch balance data and dispersion data when component mounts", async () => {
    await act(async () => {
      customRender(<Balance />);
    });

    await waitFor(() => {
      expect(services.getBalanceByAccountNumber).toHaveBeenCalledWith(123456);
      expect(services.getDispersionService).toHaveBeenCalledWith(123456);
    });
  });

  test("Should show error message when balance service fails", async () => {
    (services.getBalanceByAccountNumber as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    await act(async () => {
      customRender(<Balance />);
    });

    await waitFor(() => {
      expect(screen.getByText("Error al consultar saldos.")).toBeVisible();
    });
  });

  test("Should set balance data correctly when service returns data", async () => {
    const balanceData = mockGetBalanceResponse.data.saldos;

    await act(async () => {
      customRender(<Balance />);
    });

    await waitFor(() => {
      expect(mockContextValue.setBalanceData).toHaveBeenCalledWith(balanceData);
    });
  });

  test("Should handle empty balance data", async () => {
    (services.getBalanceByAccountNumber as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { saldos: null },
    });

    await act(async () => {
      customRender(<Balance />);
    });

    await waitFor(() => {
      expect(mockContextValue.setBalanceData).toHaveBeenCalledWith(null);
    });
  });

  test("Should handle empty dispersion data", async () => {
    (services.getDispersionService as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { dispersiones: null },
    });

    await act(async () => {
      customRender(<Balance />);
    });

    expect(screen.queryByText("Error al consultar dispersiones.")).toBeNull();
  });
});
