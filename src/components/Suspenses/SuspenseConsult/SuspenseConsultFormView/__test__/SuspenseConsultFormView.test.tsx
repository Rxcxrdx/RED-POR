import React from "react";
import { useForm } from "react-hook-form";

import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { SuspenseConsultFormView } from "../SuspenseConsultFormView";
import { Spinner } from "pendig-fro-transversal-lib-react";

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }: any) => (
    <div data-testid="box-message">{errorMessage}</div>
  ),
  Loader: (isLoading: boolean) => (
    <Spinner $message="Cargando información..." />
  ),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Spinner: ({ $message }: any) => <div data-testid="spinner">{$message}</div>,
}));

jest.mock("../SuspenseConsultFiltersForm/SuspenseConsultFiltersForm", () => ({
  SuspenseConsultFilterForm: ({
    form,
    onSubmit,
    onReset,
    suspenseData,
    handleDownloadSuspenses,
  }: any) => (
    <div data-testid="suspense-filter-form">
      <select data-testid="tipo-identificacion-select" onChange={form.handleChange} value="CC">
        <option value="CC">Cédula de Ciudadanía</option>
        <option value="TI">Tarjeta de Identidad</option>
      </select>
      <input
        data-testid="numero-identificacion-input"
        onChange={form.handleChange}
        placeholder="Número de Identificación"
      />
      <select data-testid="tipo-empleador-select" onChange={form.handleChange} value="NIT">
        <option value="NIT">NIT</option>
        <option value="CC">Cédula de Ciudadanía</option>
      </select>
      <input
        data-testid="numero-identificacion-empleador-input"
        onChange={form.handleChange}
        placeholder="Número de Identificación del Empleador"
      />
      <input
        data-testid="periodo-pago-input"
        onChange={form.handleChange}
        placeholder="Periodo de Pago"
      />
      <input
        data-testid="date-picker-Fecha de pago inicial"
        type="date"
        onChange={form.handleChange}
      />
      <input
        data-testid="date-picker-Fecha de pago final"
        type="date"
        onChange={form.handleChange}
      />
      <select data-testid="estado-rezago-select" onChange={form.handleChange} value="T">
        <option value="T">Todos</option>
        <option value="S">Levantados</option>
        <option value="N">No levantados</option>
      </select>
      <input
        data-testid="folio-rezago-input"
        onChange={form.handleChange}
        placeholder="Folio del Rezago"
      />
      <input
        data-testid="numero-planilla-input"
        onChange={form.handleChange}
        placeholder="Número de Planilla"
      />
      <input
        data-testid="primer-apellido-input"
        onChange={form.handleChange}
        placeholder="Primer Apellido"
      />
      <input
        data-testid="primer-nombre-input"
        onChange={form.handleChange}
        placeholder="Primer Nombre"
      />
      <button data-testid="button-submit" onClick={onSubmit} disabled={!suspenseData.length}>
        Consultar
      </button>
      <button data-testid="button-reset" onClick={onReset}>
        Limpiar Filtros
      </button>
      <button
        data-testid="button-download"
        onClick={handleDownloadSuspenses}
        disabled={!suspenseData.length}
      >
        Descargar rezagos
      </button>
    </div>
  ),
}));

jest.mock("../SuspenseConsultTable/SuspenseConsultTable", () => ({
  SuspenseTable: ({
    records,
    page,
    pageSize,
    totalRecords,
    setPage,
    onItemsPerPageChange,
  }: any) => (
    <div data-testid="suspense-table">
      <div data-testid="table-records">{records.length}</div>
      <button data-testid="change-page" onClick={() => setPage(page + 1)}>
        Cambiar Página
      </button>
      <button
        data-testid="change-items-per-page"
        onClick={() => onItemsPerPageChange(pageSize + 5)}
      >
        Cambiar Tamaño Página
      </button>
    </div>
  ),
}));

const TestComponent = ({
  isLoading = false,
  errorMessage = "",
  suspenseData = [],
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  onSubmit = jest.fn(),
  onReset = jest.fn(),
  onItemsPerPageChange = jest.fn(),
  setPage = jest.fn(),
  handleDownloadSuspenses = jest.fn(),
}) => {
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
    <MantineProvider>
      {/* Envuelve el componente con MantineProvider */}
      <SuspenseConsultFormView
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        errorMessage={errorMessage}
        totalRecords={totalRecords}
        suspenseData={suspenseData}
        filterFormSuspense={methods}
        setPage={setPage}
        handleFilterReset={onReset}
        handleFilterSubmit={onSubmit}
        handleItemsPerPageChange={onItemsPerPageChange}
        handleDownloadSuspenses={handleDownloadSuspenses}
      />
    </MantineProvider>
  );
};

