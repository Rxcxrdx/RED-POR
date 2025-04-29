import React from "react";
import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { AffiliateAccountContext } from "@/context";
import * as services from "@/services";

import {
  mockPostSearchValidationService,
  mockPostValidationOperationService,
  mockCreateValidationService,
} from "@/mocks";

import { ConsultCases } from "../ConsultCases";

jest.mock("@/services", () => ({
  postSearchValidationsService: jest.fn(),
  postValidationOperationService: jest.fn(),
  createValidationService: jest.fn(),
}));

const mockContextValue = {
  cuentaId: 123456,
  userDetail: null,
  setCuentaId: jest.fn(),
  setUserDetail: jest.fn(),
};

const AllTheProviders = ({ children }: any) => (
  <MantineProvider>
    <AffiliateAccountContext.Provider value={mockContextValue}>
      {children}
    </AffiliateAccountContext.Provider>
  </MantineProvider>
);

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("Validation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (services.postSearchValidationsService as jest.Mock).mockResolvedValue(
      mockPostSearchValidationService
    );
    (services.postValidationOperationService as jest.Mock).mockResolvedValue(
      mockPostValidationOperationService
    );
    (services.createValidationService as jest.Mock).mockResolvedValue(
      mockCreateValidationService
    );
  });

  test("Render component correctly", () => {
    expect(customRender(<ConsultCases />));
  });
});
