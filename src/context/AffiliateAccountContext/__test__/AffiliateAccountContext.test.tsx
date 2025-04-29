import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import {
  AffiliateAccountContext,
  AffiliateAccountProvider,
} from "../AffiliateAccountContext";

const TestComponent = () => {
  const { cuentaId, setCuentaId, userDetail, setUserDetail } = useContext(
    AffiliateAccountContext
  );

  return (
    <div>
      <div data-testid="cuenta-id">{cuentaId || "no-cuenta"}</div>
      <div data-testid="user-name">
        {userDetail?.nombreCompleto || "no-user"}
      </div>
      <button onClick={() => setCuentaId(123)} data-testid="set-cuenta-button">
        Set Cuenta
      </button>
      <button
        onClick={() => setUserDetail({ nombreCompleto: "John Doe" } as any)}
        data-testid="set-user-button"
      >
        Set User
      </button>
    </div>
  );
};

describe("AffiliateAccountContext", () => {
  const renderWithProvider = (Component: React.ReactNode) => {
    return render(
      <AffiliateAccountProvider>{Component}</AffiliateAccountProvider>
    );
  };

  test("provides default values", () => {
    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("no-cuenta");
    expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
  });

  test("updates cuentaId through context", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
    });

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
  });

  test("updates userDetail through context", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-user-button").click();
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
  });

  test("can handle multiple state updates", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
      screen.getByTestId("set-user-button").click();
    });

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
  });

  test("provides context to nested components", () => {
    const NestedComponent = () => {
      const { cuentaId } = useContext(AffiliateAccountContext);
      return <div data-testid="nested-cuenta">{cuentaId || "no-cuenta"}</div>;
    };

    renderWithProvider(
      <div>
        <TestComponent />
        <NestedComponent />
      </div>
    );

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
    });

    expect(screen.getByTestId("nested-cuenta")).toHaveTextContent("123");
  });

  test("maintains state between renders", () => {
    const { rerender } = renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
    });

    rerender(
      <AffiliateAccountProvider>
        <TestComponent />
      </AffiliateAccountProvider>
    );

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
  });

  test("handles null values correctly", () => {
    const TestNullComponent = () => {
      const { setCuentaId, setUserDetail } = useContext(
        AffiliateAccountContext
      );

      return (
        <div>
          <button
            onClick={() => setCuentaId(null)}
            data-testid="set-null-cuenta"
          >
            Set Null Cuenta
          </button>
          <button
            onClick={() => setUserDetail(null)}
            data-testid="set-null-user"
          >
            Set Null User
          </button>
        </div>
      );
    };

    renderWithProvider(<TestNullComponent />);

    act(() => {
      screen.getByTestId("set-null-cuenta").click();
      screen.getByTestId("set-null-user").click();
    });
  });
});
