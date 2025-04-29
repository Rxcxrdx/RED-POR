import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultResponseView } from "../AffiliateConsultResponseView";

jest.mock("../AffiliateConsultResponseUserDetail", () => ({
  AffiliateConsultResponseUserDetail: () => (
    <div data-testid="affiliate-consult-response-user-detail">
      User Detail Component
    </div>
  ),
}));

jest.mock("../AffiliateConsultResponse2381", () => ({
  AffiliateConsultResponse2381: () => (
    <div data-testid="affiliate-consult-response-2381">
      Response 2381 Component
    </div>
  ),
}));

jest.mock("../AffiliateConsultResponse100", () => ({
  AffiliateConsultResponse100: () => (
    <div data-testid="affiliate-consult-response-100">
      Response 100 Component
    </div>
  ),
}));

describe("AffiliateConsultResponseView Component", () => {
  const mockProps = {
    accountData: [{ id: 1, cuentaId: 123456, saldo: "$1,000,000" }],
    pensionAccounts: [{ id: 1, numeroCuenta: 789012, saldo: "$2,000,000" }],
  };

  test("renders all three child components", () => {
    render(<AffiliateConsultResponseView {...mockProps} />);

    expect(
      screen.getByTestId("affiliate-consult-response-user-detail")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("affiliate-consult-response-2381")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("affiliate-consult-response-100")
    ).toBeInTheDocument();
  });

  test("renders with correct container styling", () => {
    const { container } = render(
      <AffiliateConsultResponseView {...mockProps} />
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      paddingBottom: "100px",
    });
  });

  test("renders child components in correct order", () => {
    render(<AffiliateConsultResponseView {...mockProps} />);

    const childComponents = screen.getAllByTestId(/affiliate-consult-response/);
    expect(childComponents).toHaveLength(3);
    expect(childComponents[0]).toHaveAttribute(
      "data-testid",
      "affiliate-consult-response-user-detail"
    );
    expect(childComponents[1]).toHaveAttribute(
      "data-testid",
      "affiliate-consult-response-2381"
    );
    expect(childComponents[2]).toHaveAttribute(
      "data-testid",
      "affiliate-consult-response-100"
    );
  });

  test("renders even with no props", () => {
    render(
      <AffiliateConsultResponseView accountData={null} pensionAccounts={null} />
    );

    expect(
      screen.getByTestId("affiliate-consult-response-user-detail")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("affiliate-consult-response-2381")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("affiliate-consult-response-100")
    ).toBeInTheDocument();
  });

  test("renders within a single fragment", () => {
    const { container } = render(
      <AffiliateConsultResponseView {...mockProps} />
    );
    expect(container.childNodes.length).toBe(1);
  });

  test("has correct gap between child components", () => {
    const { container } = render(
      <AffiliateConsultResponseView {...mockProps} />
    );
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({
      gap: "32px",
    });
  });
});
