import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultResponseUserDetail } from "../AffiliateConsultResponseUserDetail";
import { AffiliateAccountContext } from "@/context";

jest.mock("@/components/common", () => ({
  BoxError: () => (
    <div data-testid="box-error">Sin información para mostrar</div>
  ),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  ParagraphNormal: ({ children }) => (
    <p data-testid="paragraph-normal">{children}</p>
  ),
  ParagraphSmall: ({ children, color, fontWeight }) => (
    <p
      data-testid="paragraph-small"
      data-color={color}
      data-font-weight={fontWeight}
    >
      {children}
    </p>
  ),
  Subtitulo: ({ children, color, fontWeight }) => (
    <h5
      data-testid="subtitulo"
      data-color={color}
      data-font-weight={fontWeight}
    >
      {children}
    </h5>
  ),
  Accordion: ({ children, $contentColor, $activeIndex }) => (
    <div
      data-testid="accordion"
      data-content-color={$contentColor}
      data-active-index={$activeIndex}
    >
      {children}
    </div>
  ),
  AccordionTab: ({ children, $header }) => (
    <div
      data-testid={`accordion-tab-${$header
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <h3
        data-testid="accordion-header"
        onClick={() =>
          fireEvent.click(
            screen.getByTestId(
              `accordion-tab-${$header.replace(/\s+/g, "-").toLowerCase()}`
            )
          )
        }
      >
        {$header}
      </h3>
      <div data-testid="accordion-content">{children}</div>
    </div>
  ),
}));

describe("AffiliateConsultResponseUserDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserDetail = {
    nombreCompleto: "Juan Pérez",
    numeroIdentificacion: "1234567890",
    tipoIdentificacion: "CC",
    afiliadoFondoId: "EMP123",
    razonSocial: "Empresa Test S.A.",
    ultimoIbcPago: "$2,000,000",
    ultimaFechaPago: "2025-01-15",
    ultimoPeriodoPago: "Enero 2025",
    infoTabla: {
      transicion: "No",
      genero: "Masculino",
      edad: "35 años",
      fechaNacimiento: "1990-01-01",
      sarlaft: "Verificado",
      direccion: "Calle 123 # 45-67",
      barrio: "Centro",
      ciudad: "Bogotá",
      telefono: "6011234567",
      email: "juan.perez@example.com",
      celular: "3001234567",
      ocupacion: "Ingeniero",
    },
  };

  const renderWithContext = (contextValue = {}) => {
    return render(
      <AffiliateAccountContext.Provider value={contextValue}>
        <AffiliateConsultResponseUserDetail />
      </AffiliateAccountContext.Provider>
    );
  };

  test("renders error state when no user detail is provided", () => {
    renderWithContext({ userDetail: null });
    expect(screen.getByTestId("box-error")).toBeInTheDocument();
  });

  test("displays user name and identification", () => {
    renderWithContext({ userDetail: mockUserDetail });

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("CC 1234567890")).toBeInTheDocument();
  });

  test("displays basic user information correctly", () => {
    renderWithContext({ userDetail: mockUserDetail });

    expect(screen.getByText("Transición")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();

    expect(screen.getByText("Género")).toBeInTheDocument();
    expect(screen.getByText("Masculino")).toBeInTheDocument();

    expect(screen.getByText("Edad")).toBeInTheDocument();
    expect(screen.getByText("35 años")).toBeInTheDocument();

    expect(screen.getByText("Fecha de nacimiento")).toBeInTheDocument();
    expect(screen.getByText("1990-01-01")).toBeInTheDocument();

    expect(screen.getByText("SARLAFT")).toBeInTheDocument();
    expect(screen.getByText("Verificado")).toBeInTheDocument();
  });

  test("handles missing user information with dash placeholder", () => {
    const incompleteUserDetail = {
      ...mockUserDetail,
      infoTabla: {
        ...mockUserDetail.infoTabla,
        transicion: undefined,
        genero: null,
        edad: "",
      },
    };

    renderWithContext({ userDetail: incompleteUserDetail });

    const paragraphs = screen.getAllByTestId("paragraph-normal");
    const dashValues = paragraphs.filter((p) => p.textContent === "-");
    expect(dashValues.length).toBeGreaterThan(0);
  });

  test("renders accordion with two tabs", () => {
    renderWithContext({ userDetail: mockUserDetail });

    expect(screen.getByTestId("accordion")).toBeInTheDocument();
    expect(
      screen.getByTestId("accordion-tab-información-del-afiliado")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("accordion-tab-información-del-empleador")
    ).toBeInTheDocument();
  });

  test("displays affiliate information in first accordion tab", () => {
    renderWithContext({ userDetail: mockUserDetail });

    const affiliateTab = screen.getByTestId(
      "accordion-tab-información-del-afiliado"
    );

    expect(affiliateTab).toContainElement(screen.getByText("Dirección"));
    expect(affiliateTab).toContainElement(
      screen.getByText("Calle 123 # 45-67")
    );

    expect(affiliateTab).toContainElement(screen.getByText("Email"));
    expect(affiliateTab).toContainElement(
      screen.getByText("juan.perez@example.com")
    );

    expect(affiliateTab).toContainElement(screen.getByText("Celular"));
    expect(affiliateTab).toContainElement(screen.getByText("3001234567"));
  });

  test("displays employer information in second accordion tab", () => {
    renderWithContext({ userDetail: mockUserDetail });

    const employerTab = screen.getByTestId(
      "accordion-tab-información-del-empleador"
    );

    expect(employerTab).toContainElement(screen.getByText("Id. empleador"));
    expect(employerTab).toContainElement(screen.getByText("EMP123"));

    expect(employerTab).toContainElement(screen.getByText("Razón social"));
    expect(employerTab).toContainElement(screen.getByText("Empresa Test S.A."));

    expect(employerTab).toContainElement(screen.getByText("IBC informado"));
    expect(employerTab).toContainElement(screen.getByText("$2,000,000"));
  });

  test("displays dash for missing employer information", () => {
    renderWithContext({
      userDetail: {
        ...mockUserDetail,
        afiliadoFondoId: undefined,
        razonSocial: null,
      },
    });

    const employerTab = screen.getByTestId(
      "accordion-tab-información-del-empleador"
    );
    const paragraphs = Array.from(
      employerTab.querySelectorAll('[data-testid="paragraph-normal"]')
    );
    const dashValues = paragraphs.filter((p) => p.textContent === "-");
    expect(dashValues.length).toBeGreaterThan(0);
  });

  test("renders InfoItem component correctly", () => {
    renderWithContext({ userDetail: mockUserDetail });

    const labels = screen.getAllByTestId("paragraph-small");
    expect(labels.some((el) => el.textContent === "Transición")).toBe(true);
    expect(labels.some((el) => el.textContent === "Género")).toBe(true);

    const values = screen.getAllByTestId("paragraph-normal");
    expect(values.some((el) => el.textContent === "Masculino")).toBe(true);
    expect(values.some((el) => el.textContent === "35 años")).toBe(true);
  });

  test("renders correctly when userDetail has minimal information", () => {
    const minimalUserDetail = {
      nombreCompleto: "Test User",
      numeroIdentificacion: "9876543210",
      infoTabla: {},
    };

    renderWithContext({ userDetail: minimalUserDetail });

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();

    const labels = screen.getAllByTestId("paragraph-small");
    expect(labels.some((el) => el.textContent === "Transición")).toBe(true);
    expect(labels.some((el) => el.textContent === "Género")).toBe(true);

    const values = screen.getAllByTestId("paragraph-normal");
    expect(
      values.filter((el) => el.textContent === "-").length
    ).toBeGreaterThan(5);
  });
});
