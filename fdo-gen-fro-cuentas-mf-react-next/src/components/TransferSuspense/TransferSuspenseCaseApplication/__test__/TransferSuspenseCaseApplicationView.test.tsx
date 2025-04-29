import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransferSuspenseContext } from "@/context";

import { TransferSuspenseCaseApplicationView } from "../TransferSuspenseCaseApplicationView";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Button: ({ children, onClick, disabled, type }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-testid="mock-button"
    >
      {children}
    </button>
  ),
  Spinner: ({ $message }: any) => (
    <div data-testid="mock-spinner">{$message}</div>
  ),
}));

jest.mock("@/components/SharedComponent", () => ({
  CaseApplicationForm: ({ filterForm }: any) => (
    <div data-testid="mock-case-form">
      <div data-testid="form-state">
        {JSON.stringify({
          isValid: filterForm.formState.isValid,
          isDirty: filterForm.formState.isDirty,
        })}
      </div>
    </div>
  ),
  UserDetailContainer: ({ ContextProvider }: any) => (
    <div data-testid="mock-user-detail">User Detail Mock</div>
  ),
}));

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }: any) => (
    <div data-testid="mock-box-message">{errorMessage}</div>
  ),
  Loader: (isLoading: boolean) => <>Cargando información...</>,
}));

describe("TransferSuspenseCaseApplicationView", () => {
  const mockHandleSubmitCase = jest.fn();
  const mockHandleApplyCase = jest.fn();
  const mockHandleRejectCase = jest.fn();

  const mockFormMethods = {
    formState: {
      isValid: true,
      isDirty: true,
    },
    trigger: jest.fn().mockResolvedValue(true),
  };

  const defaultProps = {
    filterFormCaseApplication: mockFormMethods,
    handleSubmitCase: mockHandleSubmitCase,
    handleApplyCase: mockHandleApplyCase,
    handleRejectCase: mockHandleRejectCase,
    isLoading: false,
    errorMessage: "",
    successMessage: "",
    caseNumber: "",
    isCaseSaved: false,
    isButtonSaveDisable: true,
  };

  const mockContextValue = {
    cuentaId: "123",
  };

  const renderComponent = (props = {}, contextValue = mockContextValue) => {
    return render(
      <TransferSuspenseContext.Provider value={contextValue}>
        <TransferSuspenseCaseApplicationView {...defaultProps} {...props} />
      </TransferSuspenseContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar componentes principales cuando hay cuentaId", () => {
    renderComponent();
    expect(screen.getByTestId("mock-user-detail")).toBeInTheDocument();
    expect(screen.getByTestId("mock-case-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
  });

  it("debe mostrar mensaje cuando no hay cuentaId", () => {
    renderComponent({}, { cuentaId: "" });
    expect(screen.getByTestId("mock-box-message")).toHaveTextContent(
      "No se ha seleccionado una cuenta."
    );
  });

  it("debe mostrar el spinner cuando está cargando", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByText("Cargando información...")).toHaveTextContent(
      "Cargando información..."
    );
  });

  it("debe mostrar mensaje de error cuando existe", () => {
    const errorMessage = "Error de prueba";
    renderComponent({ errorMessage });
    expect(screen.getByTestId("mock-box-message")).toHaveTextContent(
      errorMessage
    );
  });

  it("debe mostrar mensaje de éxito con número de caso cuando ambos existen", () => {
    const successMessage = "Caso creado";
    const caseNumber = "CASE-123";
    renderComponent({ successMessage, caseNumber });
    expect(screen.getByTestId("mock-box-message")).toHaveTextContent(
      `${successMessage}. Número de caso: ${caseNumber}`
    );
  });

  it("debe manejar el envío del formulario", async () => {
    renderComponent();
    const form = screen.getByTestId("mock-case-form").closest("form");

    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockFormMethods.trigger).toHaveBeenCalled();
        expect(mockHandleSubmitCase).toHaveBeenCalled();
      });
    }
  });

  it("debe mostrar botón de guardar cuando el caso no está guardado", () => {
    renderComponent({ isCaseSaved: false });
    expect(screen.getByText("Guardar Caso")).toBeInTheDocument();
  });

  it("debe mostrar botones de aplicar y rechazar cuando el caso está guardado", () => {
    renderComponent({ isCaseSaved: true });
    expect(screen.getByText("Aplicar Caso")).toBeInTheDocument();
    expect(screen.getByText("Rechazar Caso")).toBeInTheDocument();
  });

  it("debe deshabilitar el botón de guardar cuando el formulario no está completo", () => {
    renderComponent({
      filterFormCaseApplication: {
        ...mockFormMethods,
        formState: {
          isValid: false,
          isDirty: false,
        },
      },
    });

    const submitButton = screen.getByText("Guardar Caso");
    expect(submitButton).toBeDisabled();
  });

  it("debe deshabilitar los botones cuando está cargando", () => {
    renderComponent({ isLoading: true, isCaseSaved: true });
    const buttons = screen.getAllByTestId("mock-button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("debe mostrar texto de 'Guardando...' en el botón durante la carga", () => {
    renderComponent({ isLoading: true, isCaseSaved: false });
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
  });

  it("debe ejecutar handleRejectCase al hacer click en el botón de rechazar", () => {
    renderComponent({ isCaseSaved: true });
    const buttons = screen.getAllByTestId("mock-button");
    const rejectButton = buttons.find(
      (button) => button.textContent === "Rechazar Caso"
    );

    if (rejectButton) {
      fireEvent.click(rejectButton);
      expect(mockHandleRejectCase).toHaveBeenCalled();
    }
  });
});
