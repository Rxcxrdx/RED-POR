import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { AffiliateForm } from "../AffiliateForm";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Input: ({
    "data-testid": testId,
    onChange,
    value,
    name,
    type,
    $title,
    disabled,
    placeholder,
    $isError,
    $errorMessage,
  }: any) => (
    <input
      data-testid={testId}
      onChange={onChange}
      value={value || ""}
      name={name}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={$title}
      aria-invalid={$isError}
      aria-errormessage={$errorMessage}
    />
  ),
  Dropdown: ({
    "data-testid": testId,
    onChange,
    $Value,
    $options,
    name,
    disabled,
    $title,
    placeholder,
  }: any) => (
    <select
      data-testid={testId}
      onChange={(e) => onChange(e.target.value)}
      value={$Value || ""}
      name={name}
      disabled={disabled}
      aria-label={$title}
    >
      <option value="">{placeholder}</option>
      {$options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </select>
  ),
  Button: ({ children, onClick, type, "data-testid": testId }: any) => (
    <button
      onClick={onClick}
      type={type}
      data-testid={testId || `button-${type}`}
    >
      {children}
    </button>
  ),
  Icon: ({ $name }: any) => <span data-testid={`icon-${$name}`}>{$name}</span>,
}));

describe("AffiliateConsultForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  const defaultConfig = {
    showAccountNumber: true,
    showIdentification: true,
    showName: true,
  };

  const TestWrapper = ({ config = defaultConfig }) => {
    const methods = useForm({
      defaultValues: {
        numeroCuenta: "",
        tipoIdentificacion: "",
        numeroIdentificacion: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
      },
      mode: "onChange",
    });

    return (
      <AffiliateForm
        form={methods}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        config={config}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el formulario con todos los campos por defecto", () => {
    render(<TestWrapper />);

    expect(screen.getByTestId("base-search-form")).toBeInTheDocument();
    expect(screen.getByText("Consulta de afiliado")).toBeInTheDocument();
    expect(screen.getByTestId("numero-cuenta-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("tipo-identificacion-select")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("numero-identificacion-input")
    ).toBeInTheDocument();
    expect(screen.getByText("Consulta por nombre")).toBeInTheDocument();
  });

  it("permite expandir y contraer la sección de nombre", async () => {
    render(<TestWrapper />);

    const nombreSection = screen.getByText("Consulta por nombre");

    await act(async () => {
      fireEvent.click(nombreSection);
    });

    expect(screen.getByLabelText("Primer apellido*")).toBeInTheDocument();
    expect(screen.getByLabelText("Primer nombre*")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(nombreSection);
    });

    expect(screen.queryByLabelText("Primer apellido*")).not.toBeInTheDocument();
  });

  it("deshabilita campos de identificación cuando se ingresa número de cuenta", async () => {
    render(<TestWrapper />);

    const cuentaInput = screen.getByTestId("numero-cuenta-input");

    await act(async () => {
      fireEvent.change(cuentaInput, { target: { value: "123456" } });
    });

    expect(screen.getByTestId("tipo-identificacion-select")).toBeDisabled();
    expect(screen.getByTestId("numero-identificacion-input")).toBeDisabled();
  });

  it("deshabilita número de cuenta cuando se ingresan datos de identificación", async () => {
    render(<TestWrapper />);

    const tipoIdSelect = screen.getByTestId("tipo-identificacion-select");
    const numIdInput = screen.getByTestId("numero-identificacion-input");

    await act(async () => {
      fireEvent.change(tipoIdSelect, { target: { value: "CC" } });
      fireEvent.change(numIdInput, { target: { value: "123456789" } });
    });

    expect(screen.getByTestId("numero-cuenta-input")).toBeDisabled();
  });

  it("valida campos requeridos en la sección de nombre cuando está expandida", async () => {
    render(<TestWrapper />);

    await act(async () => {
      fireEvent.click(screen.getByText("Consulta por nombre"));
    });

    const form = screen.getByTestId("base-search-form");

    await act(async () => {
      fireEvent.submit(form);
    });

    const primerApellido = screen.getByLabelText("Primer apellido*");
    const primerNombre = screen.getByLabelText("Primer nombre*");

    expect(primerApellido).toBeInTheDocument();
    expect(primerNombre).toBeInTheDocument();
  });

  it("respeta la configuración de campos visibles", () => {
    render(
      <TestWrapper
        config={{
          showAccountNumber: false,
          showIdentification: true,
          showName: false,
        }}
      />
    );

    expect(screen.queryByTestId("numero-cuenta-input")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("tipo-identificacion-select")
    ).toBeInTheDocument();
    expect(screen.queryByText("Consulta por nombre")).not.toBeInTheDocument();
  });

  it("maneja el cambio en campos de nombre", async () => {
    render(<TestWrapper />);

    await act(async () => {
      fireEvent.click(screen.getByText("Consulta por nombre"));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Primer nombre*"), {
        target: { value: "Juan" },
      });
      fireEvent.change(screen.getByLabelText("Primer apellido*"), {
        target: { value: "Pérez" },
      });
    });

    expect(screen.getByTestId("numero-identificacion-input")).toBeDisabled();
    expect(screen.getByTestId("numero-cuenta-input")).toBeDisabled();
  });
});
