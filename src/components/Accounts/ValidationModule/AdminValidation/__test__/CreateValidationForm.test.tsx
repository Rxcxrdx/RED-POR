import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CreateValidationForm } from "../CreateValidationForm";
import { createValidationService } from "@/services";
import { mockCreateValidationService } from "@/mocks";

// Mock del servicio
jest.mock("@/services", () => ({
  createValidationService: jest.fn(),
}));

// Mock de los estilos
jest.mock("./adminValidation.module.scss", () => ({
  creationFormContainer: "creationFormContainer",
}));

// Mock de los componentes de la librería
jest.mock("pendig-fro-transversal-lib-react", () => ({
  Input: ({
    "data-testid": testId,
    onChange,
    value,
    $title,
    type,
    required,
    onFocus,
  }) => (
    <input
      data-testid={testId || `input-${$title}`}
      onChange={onChange}
      value={value || ""}
      type={type}
      required={required}
      onFocus={onFocus}
      aria-label={$title}
      placeholder={$title}
    />
  ),
  Button: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="create-button">
      {children}
    </button>
  ),
  Toast: {
    instance: null,
    init: jest.fn(),
    show: jest.fn(),
    showStatusCode: jest.fn(),
  },
}));

describe("CreateValidationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el formulario con todos los campos", () => {
    render(<CreateValidationForm />);

    expect(screen.getByLabelText("Nombre de Validación")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Descripción de Validación")
    ).toBeInTheDocument();
    expect(screen.getByText("Crear")).toBeInTheDocument();
  });

  it("renderiza los campos como requeridos", () => {
    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");

    expect(nombreInput).toHaveAttribute("required");
    expect(descripcionInput).toHaveAttribute("required");
  });

  it("inicializa los campos con valores vacíos", () => {
    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");

    expect(nombreInput).toHaveValue("");
    expect(descripcionInput).toHaveValue("");
  });

  it("maneja el cambio en los campos de entrada", async () => {
    render(<CreateValidationForm />);

    const validationNameInput = screen.getByLabelText("Nombre de Validación");
    const validationDescriptionInput = screen.getByLabelText(
      "Descripción de Validación"
    );

    const testName = "Test Validation";
    const testDescription = "Test Description";

    await act(async () => {
      fireEvent.change(validationNameInput, { target: { value: testName } });
    });

    await act(async () => {
      fireEvent.change(validationDescriptionInput, {
        target: { value: testDescription },
      });
    });

    expect(validationNameInput).toHaveValue(testName);
    expect(validationDescriptionInput).toHaveValue(testDescription);
  });

  it("llama al servicio de creación al hacer clic en el botón Crear", async () => {
    (createValidationService as jest.Mock).mockResolvedValue(
      mockCreateValidationService
    );

    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");
    const createButton = screen.getByTestId("create-button");

    const testName = "Test Validation";
    const testDescription = "Test Description";

    await act(async () => {
      fireEvent.change(nombreInput, { target: { value: testName } });
      fireEvent.change(descripcionInput, {
        target: { value: testDescription },
      });
      fireEvent.click(createButton);
    });

    expect(createValidationService).toHaveBeenCalledWith({
      nombre: testName,
      descripcion: testDescription,
      usuarioCreacion: "test",
    });
  });

  it("maneja errores del servicio de creación", async () => {
    const mockError = new Error("Error creating validation");
    (createValidationService as jest.Mock).mockRejectedValue(mockError);

    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");
    const createButton = screen.getByTestId("create-button");

    const testName = "Test Validation";
    const testDescription = "Test Description";

    await act(async () => {
      fireEvent.change(nombreInput, { target: { value: testName } });
      fireEvent.change(descripcionInput, {
        target: { value: testDescription },
      });
      fireEvent.click(createButton);
    });

    expect(createValidationService).toHaveBeenCalled();
    // Aquí podrías agregar más expectativas cuando se implemente
    // el manejo de errores en el componente
  });

  it("mantiene el estado del formulario después de un error", async () => {
    (createValidationService as jest.Mock).mockRejectedValue(
      new Error("Error creating validation")
    );

    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");
    const createButton = screen.getByTestId("create-button");
    const testName = "Test Validation";
    const testDescription = "Test Description";

    await act(async () => {
      fireEvent.change(nombreInput, { target: { value: testName } });
      fireEvent.change(descripcionInput, {
        target: { value: testDescription },
      });
      fireEvent.click(createButton);
    });

    expect(nombreInput).toHaveValue(testName);
    expect(descripcionInput).toHaveValue(testDescription);
  });

  it("maneja el evento onFocus de los campos", async () => {
    render(<CreateValidationForm />);

    const nombreInput = screen.getByLabelText("Nombre de Validación");
    const descripcionInput = screen.getByLabelText("Descripción de Validación");

    await act(async () => {
      fireEvent.focus(nombreInput);
      fireEvent.focus(descripcionInput);
    });
  });
});
