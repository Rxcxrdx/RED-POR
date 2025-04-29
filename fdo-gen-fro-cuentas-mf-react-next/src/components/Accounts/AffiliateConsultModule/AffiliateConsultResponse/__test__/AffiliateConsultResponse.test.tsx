import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AffiliateConsultResponse } from "../AffiliateConsultResponse";
import { AffiliateAccountContext } from "@/context";

jest.mock("../AffiliateConsultResponseView", () => ({
  AffiliateConsultResponseView: ({ accountData, pensionAccounts }: any) => (
    <div data-testid="affiliate-consult-response-view">
      <div data-testid="account-data">{JSON.stringify(accountData)}</div>
      <div data-testid="pension-accounts">
        {JSON.stringify(pensionAccounts)}
      </div>
    </div>
  ),
}));

describe("AffiliateConsultResponse Component", () => {
  const mockAccountData = [
    { id: "1", accountNumber: "123456789", status: "active" },
    { id: "2", accountNumber: "987654321", status: "inactive" },
  ];

  const mockPensionAccounts = [
    { id: "1", type: "A", balance: 1000 },
    { id: "2", type: "B", balance: 2000 },
  ];

  const renderWithContext = (contextValue: any) => {
    return render(
      <AffiliateAccountContext.Provider value={contextValue}>
        <AffiliateConsultResponse />
      </AffiliateAccountContext.Provider>
    );
  };

  test("renders the component with empty data", () => {
    renderWithContext({
      pensionAccounts: [],
      accountData: [],
    });

    expect(
      screen.getByTestId("affiliate-consult-response-view")
    ).toBeInTheDocument();
    expect(screen.getByTestId("account-data")).toHaveTextContent("[]");
    expect(screen.getByTestId("pension-accounts")).toHaveTextContent("[]");
  });

  test("renders the component with account data", () => {
    renderWithContext({
      pensionAccounts: [],
      accountData: mockAccountData,
    });

    expect(
      screen.getByTestId("affiliate-consult-response-view")
    ).toBeInTheDocument();
    expect(screen.getByTestId("account-data")).toHaveTextContent(
      JSON.stringify(mockAccountData)
    );
    expect(screen.getByTestId("pension-accounts")).toHaveTextContent("[]");
  });

  test("renders the component with pension accounts", () => {
    renderWithContext({
      pensionAccounts: mockPensionAccounts,
      accountData: [],
    });

    expect(
      screen.getByTestId("affiliate-consult-response-view")
    ).toBeInTheDocument();
    expect(screen.getByTestId("account-data")).toHaveTextContent("[]");
    expect(screen.getByTestId("pension-accounts")).toHaveTextContent(
      JSON.stringify(mockPensionAccounts)
    );
  });

  test("renders the component with both account data and pension accounts", () => {
    renderWithContext({
      pensionAccounts: mockPensionAccounts,
      accountData: mockAccountData,
    });

    expect(
      screen.getByTestId("affiliate-consult-response-view")
    ).toBeInTheDocument();
    expect(screen.getByTestId("account-data")).toHaveTextContent(
      JSON.stringify(mockAccountData)
    );
    expect(screen.getByTestId("pension-accounts")).toHaveTextContent(
      JSON.stringify(mockPensionAccounts)
    );
  });

  test("passes the correct props to AffiliateConsultResponseView", () => {
    renderWithContext({
      pensionAccounts: mockPensionAccounts,
      accountData: mockAccountData,
    });

    const accountDataElement = screen.getByTestId("account-data");
    const pensionAccountsElement = screen.getByTestId("pension-accounts");

    expect(JSON.parse(accountDataElement.textContent || "[]")).toEqual(
      mockAccountData
    );
    expect(JSON.parse(pensionAccountsElement.textContent || "[]")).toEqual(
      mockPensionAccounts
    );
  });

  test("handles undefined values gracefully", () => {
    renderWithContext({});

    expect(
      screen.getByTestId("affiliate-consult-response-view")
    ).toBeInTheDocument();
    expect(screen.getByTestId("account-data")).toHaveTextContent("");
    expect(screen.getByTestId("pension-accounts")).toHaveTextContent("");
  });
});
