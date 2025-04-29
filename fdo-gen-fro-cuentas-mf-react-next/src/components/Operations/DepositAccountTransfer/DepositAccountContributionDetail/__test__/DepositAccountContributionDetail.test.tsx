import React from "react";
import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

import { DepositAccountTransferContext } from "@/context";
import * as services from "@/services";
import { DepositAccountContributionDetail } from "../DepositAccountContributionDetail";

const mockContextValue = {
  cuentaId: 123456,
  userDetail: null,
  setCuentaId: jest.fn(),
  setUserDetail: jest.fn(),
};

const AllTheProviders = ({ children }: any) => (
  <MantineProvider>
    <DepositAccountTransferContext.Provider value={mockContextValue}>
      {children}
    </DepositAccountTransferContext.Provider>
  </MantineProvider>
);

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("DepositAccountContributionDetail Component", () => {
  it("should render component correctly", () => {
    expect(customRender(<DepositAccountContributionDetail />));
  });
});
