import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultNavigation } from "../AffiliateConsultNavigation";

jest.mock("@/components", () => ({
  AffiliateConsultForm: () => (
    <div data-testid="affiliate-consult-form">Consulta de afiliado</div>
  ),
  AffiliateConsultResponse: () => (
    <div data-testid="affiliate-consult-response">Resultado de consulta</div>
  ),
}));

// Mock para ReportDownloadList actualizado para usar userDetail
jest.mock("@/components/SharedComponent/ReportDownloadPopover", () => ({
  ReportDownloadList: ({ userDetail }) => (
    <div data-testid="report-download-list">
      <div data-testid="user-number-id">{userDetail?.numeroIdentificacion}</div>
      <div data-testid="user-type-id">{userDetail?.tipoIdentificacion}</div>
      <div data-testid="user-name">{userDetail?.nombreCompleto}</div>
    </div>
  ),
}));

jest.mock(
  "../../../AffiliateConsultModule/ConsultResult/ConsultResult",
  () => ({
    ConsultResult: () => (
      <div data-testid="consult-result">Cuenta Ley 2381</div>
    ),
  })
);

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Icon: ({ $name, title }) => <div data-testid={`icon-${$name}`}>{title}</div>,
  Button: ({ children, onClick, $type, $size }) => (
    <button
      data-testid="button"
      data-type={$type}
      data-size={$size}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Breadcrumb: ({ $items, $typeContainer }) => (
    <div data-testid="breadcrumb" data-type-container={$typeContainer}>
      {$items &&
        $items.map((item, index) => (
          <div
            key={index}
            data-testid={`breadcrumb-item-${index}`}
            data-label={item.$label}
            data-id={item.$id}
            onClick={item.onClick}
          >
            {item.$label}
          </div>
        ))}
    </div>
  ),
  ParagraphSmall: ({ children }) => (
    <p data-testid="paragraph-small">{children}</p>
  ),
}));

const mockSetCurrentView = jest.fn();
const mockSetCompletedViews = jest.fn();
const mockHandleFilterReset = jest.fn();

const mockContextValues = {
  userDetail: null,
  currentView: "affiliate",
  setCurrentView: mockSetCurrentView,
  completedViews: ["affiliate"],
  setCompletedViews: mockSetCompletedViews,
  handleFilterReset: mockHandleFilterReset,
};

jest.mock("@/context", () => ({
  AffiliateAccountContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children(mockContextValues),
  },
  AffiliateAccountProvider: ({ children }) => (
    <div data-testid="context-provider">{children}</div>
  ),
}));

jest.mock("react", () => {
  const ActualReact = jest.requireActual("react");
  return {
    ...ActualReact,
    useContext: () => mockContextValues,
  };
});

