import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultResponse2381 } from "../AffiliateConsultResponse2381";
import { AffiliateAccountContext } from "@/context";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Button: ({ children, onClick, $type }) => (
    <button onClick={onClick} data-testid="button" data-type={$type}>
      {children}
    </button>
  ),
  H6: ({ children, justify, color, className }) => (
    <h6
      data-testid="h6"
      data-justify={justify}
      data-color={color}
      className={className}
    >
      {children}
    </h6>
  ),
  Icon: ({ $name, title, $w, $h }) => (
    <span data-testid={`icon-${$name}`} data-width={$w} data-height={$h}>
      {title}
    </span>
  ),
  ParagraphNormal: ({ children }) => (
    <p data-testid="paragraph-normal">{children}</p>
  ),
  ParagraphSmall: ({ children, color, fontWeight, className }) => (
    <p
      data-testid="paragraph-small"
      data-color={color}
      data-font-weight={fontWeight}
      className={className}
    >
      {children}
    </p>
  ),
  Subtitulo: ({ children, justify, className, fontWeight }) => (
    <h5
      data-testid="subtitulo"
      data-justify={justify}
      data-font-weight={fontWeight}
      className={className}
    >
      {children}
    </h5>
  ),
}));

jest.mock("@/components/common", () => ({
  BoxError: () => (
    <div data-testid="box-error">Sin información para mostrar</div>
  ),
}));

jest.mock("@/components/SharedComponent", () => ({
  FlatTable: ({ data, columns }) => (
    <div data-testid="flat-table">
      <div data-testid="table-columns">{JSON.stringify(columns)}</div>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

describe("AffiliateConsultResponse2381 Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccountData = {
    folio: 123456,
    saldo: "$1,000,000",
    estado: "Activo",
    subestado: "Normal",
    vinculacion: "Directo",
    tipoAfiliado: "Dependiente",
    valorUltimoPago: "$50,000",
    fechaUltimoPago: "2025-01-15",
    periodoUltimoPago: "Enero 2025",
    nitUltimoPago: "900123456",
    cuentaId: 987654321,
    sarlaft: "Verificado",
  };

  const mockSetCompletedViews = jest.fn();
  const mockSetCurrentView = jest.fn();

  const renderWithContext = (contextValue = {}) => {
    return render(
      <AffiliateAccountContext.Provider value={contextValue}>
        <AffiliateConsultResponse2381 />
      </AffiliateAccountContext.Provider>
    );
  };

  test("renders error state when no account data is provided", () => {
    renderWithContext({
      accountData: [],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByTestId("box-error")).toBeInTheDocument();
    expect(
      screen.getByText("Componente Complementario Ahorro Individual - CCAI")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Saldos y movimientos desde 1 de julio del 2025")
    ).toBeInTheDocument();
    expect(screen.getByText("Consultar cuenta")).toBeInTheDocument();
  });

  test("renders error state when account data is null", () => {
    renderWithContext({
      accountData: null,
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByTestId("box-error")).toBeInTheDocument();
  });

  test("renders account details when account data is available", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByText("987654321")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();

    expect(screen.getByAltText("savings icon")).toBeInTheDocument();

    expect(screen.getByTestId("flat-table")).toBeInTheDocument();

    expect(screen.queryByTestId("box-error")).not.toBeInTheDocument();
  });

  test("renders correctly with missing account data fields", () => {
    const incompleteAccount = {
      cuentaId: 987654321,
    };

    renderWithContext({
      accountData: [incompleteAccount],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByText("987654321")).toBeInTheDocument();

    const tableData = JSON.parse(
      screen.getByTestId("table-data").textContent || "[]"
    );
    expect(tableData[0].estadoSub).toBe("-");
    expect(tableData[0].subEstado).toBe("-");
    expect(tableData[0].sarlaf).toBe("-");
  });

  test("navigates to affiliateResponseAccounts view when button is clicked", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    const consultButton = screen.getByText("Consultar cuenta");
    expect(consultButton).toBeInTheDocument();

    fireEvent.click(consultButton);

    expect(mockSetCompletedViews).toHaveBeenCalled();
    expect(mockSetCurrentView).toHaveBeenCalledWith(
      "affiliateResponseAccounts"
    );
  });

  test("renders table columns correctly", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    const columnsString =
      screen.getByTestId("table-columns").textContent || "[]";
    const columns = JSON.parse(columnsString);

    expect(columns.length).toBe(3);
    expect(columns.map((col: any) => col.key)).toContain("estadoSub");
    expect(columns.map((col: any) => col.key)).toContain("subEstado");
    expect(columns.map((col: any) => col.key)).toContain("vinculacion");
  });

  test("renders table data with correct account information", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    const dataString = screen.getByTestId("table-data").textContent || "[]";
    const data = JSON.parse(dataString);

    expect(data.length).toBe(1);
    expect(data[0].estadoSub).toBe("Activo");
    expect(data[0].subEstado).toBe("Normal");
    expect(data[0].sarlaf).toBe("Verificado");
  });

  test("displays $0 when saldo is $0", () => {
    const accountWithZeroBalance = {
      ...mockAccountData,
      saldo: "$0",
    };

    renderWithContext({
      accountData: [accountWithZeroBalance],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  test("displays $0 when saldo is undefined", () => {
    const accountWithNoBalance = {
      ...mockAccountData,
      saldo: undefined,
    };

    renderWithContext({
      accountData: [accountWithNoBalance],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  test("adds affiliateResponseAccounts to completedViews if not already included", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    const consultButton = screen.getByText("Consultar cuenta");
    fireEvent.click(consultButton);

    expect(mockSetCompletedViews).toHaveBeenCalled();
    const setCompletedViewsCallback = mockSetCompletedViews.mock.calls[0][0];

    const prevCompletedViews = ["affiliate", "affiliateResponse"];
    const newCompletedViews = setCompletedViewsCallback(prevCompletedViews);
    expect(newCompletedViews).toContain("affiliateResponseAccounts");
  });

  test("doesn't add duplicate to completedViews if already included", () => {
    renderWithContext({
      accountData: [mockAccountData],
      setCompletedViews: mockSetCompletedViews,
      setCurrentView: mockSetCurrentView,
    });

    const consultButton = screen.getByText("Consultar cuenta");
    fireEvent.click(consultButton);

    const setCompletedViewsCallback = mockSetCompletedViews.mock.calls[0][0];

    const prevCompletedViews = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];
    const newCompletedViews = setCompletedViewsCallback(prevCompletedViews);
    expect(newCompletedViews).toEqual(prevCompletedViews);
    expect(
      newCompletedViews.filter((item) => item === "affiliateResponseAccounts")
        .length
    ).toBe(1);
  });
});
