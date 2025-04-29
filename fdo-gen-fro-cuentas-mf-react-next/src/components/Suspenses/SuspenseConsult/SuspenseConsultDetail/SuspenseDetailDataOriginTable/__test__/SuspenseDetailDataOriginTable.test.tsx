import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SuspenseDetailDataOriginTable } from "../SuspenseDetailDataOriginTable";
import { SuspenseConsultContext } from "@/context";

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
              <td>{record.tipoIdDetalle}</td>
              <td>{record.numeroIdDetalle}</td>
              <td>{record.primerApellido}</td>
              <td>{record.segundoApellido}</td>
              <td>{record.primerNombre}</td>
              <td>{record.segundoNombre}</td>
              <td>{record.tipoCotizanteId}</td>
              <td>{record.tipoRecaudo}</td>
              <td>{record.subtipoRecaudo}</td>
              <td>{record.saldoPesos}</td>
              <td>{record.encabezadoPlanillaId}</td>
              <td>{record.secuencia}</td>
              <td>{record.archivoId}</td>
              <td>{record.tipoIdNitPago}</td>
              <td>{record.nitPago}</td>
              <td>{record.razonSocial}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

const mockContextValue = {
  suspense: [
    {
      tipoIdDetalle: "CC",
      numeroIdDetalle: "123456789",
      primerApellido: "Perez",
      segundoApellido: "Gomez",
      primerNombre: "Juan",
      segundoNombre: "Carlos",
      tipoCotizanteId: "01",
      tipoRecaudo: "Normal",
      subtipoRecaudo: "Ordinario",
      saldoPesos: 100000,
      encabezadoPlanillaId: "PL123",
      secuencia: "001",
      archivoId: "ARCH123",
      tipoIdNitPago: "NIT",
      nitPago: "900123456",
      razonSocial: "Empresa S.A.",
    },
  ],
};

describe("SuspenseDetailDataOriginTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería renderizar correctamente el componente", () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataOriginTable />
      </SuspenseConsultContext.Provider>
    );

    expect(screen.getByTestId("mock-base-table")).toBeInTheDocument();
    expect(screen.getByText("Tipo id afiliado")).toBeInTheDocument();
    expect(screen.getByText("Id. afiliado")).toBeInTheDocument();
    expect(screen.getByText("Primer apellido")).toBeInTheDocument();
    expect(screen.getByText("Segundo apellido")).toBeInTheDocument();
    expect(screen.getByText("Primer nombre")).toBeInTheDocument();
    expect(screen.getByText("Segundo nombre")).toBeInTheDocument();
    expect(screen.getByText("Tipo cotizante")).toBeInTheDocument();
    expect(screen.getByText("Tipo recaudo")).toBeInTheDocument();
    expect(screen.getByText("Subtipo recaudo")).toBeInTheDocument();
    expect(screen.getByText("Planilla")).toBeInTheDocument();
    expect(screen.getByText("Secuencia")).toBeInTheDocument();
    expect(screen.getByText("Archivo Id")).toBeInTheDocument();
    expect(screen.getByText("Tipo id empleador")).toBeInTheDocument();
    expect(screen.getByText("Id. empleador")).toBeInTheDocument();
    expect(screen.getByText("Razón social")).toBeInTheDocument();
  });

  it("debería mostrar los datos correctamente", async () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataOriginTable />
      </SuspenseConsultContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("CC")).toBeInTheDocument();
      expect(screen.getByText("123456789")).toBeInTheDocument();
      expect(screen.getByText("Perez")).toBeInTheDocument();
      expect(screen.getByText("Gomez")).toBeInTheDocument();
      expect(screen.getByText("Juan")).toBeInTheDocument();
      expect(screen.getByText("Carlos")).toBeInTheDocument();
      expect(screen.getByText("01")).toBeInTheDocument();
      expect(screen.getByText("Normal")).toBeInTheDocument();
      expect(screen.getByText("Ordinario")).toBeInTheDocument();
      expect(screen.getByText("PL123")).toBeInTheDocument();
      expect(screen.getByText("001")).toBeInTheDocument();
      expect(screen.getByText("ARCH123")).toBeInTheDocument();
      expect(screen.getByText("NIT")).toBeInTheDocument();
      expect(screen.getByText("900123456")).toBeInTheDocument();
      expect(screen.getByText("Empresa S.A.")).toBeInTheDocument();
    });
  });

  it("debería manejar el cambio de página correctamente", async () => {
    render(
      <SuspenseConsultContext.Provider value={mockContextValue}>
        <SuspenseDetailDataOriginTable />
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
        <SuspenseDetailDataOriginTable />
      </SuspenseConsultContext.Provider>
    );

    fireEvent.click(screen.getByTestId("change-page-size-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mock-base-table")).toHaveAttribute("pageSize", "50");
    });
  });

  it("no debería mostrar datos si no hay registros", () => {
    render(
      <SuspenseConsultContext.Provider value={{ suspense: [] }}>
        <SuspenseDetailDataOriginTable />
      </SuspenseConsultContext.Provider>
    );

    expect(screen.queryByText("CC")).not.toBeInTheDocument();
    expect(screen.queryByText("123456789")).not.toBeInTheDocument();
  });
});