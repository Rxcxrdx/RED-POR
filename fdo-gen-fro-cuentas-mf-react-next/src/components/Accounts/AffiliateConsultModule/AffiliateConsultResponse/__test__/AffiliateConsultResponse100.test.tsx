import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultResponse100 } from "../AffiliateConsultResponse100";
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

const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe("AffiliateConsultResponse100 Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPensionAccount = {
    fechaCreacion: "2020-01-01",
    numeroCuenta: 123456789,
    estado: "Activo",
    subestado: "Normal",
    semanas: "520",
    saldoMenor23SMLV: "$1,000,000",
    saldoMayor23SMLV: "$5,000,000",
    esTransicion: "No",
    esOportunidad: "Sí",
    anosPension: 25,
  };

  const renderWithContext = (contextValue = {}) => {
    return render(
      <AffiliateAccountContext.Provider value={contextValue}>
        <AffiliateConsultResponse100 />
      </AffiliateAccountContext.Provider>
    );
  };

  test("renders error state when no pension accounts are provided", () => {
    renderWithContext({ pensionAccounts: [] });

    expect(screen.getByTestId("box-error")).toBeInTheDocument();
    expect(
      screen.getByText("Saldos Ahorro Individual con Solidaridad - RAIS")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Saldos y movimientos hasta 30 de junio 2025")
    ).toBeInTheDocument();
    expect(screen.getByText("Ir a multifondos")).toBeInTheDocument();
  });

  test("renders error state when pension accounts is null", () => {
    renderWithContext({ pensionAccounts: null });

    expect(screen.getByTestId("box-error")).toBeInTheDocument();
  });

  test("renders account details when pension accounts are available", () => {
    renderWithContext({ pensionAccounts: [mockPensionAccount] });

    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("520")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();
    expect(screen.getByText("$5,000,000")).toBeInTheDocument();

    expect(screen.getByTestId("icon-calendarToday")).toBeInTheDocument();
    expect(screen.getAllByAltText("savings icon").length).toBe(2);

    expect(screen.getByTestId("flat-table")).toBeInTheDocument();

    expect(screen.queryByTestId("box-error")).not.toBeInTheDocument();
  });

  test("renders correctly with missing account data fields", () => {
    const incompleteAccount = {
      numeroCuenta: 123456789,
    };

    renderWithContext({ pensionAccounts: [incompleteAccount] });

    expect(screen.getByText("123456789")).toBeInTheDocument();

    const subtitulos = screen.getAllByTestId("subtitulo");
    expect(subtitulos.some((el) => el.textContent === "-")).toBe(true);

    const tableData = JSON.parse(
      screen.getByTestId("table-data").textContent || "[]"
    );
    expect(tableData[0].estado).toBe("-");
    expect(tableData[0].subEstadoAfiliado).toBe("-");
  });

  test("opens multifondos link when button is clicked", () => {
    renderWithContext({ pensionAccounts: [mockPensionAccount] });

    const multifondosButton = screen.getByText("Ir a multifondos");
    expect(multifondosButton).toBeInTheDocument();

    fireEvent.click(multifondosButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://mfondos.porvenir.com/multifondos/",
      "_blank"
    );
  });

  test("renders table columns correctly", () => {
    renderWithContext({ pensionAccounts: [mockPensionAccount] });

    const columnsString =
      screen.getByTestId("table-columns").textContent || "[]";
    const columns = JSON.parse(columnsString);

    expect(columns.length).toBe(9);
    expect(columns.map((col: any) => col.key)).toContain("estado");
    expect(columns.map((col: any) => col.key)).toContain("subEstadoAfiliado");
    expect(columns.map((col: any) => col.key)).toContain("vinculacion");
  });

  test("renders table data with correct account information", () => {
    renderWithContext({ pensionAccounts: [mockPensionAccount] });

    const dataString = screen.getByTestId("table-data").textContent || "[]";
    const data = JSON.parse(dataString);

    expect(data.length).toBe(1);
    expect(data[0].estado).toBe("Activo");
    expect(data[0].subEstadoAfiliado).toBe("Normal");
  });

  test("renders header text correctly", () => {
    renderWithContext({ pensionAccounts: [mockPensionAccount] });

    expect(
      screen.getByText("Saldos Ahorro Individual con Solidaridad - RAIS")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Saldos y movimientos hasta 30 de junio 2025")
    ).toBeInTheDocument();
    expect(screen.getByText("Cuenta número")).toBeInTheDocument();
  });
});
