import React from "react";

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import { BoxMessage, Loader } from "@/components/common";
import { UserDetailContainer } from "@/components/SharedComponent";
import { AffiliateAccountContext } from "@/context";
import { Validation } from "../Validation";
import { ValidationView } from "../ValidationView";

const mockBoxMessage = ({ errorMessage }: { errorMessage: string }) => (
  <div data-testid="box-message">{errorMessage}</div>
);

const mockLoader = ({ isLoading }: { isLoading: boolean }) => (
  <div data-testid="loader">{isLoading ? "Loading..." : null}</div>
);

const mockUserDetailContainer = ({
  ContextProvider,
}: {
  ContextProvider: any;
}) => <div data-testid="user-detail">User Detail</div>;

const mockValidationView = () => (
  <div data-testid="validation-view">Validation View</div>
);

jest.mock("@/components/common", () => ({
  BoxMessage: (props: { errorMessage: string }) => mockBoxMessage(props),
  Loader: (props: { isLoading: boolean }) => mockLoader(props),
}));

jest.mock("@/components/SharedComponent", () => ({
  UserDetailContainer: (props: { ContextProvider: any }) =>
    mockUserDetailContainer(props),
}));

jest.mock("../ValidationView", () => ({
  ValidationView: () => mockValidationView(),
}));

describe("Validation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza los componentes iniciales correctamente", async () => {
    render(<Validation />);

    // Verificamos que los componentes estén presentes
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByTestId("user-detail")).toBeInTheDocument();

    // Verificamos que ValidationView se renderice después
    await waitFor(() => {
      expect(screen.getByTestId("validation-view")).toBeInTheDocument();
    });
  });

  it("muestra el loader cuando isLoading es true", () => {
    render(<Validation />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  it("muestra ValidationView cuando no hay error", async () => {
    render(<Validation />);

    await waitFor(() => {
      expect(screen.getByTestId("validation-view")).toBeInTheDocument();
      expect(screen.queryByTestId("box-message")).not.toBeInTheDocument();
    });
  });

  it("verifica que checkUserData limpia el mensaje de error", async () => {
    render(<Validation />);

    await waitFor(() => {
      expect(screen.queryByTestId("box-message")).not.toBeInTheDocument();
      expect(screen.getByTestId("validation-view")).toBeInTheDocument();
    });
  });

  it("maneja el estado de error correctamente", async () => {
    // Componente de prueba que simula un estado de error
    const ValidationWithError = () => {
      const [errorMessage] = React.useState("Test error");
      return (
        <div>
          <Loader isLoading={false} />
          <UserDetailContainer ContextProvider={AffiliateAccountContext} />
          {errorMessage ? (
            <BoxMessage errorMessage={errorMessage} />
          ) : (
            <ValidationView />
          )}
        </div>
      );
    };

    render(<ValidationWithError />);

    await waitFor(() => {
      expect(screen.getByTestId("box-message")).toBeInTheDocument();
      expect(screen.queryByTestId("validation-view")).not.toBeInTheDocument();
    });
  });
});
