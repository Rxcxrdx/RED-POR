import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { TransferSuspenseView } from "../TransferSuspenseView";
import { TransferSuspenseContext } from "@/context";

jest.mock("@/components", () => ({
  TransferSuspenseAccount: () => (
    <div data-testid="account-component">Account</div>
  ),
  TransferSuspenseValidation: () => (
    <div data-testid="validation-component">Validation</div>
  ),
  TransferSuspenseContribution: () => (
    <div data-testid="contribution-component">Contribution</div>
  ),
  TransferSuspenseCaseApplication: () => (
    <div data-testid="case-application-component">Case Application</div>
  ),
  TransferSuspenseLaggingParameters: () => (
    <div data-testid="lagging-parameters-component">Lagging Parameters</div>
  ),
}));

const mockSetCurrentTab = jest.fn();
const mockSetCuentaId = jest.fn();
const mockSetAffiliateDetail = jest.fn();
const mockSetSelectedContributions = jest.fn();

const mockContextValue = {
  currentTab: "affiliate",
  setCurrentTab: mockSetCurrentTab,
  cuentaId: "",
  setCuentaId: mockSetCuentaId,
  affiliateDetail: null,
  setAffiliateDetail: mockSetAffiliateDetail,
  selectedContributions: [],
  setSelectedContributions: mockSetSelectedContributions,
};

const Wrapper = ({ children }) => {
  return (
    <MantineProvider>
      <TransferSuspenseContext.Provider value={mockContextValue}>
        {children}
      </TransferSuspenseContext.Provider>
    </MantineProvider>
  );
};

describe("TransferSuspenseView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetCurrentTab.mockClear();
  });

  const renderComponent = () => {
    return render(<TransferSuspenseView />, { wrapper: Wrapper });
  };

  it("renderiza el componente correctamente", () => {
    renderComponent();
    expect(screen.getByTestId("account-component")).toBeInTheDocument();
  });

  it("renderiza todas las pestañas", () => {
    renderComponent();

    const expectedTabs = [
      "Afiliado",
      "Aportes",
      "Parametros Rezagos",
      "Validación",
      "Aplicación Caso",
    ];

    expectedTabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it("muestra el componente de Afiliado por defecto", () => {
    renderComponent();
    expect(screen.getByTestId("account-component")).toBeInTheDocument();
  });

  describe("accesibilidad", () => {
    it("tiene roles ARIA apropiados", () => {
      const { container } = renderComponent();

      // Verificar la lista de tabs
      const tabList = screen.getByRole("tablist");
      expect(tabList).toBeInTheDocument();

      // Verificar los tabs individuales
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(5);

      // Verificar los paneles (incluyendo los ocultos)
      const tabPanels = container.querySelectorAll('[role="tabpanel"]');
      expect(tabPanels).toHaveLength(5);

      // Verificar que solo un panel está visible
      const visiblePanels = Array.from(tabPanels).filter(
        (panel) => window.getComputedStyle(panel).display !== "none"
      );
      expect(visiblePanels).toHaveLength(1);

      // Verificar atributos ARIA
      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute(
          "aria-selected",
          index === 0 ? "true" : "false"
        );
        expect(tab).toHaveAttribute("aria-controls");
        const controlledPanel = container.querySelector(
          `#${tab.getAttribute("aria-controls")}`
        );
        expect(controlledPanel).toBeInTheDocument();
      });
    });
  });

  describe("layout y estilos", () => {
    it("muestra el layout básico", () => {
      renderComponent();
      const tabsRoot = screen
        .getByRole("tablist")
        .closest(".mantine-Tabs-root");
      expect(tabsRoot).toBeInTheDocument();
      expect(screen.getByTestId("account-component")).toBeInTheDocument();
    });

    it("aplica el color correcto a las pestañas", () => {
      renderComponent();
      const tabsRoot = screen
        .getByRole("tablist")
        .closest(".mantine-Tabs-root");
      expect(tabsRoot).toHaveStyle({ "--tabs-color": "#fb6903" });
    });
  });
});
