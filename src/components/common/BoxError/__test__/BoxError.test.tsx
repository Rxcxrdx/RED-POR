import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BoxError } from "../BoxError";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Enfasis: ({ children, justify, color }) => (
    <h4 data-testid="enfasis" data-justify={justify} data-color={color}>
      {children}
    </h4>
  ),
  Icon: ({ $name, $h, $w, title }) => (
    <div
      data-testid={`icon-${$name}`}
      data-height={$h}
      data-width={$w}
      data-title={title}
    >
      {title}
    </div>
  ),
  ParagraphNormal: ({ children }) => (
    <p data-testid="paragraph-normal">{children}</p>
  ),
}));

describe("BoxError Component", () => {
  test("renders with correct structure", () => {
    render(<BoxError />);

    expect(screen.getByTestId("icon-warningAmber")).toBeInTheDocument();
    expect(screen.getByTestId("enfasis")).toBeInTheDocument();
    expect(screen.getByTestId("paragraph-normal")).toBeInTheDocument();
  });

  test("displays correct error messages", () => {
    render(<BoxError />);

    expect(screen.getByText("¡Ups! datos no encontrados")).toBeInTheDocument();
    expect(
      screen.getByText("Ha ocurrido un error, inténtalo más tarde")
    ).toBeInTheDocument();
  });

  test("renders warning icon with correct props", () => {
    render(<BoxError />);

    const icon = screen.getByTestId("icon-warningAmber");
    expect(icon).toHaveAttribute("data-height", "40px");
    expect(icon).toHaveAttribute("data-width", "40px");
    expect(icon).toHaveAttribute("data-title", "warningAmber");
  });

  test("enfasis has correct styling props", () => {
    render(<BoxError />);

    const enfasis = screen.getByTestId("enfasis");
    expect(enfasis).toHaveAttribute("data-justify", "start");
    expect(enfasis).toHaveAttribute("data-color", "#6B7280");
  });

  test("renders with correct container structure", () => {
    const { container } = render(<BoxError />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      border: "1px solid #BBBEC5",
      padding: "32px",
      borderRadius: "12px",
    });
  });

  test("content container has correct style", () => {
    render(<BoxError />);

    const contentContainer = screen.getByTestId("enfasis")
      .parentElement as HTMLElement;
    expect(contentContainer).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "start",
    });
  });

  test("has proper gap between icon and text content", () => {
    const { container } = render(<BoxError />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({
      gap: "20px",
    });
  });
});
