import React from "react";
import "@testing-library/jest-dom";
import { UseFormReturn } from "react-hook-form";
import { render, screen, fireEvent } from "@testing-library/react";

import { TransferSuspenseLaggingParametersForm } from "../form/TransferSuspenseLaggingParametersForm";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Dropdown: ({
    $title,
    placeholder,
    $options = [],
    onChange,
    $Value,
    $isError,
  }: any) => (
    <div data-testid={`dropdown-${$title}`}>
      <label>{$title}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        value={$Value || ""}
        data-testid={`select-${$title}`}
        data-error={$isError}
      >
        <option value="">{placeholder}</option>
        {$options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
    </div>
  ),
  Button: ({ children, onClick, type, color, $size }: any) => (
    <button
      onClick={onClick}
      type={type}
      data-testid={`button-${children.replace(/\s+/g, "-").toLowerCase()}`}
      data-color={color}
      data-size={$size}
    >
      {children}
    </button>
  ),
  Checkbox: ({ $label, checked, $handleChange, id, $variant }: any) => (
    <div data-testid={`checkbox-${id}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => $handleChange(e.target.checked)}
        id={id}
        data-variant={$variant}
      />
      <label htmlFor={id}>{$label}</label>
    </div>
  ),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
  Controller: ({ name, control, render }: any) => {
    const field = {
      name,
      value: "",
      onChange: jest.fn(),
      ref: jest.fn(),
    };
    const fieldState = { error: null };
    return render({ field, fieldState });
  },
}));

describe("TransferSuspenseLaggingParametersForm", () => {
  const mockHandleFilterReset = jest.fn();
  const mockHandleFilterSubmit = jest.fn();

  const mockFilterForm = {
    control: {
      _removeUnmounted: jest.fn(),
      _fields: {},
      _formValues: {},
      _defaultValues: {},
      _subjects: {
        watch: { next: jest.fn() },
        array: { next: jest.fn() },
        state: { next: jest.fn() },
      },
      _getWatch: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
      getFieldState: jest.fn(),
      _names: {
        mount: new Set(),
        unMount: new Set(),
        array: new Set(),
      },
      _options: {
        shouldUnregister: false,
        defaultValues: {},
      },
    },
    handleSubmit: jest.fn((fn) => (e) => {
      e?.preventDefault();
      return fn();
    }),
    formState: {
      isDirty: false,
      isValid: true,
      errors: {},
    },
  } as unknown as UseFormReturn<any>;

  const defaultProps = {
    handleFilterReset: mockHandleFilterReset,
    filterForm: mockFilterForm,
    handleFilterSubmit: mockHandleFilterSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el formulario correctamente", () => {
    render(<TransferSuspenseLaggingParametersForm {...defaultProps} />);

    expect(
      screen.getByTestId("dropdown-Entidades de giro")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("dropdown-Pago Administradora")
    ).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-Pago Aseguradora")).toBeInTheDocument();
    expect(
      screen.getByTestId("checkbox-tipoRezagoBloqueado")
    ).toBeInTheDocument();
    expect(screen.getByTestId("button-aplicar-filtros")).toBeInTheDocument();
    expect(screen.getByTestId("button-limpiar-filtros")).toBeInTheDocument();
  });

  it("maneja el submit del formulario", () => {
    render(<TransferSuspenseLaggingParametersForm {...defaultProps} />);

    const submitButton = screen.getByTestId("button-aplicar-filtros");
    fireEvent.click(submitButton);

    expect(mockHandleFilterSubmit).toHaveBeenCalled();
  });

  it("maneja el reset del formulario", () => {
    render(<TransferSuspenseLaggingParametersForm {...defaultProps} />);

    const resetButton = screen.getByTestId("button-limpiar-filtros");
    fireEvent.click(resetButton);

    expect(mockHandleFilterReset).toHaveBeenCalled();
  });

  it("renderiza las opciones correctas para los dropdowns", () => {
    render(<TransferSuspenseLaggingParametersForm {...defaultProps} />);

    const pagoAdministradoraSelect = screen.getByTestId(
      "select-Pago Administradora"
    );
    expect(pagoAdministradoraSelect).toBeInTheDocument();

    const pagoAseguradoraSelect = screen.getByTestId("select-Pago Aseguradora");
    expect(pagoAseguradoraSelect).toBeInTheDocument();
  });

  it("maneja los cambios en los campos del formulario", () => {
    render(<TransferSuspenseLaggingParametersForm {...defaultProps} />);

    const pagoAdministradoraSelect = screen.getByTestId(
      "select-Pago Administradora"
    );
    fireEvent.change(pagoAdministradoraSelect, {
      target: { value: "conRendimientos" },
    });

    const checkbox = screen
      .getByTestId("checkbox-tipoRezagoBloqueado")
      .querySelector("input");
    if (checkbox) {
      fireEvent.click(checkbox);
    }
  });
});
