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
import { SuspenseConsultFilterForm } from "../SuspenseConsultFiltersForm";


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
  Button: ({ children, onClick, type, color, $size, disabled }: any) => (
    <button
      onClick={onClick}
      type={type}
      data-testid={`button-${type}`}
      data-color={color}
      data-size={$size}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  SingleDatePicker: ({
    $title,
    value,
    onChange,
    $isError,
    $errorMessage,
  }: any) => (
    <div>
      <label>{$title}</label>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`date-picker-${$title}`}
      />
      {$isError && <div data-testid={`error-${$title}`}>{$errorMessage}</div>}
    </div>
  ),
}));

const TestComponent = ({
  onSubmit = jest.fn(),
  onReset = jest.fn(),
  suspenseData = [],
  handleDownloadSuspenses = jest.fn(),
}: any) => {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      tipoIdentificacion: "CC",
      tipoIdEmpleador: "NIT",
      numeroIdentificacion: null,
      numeroIdEmpleador: null,
      periodoPago: null,
      primerNombre: null,
      primerApellido: null,
      numeroPlanilla: null,
      estadoRezago: null,
      folioRezago: null,
    },
  });

  return (
    <SuspenseConsultFilterForm
      form={methods}
      onSubmit={onSubmit}
      onReset={onReset}
      suspenseData={suspenseData}
      handleDownloadSuspenses={handleDownloadSuspenses}
      setErrorMessage={jest.fn()}
      setsuspenseData={jest.fn()}
    />
  );
};

describe("SuspenseConsultFilterForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockHandleDownloadSuspenses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("establece valores predeterminados correctamente", () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    expect(screen.getByTestId("tipo-identificacion-select")).toHaveValue("CC");
    expect(screen.getByTestId("tipo-empleador-select")).toHaveValue("NIT");
  });

  it("habilita el botón de consulta cuando se ingresan valores válidos en los campos requeridos", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("muestra un mensaje de error cuando el primer apellido tiene un valor pero el primer nombre está vacío", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa primer apellido"), {
        target: { value: "Doe" },
      });
    });

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText("El primer nombre es requerido")).toBeInTheDocument();
    });
  });

  it("habilita el botón de consulta cuando se ingresa un número de planilla", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa el número de la planilla"), {
        target: { value: "12345" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("muestra un mensaje de error cuando el formato del periodo de pago es inválido", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const periodoPagoInput = screen.getByTestId("periodo-pago-input");

    await act(async () => {
      fireEvent.change(periodoPagoInput, { target: { value: "202313" } });
    });

    await waitFor(() => {
      expect(screen.getByText("El formato debe ser AAAA-MM")).toBeInTheDocument();
    });
  });

  it("llama a la función onSubmit cuando se hace clic en el botón de consulta con valores válidos", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    const submitButton = screen.getByText("Consultar");

    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("llama a la función onReset cuando se hace clic en el botón de limpiar filtros", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    const resetButton = screen.getByTestId("button-button");

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("habilita el botón de descarga y llama a handleDownloadSuspenses cuando hay datos de rezagos disponibles", async () => {
    render(
      <TestComponent
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        suspenseData={[{ id: 1 }]}
        handleDownloadSuspenses={mockHandleDownloadSuspenses}
      />
    );

    const submitButton = screen.getByTestId("button-submit");

        // Simular selección de filtros válidos
        await act(async () => {
          fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
            target: { value: "CC" },
          });
          fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
            target: { value: "123456789" },
          });
        });
    
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled();
        });

    const downloadButton = screen.getByText("Descargar rezagos");

    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(mockHandleDownloadSuspenses).toHaveBeenCalled();
  });

  it("deshabilita el botón de consulta cuando no se ingresan valores válidos", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    const submitButton = screen.getByTestId("button-submit");

    expect(submitButton).toBeDisabled();
  });

  it("llama a la función onReset y restablece los valores del formulario cuando se hace clic en el botón de limpiar filtros", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[]} />);

    const resetButton = screen.getByTestId("button-button");

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
    expect(screen.getByTestId("tipo-identificacion-select")).toHaveValue("CC");
    expect(screen.getByTestId("tipo-empleador-select")).toHaveValue("NIT");
  });

  it("habilita el botón de descarga y llama a handleDownloadSuspenses cuando hay datos de rezagos disponibles", async () => {
    render(
      <TestComponent
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        suspenseData={[{ id: 1 }]}
        handleDownloadSuspenses={mockHandleDownloadSuspenses}
      />
    );

    const submitButton = screen.getByTestId("button-submit");

    // Simular selección de filtros válidos
    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    const downloadButton = screen.getByText("Descargar rezagos");

    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    expect(mockHandleDownloadSuspenses).toHaveBeenCalled();
  });

  it("no muestra el botón de descarga cuando no hay datos de rezagos disponibles", async () => {
    render(
      <TestComponent
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        suspenseData={[]}
        handleDownloadSuspenses={mockHandleDownloadSuspenses}
      />
    );

    expect(screen.queryByTestId("csv-download-contributions")).not.toBeInTheDocument();
  });

  
  it("al seleccionar solamente fecha de pago inicial y fecha de pago final, no se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("date-picker-Fecha de pago inicial"), {
        target: { value: "2023-01-01" },
      });
      fireEvent.change(screen.getByTestId("date-picker-Fecha de pago final"), {
        target: { value: "2023-12-31" },
      });
    });

    expect(submitButton).toBeDisabled();
  });

  it("al seleccionar fecha de pago inicial, fecha de pago final y tipo de identificación, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("date-picker-Fecha de pago inicial"), {
        target: { value: "2023-01-01" },
      });
      fireEvent.change(screen.getByTestId("date-picker-Fecha de pago final"), {
        target: { value: "2023-12-31" },
      });
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-empleador-input"), {
        target: { value: "123456789" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar periodo de pago, tipo de identificación y número de identificación de empleador, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-empleador-input"), {
        target: { value: "123456789" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar periodo de pago, tipo de empleador y número de identificación de empleador, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
      fireEvent.change(screen.getByTestId("tipo-empleador-select"), {
        target: { value: "NIT" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-empleador-input"), {
        target: { value: "123456789" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar estado de rezago, tipo de empleador y número de identificación de empleador, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("estado-rezago-select"), {
        target: { value: "S" },
      });
      fireEvent.change(screen.getByTestId("tipo-empleador-select"), {
        target: { value: "NIT" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-empleador-input"), {
        target: { value: "123456789" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar estado de rezago, tipo de identificación y número de identificación, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("estado-rezago-select"), {
        target: { value: "S" },
      });
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar folio, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa el folio del rezago"), {
        target: { value: "12345" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar el número de planilla, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa el número de la planilla"), {
        target: { value: "12345" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar solamente primer apellido y primer nombre, se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa primer apellido"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Ingresa primer nombre"), {
        target: { value: "John" },
      });
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("al seleccionar solamente segundo apellido y primer nombre, no se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Ingresa segundo apellido"), {
        target: { value: "Smith" },
      });
      fireEvent.change(screen.getByPlaceholderText("Ingresa primer nombre"), {
        target: { value: "John" },
      });
    });

    expect(submitButton).toBeDisabled();
  });

  it("al seleccionar solamente periodo de pago, no se debe habilitar el botón Consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);
    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
    });

    expect(submitButton).toBeDisabled();
  });
});