describe("SuspenseConsultFormView", () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockSetPage = jest.fn();
  const mockOnItemsPerPageChange = jest.fn();
  const mockHandleDownloadSuspenses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el formulario, tabla y spinner", () => {
    render(
      <TestComponent
        isLoading={true}
        suspenseData={[{ id: 1 }, { id: 2 }]}
        totalRecords={2}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    // Verifica que el formulario esté presente
    expect(screen.getByTestId("suspense-filter-form")).toBeInTheDocument();

    // Verifica que el spinner esté presente
    expect(screen.getByTestId("spinner")).toHaveTextContent(
      "Cargando información..."
    );

    // Verifica que la tabla esté presente
    expect(screen.getByTestId("suspense-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-records")).toHaveTextContent("2");
  });

  it("muestra el mensaje de error cuando hay un error", () => {
    render(
      <TestComponent
        errorMessage="Error al cargar los datos"
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    // Verifica que el mensaje de error esté presente
    expect(screen.getByTestId("box-message")).toHaveTextContent(
      "Error al cargar los datos"
    );
  });

  it("llama a onSubmit al hacer clic en el botón de consultar", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} suspenseData={[{ id: 1 }]} />);
  
    const submitButton = screen.getByTestId("button-submit");
  
    // Simular selección de filtros válidos
    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
    });
  
    // Verificar que el botón no esté deshabilitado
    expect(submitButton).not.toBeDisabled();
  
    // Hacer clic en el botón de consultar
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Verificar que la función onSubmit haya sido llamada
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("llama a onReset al hacer clic en el botón de limpiar filtros", async () => {
    render(<TestComponent onSubmit={mockOnSubmit} onReset={mockOnReset} />);

    const resetButton = screen.getByTestId("button-reset");

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("llama a setPage al cambiar de página en la tabla", async () => {
    render(
      <TestComponent
        suspenseData={[{ id: 1 }, { id: 2 }]}
        page={1}
        setPage={mockSetPage}
      />
    );

    const changePageButton = screen.getByTestId("change-page");

    await act(async () => {
      fireEvent.click(changePageButton);
    });

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("llama a onItemsPerPageChange al cambiar el tamaño de página", async () => {
    render(
      <TestComponent
        suspenseData={[{ id: 1 }, { id: 2 }]}
        pageSize={10}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );

    const changeItemsPerPageButton = screen.getByTestId(
      "change-items-per-page"
    );

    await act(async () => {
      fireEvent.click(changeItemsPerPageButton);
    });

    expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(15);
  });

  it("habilita el botón de consulta y muestra datos en la tabla al seleccionar tipo identificación, número de identificación y periodo de pago", async () => {
    render(
      <TestComponent
        suspenseData={[{ id: 1 }]}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-identificacion-select"), {
        target: { value: "CC" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-input"), {
        target: { value: "123456789" },
      });
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
    });

    expect(submitButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(screen.getByTestId("table-records")).toHaveTextContent("1");
  });

  it("habilita el botón de consulta y muestra datos en la tabla al seleccionar tipo empleador, número de identificación de empleador y periodo de pago", async () => {
    render(
      <TestComponent
        suspenseData={[{ id: 1 }]}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByTestId("button-submit");

    await act(async () => {
      fireEvent.change(screen.getByTestId("tipo-empleador-select"), {
        target: { value: "NIT" },
      });
      fireEvent.change(screen.getByTestId("numero-identificacion-empleador-input"), {
        target: { value: "123456789" },
      });
      fireEvent.change(screen.getByTestId("periodo-pago-input"), {
        target: { value: "2023-01" },
      });
    });

    expect(submitButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(screen.getByTestId("table-records")).toHaveTextContent("1");
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

  it("limpia los filtros correctamente al hacer clic en el botón limpiar filtros", async () => {
    render(
      <TestComponent
        suspenseData={[{ id: 1 }]}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByTestId("button-reset");

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
    expect(screen.getByTestId("tipo-identificacion-select")).toHaveValue("CC");
    expect(screen.getByTestId("tipo-empleador-select")).toHaveValue("NIT");
    expect(screen.getByTestId("estado-rezago-select")).toHaveValue("T");
    expect(screen.getByTestId("numero-identificacion-input")).toHaveValue("");
    expect(screen.getByTestId("numero-identificacion-empleador-input")).toHaveValue("");
    expect(screen.getByTestId("periodo-pago-input")).toHaveValue("");
    expect(screen.getByTestId("date-picker-Fecha de pago inicial")).toHaveValue("");
    expect(screen.getByTestId("date-picker-Fecha de pago final")).toHaveValue("");
    expect(screen.getByTestId("folio-rezago-input")).toHaveValue("");
    expect(screen.getByTestId("numero-planilla-input")).toHaveValue("");
    expect(screen.getByTestId("primer-apellido-input")).toHaveValue("");
    expect(screen.getByTestId("primer-nombre-input")).toHaveValue("");
  });
});
