import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import {
  DepositAccountTransferContext,
  DepositAccountTransferContextProvider,
} from "../DepositAccountTransferContext";

const TestComponent = () => {
  const { cuentaId, setCuentaId, userDetail, setUserDetail } = useContext(
    DepositAccountTransferContext
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

describe("DepositAccountTransferContext", () => {
  const renderWithProvider = (Component: React.ReactNode) => {
    return render(
      <DepositAccountTransferContextProvider>
        {Component}
      </DepositAccountTransferContextProvider>
    );
  };

  test("proporciona valores por defecto", () => {
    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("no-cuenta");
    expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
  });

  test("actualiza cuentaId a través del contexto", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
    });

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
  });

  test("actualiza userDetail a través del contexto", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-user-button").click();
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
  });

  test("maneja múltiples actualizaciones de estado", () => {
    renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
      screen.getByTestId("set-user-button").click();
    });

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
  });

  test("proporciona contexto a componentes anidados", () => {
    const NestedComponent = () => {
      const { cuentaId } = useContext(DepositAccountTransferContext);
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

  test("mantiene el estado entre renderizados", () => {
    const { rerender } = renderWithProvider(<TestComponent />);

    act(() => {
      screen.getByTestId("set-cuenta-button").click();
    });

    rerender(
      <DepositAccountTransferContextProvider>
        <TestComponent />
      </DepositAccountTransferContextProvider>
    );

    expect(screen.getByTestId("cuenta-id")).toHaveTextContent("123");
  });

  test("maneja valores nulos correctamente", () => {
    const TestNullComponent = () => {
      const { setCuentaId, setUserDetail } = useContext(
        DepositAccountTransferContext
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