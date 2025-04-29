import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import { ContributionForm } from "../ContributionForm";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Input: ({
    "data-testid": testId,
    onChange,
    value = "",
    name,
    $title,
    placeholder,
    $isError,
    $errorMessage,
    type,
    maxLength,
  }: any) => (
    <div>
      <label htmlFor={testId}>{$title}</label>
      <input
        id={testId}
        data-testid={testId}
        onChange={(e) => {
          const mockEvent = {
            target: {
              value: e.target.value,
              name: name,
            },
          };
          onChange(mockEvent);
        }}
        value={value}
        name={name}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={$title}
      />
      {$isError && <div data-testid={`${testId}-error`}>{$errorMessage}</div>}
    </div>
  ),
  Dropdown: ({
    "data-testid": testId,
    onChange,
    $Value,
    $options,
    $title,
    placeholder,
    $isError,
    $errorMessage,
  }: any) => (
    <div>
      <label htmlFor={testId}>{$title}</label>
      <select
        id={testId}
        data-testid={testId}
        onChange={(e) => onChange(e.target.value)}
        value={$Value || ""}
        aria-label={$title}
      >
        <option value="">{placeholder}</option>
        {$options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
      {$isError && <div data-testid={`${testId}-error`}>{$errorMessage}</div>}
    </div>
  ),
  Button: ({ children, onClick, type, color, $size }: any) => (
    <button
      onClick={onClick}
      type={type}
      data-testid={`button-${type}`}
      data-color={color}
      data-size={$size}
    >
      {children}
    </button>
  ),
}));

const TestComponent = ({ onSubmit = jest.fn(), onReset = jest.fn() }) => {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      periodoPago: "",
      periodoPagoFin: "",
      idDisponible: "",
      tipoMovimiento: "",
    },
  });

  return (
    <ContributionForm form={methods} onSubmit={onSubmit} onReset={onReset} />
  );
};

describe("ContributionForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el formulario con todos los campos correctamente", () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    expect(screen.getByTestId("contribution-filter-form")).toBeInTheDocument();
    expect(screen.getByTestId("periodo-pago-input")).toBeInTheDocument();
    expect(screen.getByTestId("periodo-pago-fin-input")).toBeInTheDocument();
    expect(screen.getByTestId("disponibilidad-select")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-movimiento-select")).toBeInTheDocument();
  });

  it("muestra error cuando el periodo final es menor al inicial", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: {
          value: "202412",
          name: "periodoPago",
        },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-fin-input"), {
        target: {
          value: "202401",
          name: "periodoPagoFin",
        },
      });
    });

    const form = screen.getByTestId("contribution-filter-form");
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(
        screen.getByText("El periodo final debe ser mayor al inicial")
      ).toBeInTheDocument();
    });
  });

  it("permite seleccionar opciones en los dropdowns", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    await act(async () => {
      fireEvent.change(screen.getByTestId("disponibilidad-select"), {
        target: { value: "S" },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-movimiento-select"), {
        target: { value: "VOL" },
      });
    });

    expect(screen.getByTestId("disponibilidad-select")).toHaveValue("S");
    expect(screen.getByTestId("tipo-movimiento-select")).toHaveValue("VOL");
  });

  it("llama a onSubmit con los datos del formulario", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: {
          value: "202401",
          name: "periodoPago",
        },
      });
    });

    const form = screen.getByTestId("contribution-filter-form");
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("llama a onReset al hacer clic en el botón de limpiar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Limpiar Filtros"));
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("valida que se requiera periodo inicial si se proporciona periodo final", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-fin-input"), {
        target: {
          value: "202412",
          name: "periodoPagoFin",
        },
      });
    });

    const form = screen.getByTestId("contribution-filter-form");
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Los parámetros de consulta no generan información")
      ).toBeInTheDocument();
    });
  });

  it("valida el formato correcto del periodo", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const periodoInput = screen.getByTestId("periodo-pago-input");
    await act(async () => {
      fireEvent.change(periodoInput, {
        target: {
          value: "202413",
          name: "periodoPago",
        },
      });

      // Forzar la validación
      fireEvent.blur(periodoInput);
    });

    const form = screen.getByTestId("contribution-filter-form");
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Los parámetros de consulta no generan información")
      ).toBeInTheDocument();
    });
  });

  it("mantiene maxLength en los campos de periodo", () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const periodoInput = screen.getByTestId("periodo-pago-input");
    const periodoFinInput = screen.getByTestId("periodo-pago-fin-input");

    expect(periodoInput).toHaveAttribute("maxLength", "7");
    expect(periodoFinInput).toHaveAttribute("maxLength", "7");
  });

  it("renderiza los botones con los estilos correctos", () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const submitButton = screen.getByText("Consultar");
    const resetButton = screen.getByText("Limpiar Filtros");

    expect(submitButton).toHaveAttribute("data-color", "primary");
    expect(submitButton).toHaveAttribute("data-size", "small");
    expect(resetButton).toHaveAttribute("data-color", "primary");
    expect(resetButton).toHaveAttribute("data-size", "small");
  });
});
