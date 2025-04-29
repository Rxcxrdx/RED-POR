import React from "react";
import { MantineProvider } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { render, screen, fireEvent } from "@testing-library/react";

import type { MovementsFilterFormValues } from "../IMovements";
import { MovementsFilterForm } from "../form/MovementsFilterForm";

window.HTMLElement.prototype.scrollIntoView = function () {};

jest.mock("@/services", () => ({
  movementsPost: jest.fn(),
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const mockMovementsResponse = {
  data: {
    movimiento: [
      { periodoPago: "2023-01", descripcion: "Movimiento 1" },
      { periodoPago: "2023-02", descripcion: "Movimiento 2" },
    ],
    page: {
      totalElement: 2,
      totalPage: 1,
    },
  },
  status: {
    statusCode: 200,
    statusDescription: "OK",
  },
};

const mockEmptyMovementsResponse = {
  data: {
    movimiento: [],
    page: {
      totalElement: 0,
      totalPage: 0,
    },
  },
  status: {
    statusCode: 206,
    statusDescription: "No se encontraron movimientos.",
  },
};

describe("MovementsFilterForm Component", () => {
  const mockFilterFormMovements: UseFormReturnType<MovementsFilterFormValues> =
    {
      values: {
        periodoPago: "",
        periodoPagoFin: "",
        tipoMovimiento: "",
        conceptoId: "",
      },
      initialize: jest.fn(),
      initialized: true,
      errors: {},
      validate: jest.fn(),
      validateField: jest.fn(),
      setValues: jest.fn(),
      setInitialValues: jest.fn(),
      setErrors: jest.fn(),
      setFieldValue: jest.fn(),
      clearErrors: jest.fn(),
      clearFieldError: jest.fn(),
      reset: jest.fn(),
      onSubmit: jest.fn((callback) => (e: React.FormEvent) => {
        e.preventDefault();
        callback(mockFilterFormMovements.values);
      }),
      onReset: jest.fn(),
      isDirty: jest.fn(),
      isValid: jest.fn(() => true),
      getInputProps: jest.fn((path) => ({
        value:
          mockFilterFormMovements.values[
            path as keyof MovementsFilterFormValues
          ],
        onChange: jest.fn(),
        error:
          mockFilterFormMovements.errors[
            path as keyof MovementsFilterFormValues
          ],
        onBlur: jest.fn(),
        checked: false,
      })),
      getTransformedValues: jest.fn(),
      setFieldError: jest.fn(),
      resetDirty: jest.fn(),
      resetTouched: jest.fn(),
      insertListItem: jest.fn(),
      removeListItem: jest.fn(),
      reorderListItem: jest.fn(),
      setTouched: jest.fn(),
      resetValidation: jest.fn(),
    };

  const conceptOptions = [
    { value: "", label: "Todos" },
    { value: "ADM", label: "Administradora" },
    { value: "ALTR", label: "Alto Riesgo" },
  ];

  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();
  const mockHandleDownloadMovements = jest.fn();

  const defaultProps = {
    filterFormMovements: mockFilterFormMovements,
    handleFilterSubmit: mockHandleFilterSubmit,
    handleFilterReset: mockHandleFilterReset,
    handleDownloadMovements: mockHandleDownloadMovements,
    conceptOptions,
    movimientosData: [],
    getFileName: jest.fn(() => "movimientos.csv"),
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <MantineProvider>
        <MovementsFilterForm {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with all inputs and buttons", () => {
    renderComponent();

    expect(screen.getByTestId("periodo-inicial-input")).toBeInTheDocument();
    expect(screen.getByTestId("periodo-final-input")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-movimiento-select")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-concepto-select")).toBeInTheDocument();
    expect(screen.getByTestId("consultar-button")).toBeInTheDocument();
    expect(screen.getByTestId("limpiar-filtros-button")).toBeInTheDocument();
    expect(
      screen.getByTestId("descargar-movimientos-button")
    ).toBeInTheDocument();
  });

  test("calls onSubmit with the right function", () => {
    renderComponent();
    const submitButton = screen.getByTestId("consultar-button");
    submitButton.click();

    expect(mockFilterFormMovements.onSubmit).toHaveBeenCalledTimes(1);
    expect(typeof mockFilterFormMovements.onSubmit.mock.calls[0][0]).toBe(
      "function"
    );
  });

  test("calls handleFilterReset when reset button is clicked", () => {
    renderComponent();
    const resetButton = screen.getByTestId("limpiar-filtros-button");
    resetButton.click();

    expect(mockHandleFilterReset).toHaveBeenCalledTimes(1);
  });

  test("getInputProps is called for select fields", () => {
    renderComponent();

    expect(mockFilterFormMovements.getInputProps).toHaveBeenCalledWith(
      "tipoMovimiento"
    );
    expect(mockFilterFormMovements.getInputProps).toHaveBeenCalledWith(
      "conceptoId"
    );
  });

  test("verifies movement type select works correctly", () => {
    renderComponent();

    const tipoMovimientoSelect = screen.getByTestId("tipo-movimiento-select");
    expect(tipoMovimientoSelect).toBeInTheDocument();
    expect(mockFilterFormMovements.getInputProps).toHaveBeenCalledWith(
      "tipoMovimiento"
    );
  });

  test("verifies concept type select works correctly", () => {
    renderComponent();

    const conceptoSelect = screen.getByTestId("tipo-concepto-select");
    expect(conceptoSelect).toBeInTheDocument();
    expect(mockFilterFormMovements.getInputProps).toHaveBeenCalledWith(
      "conceptoId"
    );
  });

  test("formats period when typing in periodo inicial input", () => {
    renderComponent();

    const periodoInicialInput = screen.getByTestId("periodo-inicial-input");

    fireEvent.change(periodoInicialInput, { target: { value: "202304" } });

    expect(mockFilterFormMovements.setFieldValue).toHaveBeenCalledWith(
      "periodoPago",
      "2023-04"
    );
  });

  test("formats period when typing in periodo final input", () => {
    renderComponent();

    const periodoFinalInput = screen.getByTestId("periodo-final-input");

    fireEvent.change(periodoFinalInput, { target: { value: "202305" } });

    expect(mockFilterFormMovements.setFieldValue).toHaveBeenCalledWith(
      "periodoPagoFin",
      "2023-05"
    );
  });
});
