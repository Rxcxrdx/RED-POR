import React from "react";
import { render } from "@testing-library/react";

import { AffiliateAccountContext } from "@/context";
import { mockGetValidityResponse } from "@/mocks";
import * as services from "@/services";

import { Validity } from "../Validity";

jest.mock("@/services", () => ({
  getValidityService: jest.fn(),
}));

const mockContextValue = {
  cuentaId: 123456,
  userDetail: null,
  setCuentaId: jest.fn(),
  setUserDetail: jest.fn(),
};

const AllTheProviders = ({ children }: any) => (
  <AffiliateAccountContext.Provider value={mockContextValue}>
    {children}
  </AffiliateAccountContext.Provider>
);

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("Validity Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (services.getValidityService as jest.Mock).mockResolvedValue(
      mockGetValidityResponse
    );
  });

  test("Render component correctly", () => {
    expect(customRender(<Validity />));
  });
});