describe("AffiliateConsultNavigation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockContextValues.userDetail = null;
    mockContextValues.currentView = "affiliate";
    mockContextValues.completedViews = ["affiliate"];
  });

  test("renders within AffiliateAccountProvider", () => {
    render(<AffiliateConsultNavigation />);
    expect(screen.getByTestId("context-provider")).toBeInTheDocument();
  });

  test("renders initial view (affiliate) correctly", () => {
    render(<AffiliateConsultNavigation />);

    expect(screen.getByTestId("affiliate-consult-form")).toBeInTheDocument();
    expect(
      screen.queryByTestId("affiliate-consult-response")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("consult-result")).not.toBeInTheDocument();
  });

  test("automatically navigates to affiliateResponse when userDetail is available", () => {
    mockContextValues.userDetail = {
      numeroIdentificacion: "1030591017",
      tipoIdentificacion: "CC",
      nombreCompleto: "Test User",
    };

    render(<AffiliateConsultNavigation />);

    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliateResponse");
  });

  test("shows 'Volver' button when not on affiliate view", () => {
    mockContextValues.currentView = "affiliateResponse";

    render(<AffiliateConsultNavigation />);

    expect(screen.getByTestId("paragraph-small")).toBeInTheDocument();
    expect(screen.getByTestId("paragraph-small")).toHaveTextContent("Volver");
  });

  test("generates breadcrumb items correctly", () => {
    mockContextValues.currentView = "affiliateResponse";
    mockContextValues.completedViews = ["affiliate", "affiliateResponse"];

    render(<AffiliateConsultNavigation />);

    expect(screen.getByTestId("breadcrumb-item-0")).toHaveAttribute(
      "data-label",
      "Home"
    );
    expect(screen.getByTestId("breadcrumb-item-1")).toHaveAttribute(
      "data-label",
      "Consulta de afiliado"
    );
    expect(screen.getByTestId("breadcrumb-item-2")).toHaveAttribute(
      "data-label",
      "Resultado de consulta"
    );
  });

  test("handles clicking on breadcrumb items", () => {
    mockContextValues.currentView = "affiliateResponseAccounts";
    mockContextValues.completedViews = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];

    render(<AffiliateConsultNavigation />);

    fireEvent.click(screen.getByTestId("breadcrumb-item-1"));
    expect(mockHandleFilterReset).toHaveBeenCalled();
    expect(mockSetCompletedViews).toHaveBeenCalledWith(["affiliate"]);
    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliate");

    jest.clearAllMocks();

    fireEvent.click(screen.getByTestId("breadcrumb-item-2"));
    expect(mockHandleFilterReset).not.toHaveBeenCalled();
    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliateResponse");
  });

  test("handles 'Nueva Consulta' button click", () => {
    mockContextValues.currentView = "affiliateResponse";

    render(<AffiliateConsultNavigation />);

    const newConsultButton = screen.getByText("Nueva Consulta");
    expect(newConsultButton).toBeInTheDocument();

    fireEvent.click(newConsultButton);

    expect(mockHandleFilterReset).toHaveBeenCalled();
    expect(mockSetCompletedViews).toHaveBeenCalledWith(["affiliate"]);
    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliate");
  });

  test("handles going back to previous view", () => {
    mockContextValues.currentView = "affiliateResponseAccounts";
    mockContextValues.completedViews = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];

    render(<AffiliateConsultNavigation />);

    const backButton = screen.getByRole("button", {
      name: "Volver a la vista anterior",
    });
    fireEvent.click(backButton);

    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliateResponse");
  });

  test("handles going back to affiliate view (resets navigation)", () => {
    mockContextValues.currentView = "affiliateResponse";
    mockContextValues.completedViews = ["affiliate", "affiliateResponse"];

    render(<AffiliateConsultNavigation />);

    const backButton = screen.getByRole("button", {
      name: "Volver a la vista anterior",
    });
    fireEvent.click(backButton);

    expect(mockHandleFilterReset).toHaveBeenCalled();
    expect(mockSetCompletedViews).toHaveBeenCalledWith(["affiliate"]);
    expect(mockSetCurrentView).toHaveBeenCalledWith("affiliate");
  });

  test("shows ReportDownloadList when on non-affiliate view with userDetail", () => {
    mockContextValues.currentView = "affiliateResponse";
    mockContextValues.userDetail = {
      numeroIdentificacion: "1030591017",
      tipoIdentificacion: "CC",
      nombreCompleto: "Test User",
    };

    render(<AffiliateConsultNavigation />);

    expect(screen.getByTestId("report-download-list")).toBeInTheDocument();
    expect(screen.getByTestId("user-number-id")).toHaveTextContent(
      "1030591017"
    );
    expect(screen.getByTestId("user-type-id")).toHaveTextContent("CC");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
  });

  test("doesn't show ReportDownloadList when userDetail is null", () => {
    mockContextValues.currentView = "affiliateResponse";
    mockContextValues.userDetail = null;

    render(<AffiliateConsultNavigation />);

    expect(
      screen.queryByTestId("report-download-list")
    ).not.toBeInTheDocument();
  });

  test("handles keyboard navigation for 'Volver' button", () => {
    mockContextValues.currentView = "affiliateResponse";

    render(<AffiliateConsultNavigation />);

    const backButton = screen.getByRole("button", {
      name: "Volver a la vista anterior",
    });
    fireEvent.keyDown(backButton, { key: "Enter" });

    expect(mockHandleFilterReset).toHaveBeenCalled();
  });

  test("displays correct component based on currentView", () => {
    mockContextValues.currentView = "affiliate";

    const { rerender } = render(<AffiliateConsultNavigation />);
    expect(screen.getByTestId("affiliate-consult-form")).toBeInTheDocument();

    mockContextValues.currentView = "affiliateResponse";
    rerender(<AffiliateConsultNavigation />);
    expect(
      screen.getByTestId("affiliate-consult-response")
    ).toBeInTheDocument();

    mockContextValues.currentView = "affiliateResponseAccounts";
    rerender(<AffiliateConsultNavigation />);
    expect(screen.getByTestId("consult-result")).toBeInTheDocument();
  });
});
