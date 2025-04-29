import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DepositAccountTransferView } from "../DepositAccountTransferView";
import { DepositAccountTransferContext } from "@/context";

jest.mock("../../DepositAccountAffiliate/DepositAccountAffiliate", () => ({
  DepositAccountAffiliate: () => (
    <div data-testid="affiliate-component">Consulta de Afiliado</div>
  ),
}));

jest.mock("../../DepositAccountValidation/DepositAccountValidation", () => ({
  DepositAccountValidation: () => (
    <div data-testid="validation-component">Validaciones</div>
  ),
}));

jest.mock(
  "../../DepositAccountContribution/DepositAccountContribution",
  () => ({
    DepositAccountContribution: () => (
      <div data-testid="contribution-component">Consulta de Aportes</div>
    ),
  })
);

jest.mock(
  "../../DepositAccountApprovalCase/DepositAccountApprovalCase",
  () => ({
    __esModule: true,
    DepositAccountApprovalCase: () => (
      <div data-testid="approval-case-component">Aplicación caso</div>
    ),
  })
);

jest.mock(
  "../../DepositAccountContributionDetail/DepositAccountContributionDetail",
  () => ({
    __esModule: true,
    DepositAccountContributionDetail: () => (
      <div data-testid="contribution-detail-component">Detalles de Aportes</div>
    ),
  })
);

const mockSetCurrentTab = jest.fn();
const mockContextValue = {
  currentTab: "affiliate",
  setCurrentTab: mockSetCurrentTab,
};

const Wrapper = ({ children }) => {
  return (
    <DepositAccountTransferContext.Provider value={mockContextValue}>
      {children}
    </DepositAccountTransferContext.Provider>
  );
};

describe("DepositAccountTransferView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetCurrentTab.mockClear();
  });

  const renderComponent = () => {
    return render(<DepositAccountTransferView />, { wrapper: Wrapper });
  };

  it("renderiza el componente correctamente", () => {
    renderComponent();
    expect(screen.getByTestId("affiliate-component")).toBeInTheDocument();
  });

  it("renderiza todas las pestañas", () => {
    renderComponent();

    const expectedTabs = [
      "Consulta de Afiliado",
      "Consulta de Aportes",
      "Detalles de Aportes",
      "Validaciones",
      "Aplicación caso",
    ];

    expectedTabs.forEach((tab) => {
      const elements = screen.getAllByText(tab);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("muestra el componente de Afiliado por defecto", () => {
    renderComponent();
    expect(screen.getByTestId("affiliate-component")).toBeInTheDocument();
    expect(screen.getByTestId("affiliate-component")).toBeVisible();
  });

  describe("visibilidad de componentes", () => {
    it("muestra solo el componente activo", () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId("affiliate-component")).toBeVisible();

      expect(screen.queryByTestId("contribution-component")).not.toBeVisible();
      expect(screen.queryByTestId("validation-component")).not.toBeVisible();
      expect(screen.queryByTestId("approval-case-component")).not.toBeVisible();
      expect(
        screen.queryByTestId("contribution-detail-component")
      ).not.toBeVisible();

      const newContextValue = {
        ...mockContextValue,
        currentTab: "contribution",
      };

      rerender(
        <DepositAccountTransferContext.Provider value={newContextValue}>
          <DepositAccountTransferView />
        </DepositAccountTransferContext.Provider>
      );
    });
  });

  describe("propiedades de los tabs", () => {
    it("configura correctamente las propiedades de los tabs", () => {
      renderComponent();

      const tabs = document.querySelectorAll(".tvr-comp-tab");

      tabs.forEach((tab) => {
        expect(tab).toHaveClass("tvr-comp-tab-bordered");
        expect(tab).toHaveAttribute("aria-disabled", "false");
      });

      const activeTab = document.querySelector(".tvr-comp-tab-active");
      expect(activeTab).toBeInTheDocument();
      expect(activeTab).toHaveClass("tab-activated");
    });
  });
});
