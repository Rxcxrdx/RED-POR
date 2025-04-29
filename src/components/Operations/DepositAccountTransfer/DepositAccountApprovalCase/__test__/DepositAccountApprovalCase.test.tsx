import React from "react";
import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";

import { DepositAccountTransferContext } from "@/context";
import { getCaseApprovalInformationService } from "@/services/operations";
import { DepositAccountApprovalCase } from "../DepositAccountApprovalCase";

jest.mock("@/services/operations", () => ({
  getCaseApprovalInformationService: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  useCaseApplication: () => ({
    handleSubmitCase: jest.fn(),
    handleApplyCase: jest.fn(),
    handleRejectCase: jest.fn(),
    isLoading: false,
    caseNumber: "123",
    errorMessage: "",
    successMessage: "",
    isCaseSaved: false,
  }),
  useValidationOperation: () => ({
    validationData: [],
    handleValidateOperation: jest.fn(),
  }),
  useTableData: () => ({
    tableProperties: {
      $currentPage: 0,
      $totalPages: 0,
      $itemsPerPage: 30,
      $totalItems: 30,
      $onPageChange: () => {},
      $onItemsPerPageChange: () => {},
      $onSelectionChange: () => {},
      $onSort: () => () => {},
      $itemsPerPageOptions: [10, 20, 50, 100],
      $variants: ["headerGray", "withShadow", "stripedRows"],
    },
  }),
}));

const mockContextValue = {
  cuentaId: 123456,
  userDetail: {
    name: "John Doe",
    id: "12345",
  },
  setCuentaId: jest.fn(),
  setUserDetail: jest.fn(),
};

const mockDepositAccountData = {
  affiliateBalance: [{ id: 1, balance: 1000 }],
  contributionSummary: [{ id: 1, contribution: 500 }],
  transferInformation: {},
  caseData: {},
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>
    <DepositAccountTransferContext.Provider value={mockContextValue}>
      {children}
    </DepositAccountTransferContext.Provider>
  </MantineProvider>
);

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("DepositAccountApprovalCase Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component correctly", async () => {
    customRender(<DepositAccountApprovalCase />);

    expect(screen.getByText("Saldo del afiliado")).toBeInTheDocument();
    expect(screen.getByText("Resumen aportes asociados")).toBeInTheDocument();
  });

  it("should fetch deposit account data on mount", async () => {
    (getCaseApprovalInformationService as jest.Mock).mockResolvedValue({
      data: { casesApproval: mockDepositAccountData },
    });

    customRender(<DepositAccountApprovalCase />);

    await waitFor(() => {
      expect(getCaseApprovalInformationService).toHaveBeenCalledTimes(1);
    });
  });

  it("should render loading state while fetching data", () => {
    customRender(<DepositAccountApprovalCase />);
    const loadingElement =
      screen.getByTestId("spinner-container") ||
      screen.getByRole("progressbar") ||
      screen.getByText("Cargando información...");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should have disabled submit button when form is invalid", () => {
    customRender(<DepositAccountApprovalCase />);
    const submitButton = screen.getByText("Guardar Caso");
    expect(submitButton).toBeDisabled();
  });

  it("should render fund options dropdown", () => {
    customRender(<DepositAccountApprovalCase />);
    expect(screen.getByText("Fondo")).toBeInTheDocument();
  });
});
