import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SuspenseDetailDataAccount } from "../SuspenseDetailDataAccount";
import { SuspenseConsultContext } from "@/context";
import { accountByAccountIdGet } from "@/services";

jest.mock("../../../../../SharedComponent/BaseTable", () => ({
  BaseTable: (props: any) => (
    <div data-testid="mock-base-table" {...props}>
      <button
        onClick={() => props.setPage(2)}
        data-testid="next-page-button"
      >
        Next Page
      </button>
      <button
        onClick={() => props.handleItemsPerPageChange(50)}
        data-testid="change-page-size-button"
      >
        Change Page Size
      </button>
      {props.isLoading && <div data-testid="loading">Loading...</div>}
      {props.errorMessage && (
        <div data-testid="error-message">{props.errorMessage}</div>
      )}
      <table>
        <thead>
          <tr>
            {props.columns.map((column: any) => (
              <th key={column.$key}>{column.$header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.records.map((record: any, index: number) => (
            <tr key={index}>
              <td>{record.cuentaId}</td>
              <td>{record.tipoIdDetalle}</td>
              <td>{record.primerApellido}</td>
              <td>{record.segundoApellido}</td>
              <td>{record.primerNombre}</td>
              <td>{record.segundoNombre}</td>
              <td>{record.Estado}</td>
              <td>{record.Subestado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

jest.mock("@/services", () => ({
  accountByAccountIdGet: jest.fn(),
}));

const mockContextValue = {
  cuentaId: "12345",
  suspense: [
    {
      cuentaId: "12345",
      tipoIdDetalle: "CC",
      numeroIdDetalle: "123456789",
      primerApellido: "Perez",
      segundoApellido: "Gomez",
      primerNombre: "Juan",
      segundoNombre: "Carlos",
    },
  ],
};

describe("SuspenseDetailDataAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería renderizar correctamente el componente", () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    expect(screen.getByText("Cuenta ID")).toBeInTheDocument();
    expect(screen.getByText("Tipo id afiliado")).toBeInTheDocument();
    expect(screen.getByTestId("mock-base-table")).toBeInTheDocument();
  });

  it("debería mostrar los datos correctamente cuando la carga es exitosa", async () => {
    (accountByAccountIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: {
        account: [
          {
            cuentaId: "12345",
            estadoAfiliadoFondoId: "Activo",
            tipoAfiliado: "CC",
            tipoVinculacion: "Individual",
            ultimoIbcPago: 1000000,
            ultimaFechaPago: "2023-01-01",
            ultimoPeriodoPago: "2023-01",
            ultimoNitPago: "900123456",
            subestadoAfiliadoFondoId: "Subactivo",
          },
        ],
      },
    });

    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Subactivo")).toBeInTheDocument();
      expect(screen.getByText("Activo")).toBeInTheDocument();
      expect(screen.getByText("CC")).toBeInTheDocument();
    });
  });

  it("debería mostrar un mensaje de error cuando ocurre un error en la carga", async () => {
    (accountByAccountIdGet as jest.Mock).mockRejectedValue(new Error("Error en la API"));

    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Ocurrió un error al realizar la consulta por cuenta.")).toBeInTheDocument();
    });
  });

  it("debería mostrar un mensaje cuando no se encuentran datos", async () => {
    (accountByAccountIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: { account: [] },
    });

    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("No se encontraron datos para la cuenta ingresada.")).toBeInTheDocument();
    });
  });

  it("debería manejar el cambio de página correctamente", async () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    fireEvent.click(screen.getByTestId("next-page-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mock-base-table")).toHaveAttribute("page", "2");
    });
  });

  it("debería manejar el cambio de tamaño de página correctamente", async () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    fireEvent.click(screen.getByTestId("change-page-size-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mock-base-table")).toHaveAttribute("pageSize", "20");
    });
  });

  it("debería mostrar las columnas y los datos de la tabla correctamente", async () => {
    const mockRecords = [
      {
        cuentaId: "12345",
        tipoIdDetalle: "CC",
        numeroIdDetalle: "123456789",
        primerApellido: "Perez",
        segundoApellido: "Gomez",
        primerNombre: "Juan",
        segundoNombre: "Carlos",
        Estado: "Activo",
        Subestado: "Subactivo",
      },
    ];
  
    (accountByAccountIdGet as jest.Mock).mockResolvedValue({
      status: { statusCode: 200 },
      data: {
        account: [
          {
            cuentaId: "12345",
            estadoAfiliadoFondoId: "Activo",
            tipoAfiliado: "Titular",
            tipoVinculacion: "Individual",
            ultimoIbcPago: 1000000,
            ultimaFechaPago: "2023-01-01",
            ultimoPeriodoPago: "2023-01",
            ultimoNitPago: "900123456",
            subestadoAfiliadoFondoId: "Subactivo",
          },
        ],
      },
    });
  
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );
  
    // Verificar encabezados de columna
    // expect(screen.getByText("Cuenta ID")).toBeInTheDocument();
    expect(screen.getByText("Tipo id afiliado")).toBeInTheDocument();
    // expect(screen.getByText("Identificación afiliado")).toBeInTheDocument();
    expect(screen.getByText("Primer apellido")).toBeInTheDocument();
    expect(screen.getByText("Segundo apellido")).toBeInTheDocument();
    expect(screen.getByText("Primer nombre")).toBeInTheDocument();
    expect(screen.getByText("Segundo nombre")).toBeInTheDocument();
    expect(screen.getByText("Estado cuenta")).toBeInTheDocument();
    expect(screen.getByText("SubEstado cuenta")).toBeInTheDocument();
  
    // Esperar a que los datos se carguen y verificar las filas
    await waitFor(() => {
      mockRecords.forEach((record) => {
        // expect(screen.getByText(record.cuentaId)).toBeInTheDocument();
        expect(screen.getByText(record.tipoIdDetalle)).toBeInTheDocument();
        // expect(screen.getByText(record.numeroIdDetalle)).toBeInTheDocument();
        expect(screen.getByText(record.primerApellido)).toBeInTheDocument();
        expect(screen.getByText(record.segundoApellido)).toBeInTheDocument();
        expect(screen.getByText(record.primerNombre)).toBeInTheDocument();
        expect(screen.getByText(record.segundoNombre)).toBeInTheDocument();
        expect(screen.getByText(record.Estado)).toBeInTheDocument();
        expect(screen.getByText(record.Subestado)).toBeInTheDocument();
      });
    });
  });
  it("no debería mostrar datos si no hay registros en la tabla", () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataAccount />
      </SuspenseConsultContext.Provider>
    );

    expect(screen.queryByText("Cambio")).not.toBeInTheDocument();
    expect(screen.queryByText("2023-01-01")).not.toBeInTheDocument();
    expect(screen.queryByText("2023-01-31")).not.toBeInTheDocument();
  });
});