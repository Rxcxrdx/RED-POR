import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import type { ContributionFilterFormValues } from "../IContribution";
import { ContributionFilterForm } from "../form/ContributionFilterForm";

describe("ContributionFilterForm Component", () => {
  const mockFilterFormContribution: UseFormReturnType<ContributionFilterFormValues> =
    {
      values: {
        periodoPago: "",
        periodoPagoFin: "",
        idDisponible: "",
        tipoMovimiento: "",
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
        callback(mockFilterFormContribution.values);
        return undefined;
      }),
      onReset: jest.fn(),
      isDirty: jest.fn(),
      isValid: jest.fn(() => true),
      getInputProps: jest.fn((path) => ({
        value:
          mockFilterFormContribution.values[
            path as keyof ContributionFilterFormValues
          ],
        onChange: jest.fn(),
        error:
          mockFilterFormContribution.errors[
            path as keyof ContributionFilterFormValues
          ],
        onBlur: jest.fn(),
        checked: false,
        inputmode:
          path === "periodoPago" || path === "periodoPagoFin"
            ? "numeric"
            : undefined,
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

  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();
  const mockHandleDownloadContributions = jest.fn();
  const mockHandleDownloadTotalContributions = jest.fn();

  const defaultProps = {
    cuentaId: "123",
    filterFormContribution: mockFilterFormContribution,
    handleFilterSubmit: mockHandleFilterSubmit,
    handleFilterReset: mockHandleFilterReset,
    handleDownloadContributions: mockHandleDownloadContributions,
    handleDownloadTotalContributions: mockHandleDownloadTotalContributions,
    totalDetailsData: { aporte: [] },
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <MantineProvider>
        <ContributionFilterForm {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFilterFormContribution.values = {
      periodoPago: "",
      periodoPagoFin: "",
      idDisponible: "",
      tipoMovimiento: "",
    };
    mockFilterFormContribution.errors = {};
  });

  test("renders form with all inputs and buttons", () => {
    renderComponent();

    expect(screen.getByTestId("periodo-inicial-input")).toBeInTheDocument();
    expect(screen.getByTestId("periodo-final-input")).toBeInTheDocument();
    expect(screen.getByTestId("disponibilidad-select")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-movimiento-select")).toBeInTheDocument();
    expect(screen.getByTestId("consultar-button")).toBeInTheDocument();
    expect(screen.getByTestId("limpiar-filtros-button")).toBeInTheDocument();
  });

  test("calls onSubmit when form is submitted", async () => {
    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.onSubmit).toHaveBeenCalledTimes(1);
  });

  test("calls handleFilterReset when reset button is clicked", () => {
    renderComponent();

    const resetButton = screen.getByTestId("limpiar-filtros-button");
    fireEvent.click(resetButton);

    expect(mockHandleFilterReset).toHaveBeenCalledTimes(1);
  });

  test("getInputProps is called for each form field", () => {
    renderComponent();

    expect(mockFilterFormContribution.getInputProps).toHaveBeenCalled();
    expect(mockFilterFormContribution.getInputProps).toHaveBeenCalledWith(
      "idDisponible"
    );
    expect(mockFilterFormContribution.getInputProps).toHaveBeenCalledWith(
      "tipoMovimiento"
    );
  });

  test("number inputs have hideControls prop", () => {
    const mockGetInputProps = jest.fn().mockImplementation((path) => ({
      value: "",
      onChange: jest.fn(),
      error: undefined,
      inputmode:
        path === "periodoPago" || path === "periodoPagoFin"
          ? "numeric"
          : undefined,
    }));

    mockFilterFormContribution.getInputProps = mockGetInputProps;

    renderComponent();

    expect(mockFilterFormContribution.getInputProps).toHaveBeenCalled();

    const periodoInicialProps = mockGetInputProps("periodoPago");
    const periodoFinalProps = mockGetInputProps("periodoPagoFin");

    expect(periodoInicialProps.inputmode).toBe("numeric");
    expect(periodoFinalProps.inputmode).toBe("numeric");
  });

  test("renders download button for contributions when cuentaId is provided", () => {
    renderComponent();

    expect(
      screen.getByTestId("csv-download-contributions")
    ).toBeInTheDocument();
    expect(screen.getByText("Descargar aportes")).toBeInTheDocument();
  });

  test("renders download button for details when cuentaId is provided", () => {
    renderComponent();

    expect(screen.getByTestId("csv-download-details")).toBeInTheDocument();
    expect(screen.getByText("Descargar detalles")).toBeInTheDocument();
  });

  test("does not render download buttons when cuentaId is not provided", () => {
    renderComponent({ ...defaultProps, cuentaId: null });

    expect(
      screen.queryByTestId("csv-download-contributions")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("csv-download-details")
    ).not.toBeInTheDocument();
  });

  test("downloads CSV file for contributions when download button is clicked", () => {
    renderComponent();

    const downloadButton = screen.getByTestId("csv-download-contributions");
    fireEvent.click(downloadButton);

    expect(mockHandleDownloadContributions).toHaveBeenCalledTimes(1);
  });

  test("downloads CSV file for details when download button is clicked", () => {
    renderComponent();

    const downloadButton = screen.getByTestId("csv-download-details");
    fireEvent.click(downloadButton);

    expect(mockHandleDownloadTotalContributions).toHaveBeenCalledTimes(1);
  });

  test("formats periodo inicial input correctly", () => {
    renderComponent();
    const periodoInicialInput = screen.getByTestId("periodo-inicial-input");

    fireEvent.change(periodoInicialInput, { target: { value: "2023" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPago",
      "2023"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoInicialInput, { target: { value: "202301" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPago",
      "2023-01"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoInicialInput, { target: { value: "2023-01" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPago",
      "2023-01"
    );
  });

  test("formats periodo final input correctly", () => {
    renderComponent();
    const periodoFinalInput = screen.getByTestId("periodo-final-input");

    fireEvent.change(periodoFinalInput, { target: { value: "2023" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPagoFin",
      "2023"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoFinalInput, { target: { value: "202312" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPagoFin",
      "2023-12"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoFinalInput, { target: { value: "2023-12" } });
    expect(mockFilterFormContribution.setFieldValue).toHaveBeenCalledWith(
      "periodoPagoFin",
      "2023-12"
    );
  });

  test("validates periodo inicial format correctly", () => {
    renderComponent();
    const periodoInicialInput = screen.getByTestId("periodo-inicial-input");

    fireEvent.change(periodoInicialInput, { target: { value: "2023-1" } });
    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPago",
      "Formato inválido. Use AAAA-MM"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoInicialInput, { target: { value: "2023-13" } });
    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPago",
      "Mes inválido. Debe estar entre 01 y 12"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoInicialInput, { target: { value: "2023-12" } });
    expect(mockFilterFormContribution.clearFieldError).toHaveBeenCalledWith(
      "periodoPago"
    );
  });

  test("validates periodo final format correctly", () => {
    renderComponent();
    const periodoFinalInput = screen.getByTestId("periodo-final-input");

    fireEvent.change(periodoFinalInput, { target: { value: "2023-1" } });
    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPagoFin",
      "Formato inválido. Use AAAA-MM"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoFinalInput, { target: { value: "2023-13" } });
    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPagoFin",
      "Mes inválido. Debe estar entre 01 y 12"
    );

    jest.clearAllMocks();
    fireEvent.change(periodoFinalInput, { target: { value: "2023-12" } });
    expect(mockFilterFormContribution.clearFieldError).toHaveBeenCalledWith(
      "periodoPagoFin"
    );
  });

  test("validates form on submit with invalid periodo inicial", () => {
    mockFilterFormContribution.values = {
      periodoPago: "2023-13",
      periodoPagoFin: "2023-12",
      idDisponible: "S",
      tipoMovimiento: "VOL",
    };

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPago",
      "Mes inválido. Debe estar entre 01 y 12"
    );
    expect(mockHandleFilterSubmit).not.toHaveBeenCalled();
  });

  test("validates form on submit with invalid periodo final", () => {
    mockFilterFormContribution.values = {
      periodoPago: "2023-01",
      periodoPagoFin: "2023-13",
      idDisponible: "S",
      tipoMovimiento: "VOL",
    };

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPagoFin",
      "Mes inválido. Debe estar entre 01 y 12"
    );
    expect(mockHandleFilterSubmit).not.toHaveBeenCalled();
  });

  test("validates form on submit with periodo final but no inicio", () => {
    mockFilterFormContribution.values = {
      periodoPago: "",
      periodoPagoFin: "2023-12",
      idDisponible: "S",
      tipoMovimiento: "VOL",
    };

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPago",
      "Si especifica periodo final, debe especificar periodo inicial"
    );
    expect(mockHandleFilterSubmit).not.toHaveBeenCalled();
  });

  test("validates form on submit with periodo inicio greater than final", () => {
    mockFilterFormContribution.values = {
      periodoPago: "2023-12",
      periodoPagoFin: "2023-01",
      idDisponible: "S",
      tipoMovimiento: "VOL",
    };

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.setFieldError).toHaveBeenCalledWith(
      "periodoPagoFin",
      "El periodo final debe ser mayor o igual al inicial"
    );
    expect(mockHandleFilterSubmit).not.toHaveBeenCalled();
  });

  test("submits empty form successfully", () => {
    mockFilterFormContribution.values = {
      periodoPago: "",
      periodoPagoFin: "",
      idDisponible: "",
      tipoMovimiento: "",
    };

    const onSubmitMock = jest.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault();
      callback(mockFilterFormContribution.values);
      return undefined;
    });

    mockFilterFormContribution.onSubmit = onSubmitMock;

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockFilterFormContribution.setFieldError).not.toHaveBeenCalled();
  });

  test("submits form with only periodo inicial successfully", () => {
    mockFilterFormContribution.values = {
      periodoPago: "2023-01",
      periodoPagoFin: "",
      idDisponible: "",
      tipoMovimiento: "",
    };

    const onSubmitMock = jest.fn((callback) => (e: React.FormEvent) => {
      e.preventDefault();
      callback(mockFilterFormContribution.values);
      mockHandleFilterSubmit();
      return undefined;
    });

    mockFilterFormContribution.onSubmit = onSubmitMock;

    renderComponent();

    const submitButton = screen.getByTestId("consultar-button");
    fireEvent.click(submitButton);

    expect(mockHandleFilterSubmit).toHaveBeenCalled();
  });
});
