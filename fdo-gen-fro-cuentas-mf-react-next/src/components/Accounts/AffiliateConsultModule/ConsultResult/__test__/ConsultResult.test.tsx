import React from "react";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

import { AffiliateAccountContext } from "@/context";
import { ConsultResult } from "../ConsultResult";

jest.mock("../../index.ts", () => ({
  Movements: () => <div data-testid="movements">Movements Component</div>,
  Contribution: () => (
    <div data-testid="contribution">Contribution Component</div>
  ),
  Balance: () => <div data-testid="balance">Balance Component</div>,
  Validity: () => <div data-testid="validity">Validity Component</div>,
}));

jest.mock("../ConsultResult.common", () => ({
  formatUserDetail: jest.fn(() => ({ name: "Test User", id: "123" })),
}));

const mockUserDetail = { name: "Test User", id: "123" };

const renderComponent = (contextValues = {}) => {
  const defaultContext = {
    cuentaId: "123456",
    userDetail: mockUserDetail,
    accountData: [{ saldo: 1000 }],
    setCuentaId: jest.fn(),
    setUserDetail: jest.fn(),
    ...contextValues,
  };

  return render(
    <MantineProvider>
      <AffiliateAccountContext.Provider value={defaultContext}>
        <ConsultResult />
      </AffiliateAccountContext.Provider>
    </MantineProvider>
  );
};

describe("ConsultResult Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders component correctly with account data", () => {
    renderComponent();
    expect(screen.queryByTestId("box-message")).not.toBeInTheDocument();
    expect(screen.getByText("Aportes")).toBeInTheDocument();
    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Saldos")).toBeInTheDocument();
    expect(screen.getByText("Vigencias")).toBeInTheDocument();
  });

  test("Shows error message when no accountId is provided", () => {
    renderComponent({ cuentaId: null });
    expect(
      screen.getByText("No se ha seleccionado una cuenta.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Aportes")).not.toBeInTheDocument();
  });

  test("Handles null accountData correctly", () => {
    renderComponent({ accountData: null });
    expect(screen.queryByTestId("box-message")).not.toBeInTheDocument();
  });

  test("Handles empty accountData array correctly", () => {
    renderComponent({ accountData: [] });
    expect(screen.queryByTestId("box-message")).not.toBeInTheDocument();
  });
});
