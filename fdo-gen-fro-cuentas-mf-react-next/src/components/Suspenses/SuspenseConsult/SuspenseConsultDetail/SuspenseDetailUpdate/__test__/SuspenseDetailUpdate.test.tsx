import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { SuspenseDetailUpdate } from "../SuspenseDetailUpdate";
import { SuspenseConsultContext } from "@/context";
import { suspenseUpdatePost } from "@/services/suspenses";

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
      {props.isLoading && (
        <div data-testid="loading">Loading...</div>
      )}
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
              <td>{record.tipoNovedadId}</td>
              <td>{record.fechaInicio}</td>
              <td>{record.fechaFin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

jest.mock("@/services/suspenses", () => ({
  suspenseUpdatePost: jest.fn(),
}));

describe("SuspenseDetailUpdate", () => {
  const mockSuspense = [
    {
      rezagoId: "123",
    },
  ];

  const mockUpdate = [
    {
      tipoNovedadId: "Cambio",
      fechaInicio: "2023-01-01",
      fechaFin: "2023-01-31",
    },
  ];

  const renderComponent = (
    suspense: any[] = [],
    update: any[] = [],
    isLoading: boolean = false,
    errorMessage: string = ""
  ) => {
    return render(
      <SuspenseConsultContext.Provider
        value={{
          suspense,
          update,
          setUpdate: jest.fn(),
        }}
      >
        <SuspenseDetailUpdate
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </SuspenseConsultContext.Provider>
    );
  };

  it("renderiza el componente correctamente", () => {
    renderComponent(mockSuspense, mockUpdate);

    expect(screen.getByTestId("mock-base-table")).toBeInTheDocument();
  });

  it("muestra el mensaje de carga mientras se cargan los datos", () => {
    renderComponent(mockSuspense, [], true);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("maneja el cambio de página correctamente", async () => {
    renderComponent(mockSuspense, mockUpdate);

    fireEvent.click(screen.getByTestId("next-page-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mock-base-table")).toHaveAttribute(
        "page",
        "2"
      );
    });
  });

  it("maneja el cambio de tamaño de página correctamente", async () => {
    renderComponent(mockSuspense, mockUpdate);

    fireEvent.click(screen.getByTestId("change-page-size-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mock-base-table")).toHaveAttribute(
        "pageSize",
        "50"
      );
    });
  });

  it("muestra las columnas y los datos de la tabla correctamente", () => {
    renderComponent(mockSuspense, mockUpdate);

    // Verificar encabezados de columna
    expect(screen.getByText("Tipo de novedad")).toBeInTheDocument();
    expect(screen.getByText("Fecha inicio")).toBeInTheDocument();
    expect(screen.getByText("Fecha fin")).toBeInTheDocument();

    // Verificar datos de las filas
    expect(screen.getByText("Cambio")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-01-31")).toBeInTheDocument();
  });

  it("no muestra datos si no hay registros en la tabla", () => {
    renderComponent(mockSuspense, []);

    expect(screen.queryByText("Cambio")).not.toBeInTheDocument();
    expect(screen.queryByText("2023-01-01")).not.toBeInTheDocument();
    expect(screen.queryByText("2023-01-31")).not.toBeInTheDocument();
  });


  it("muestra un mensaje de error si no hay datos en la respuesta", async () => {
    (suspenseUpdatePost as jest.Mock).mockResolvedValueOnce({
      status: { statusCode: 200 },
      data: {
        listaRezagoNovedadResponseDto: [],
      },
    });

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(
        screen.getByText("Los parámetros de consulta no generan información")
      ).toBeInTheDocument();
    });
  });

  it("muestra un mensaje de error si ocurre un error en la consulta", async () => {
    (suspenseUpdatePost as jest.Mock).mockRejectedValueOnce(
      new Error("Error en la consulta")
    );

    renderComponent(mockSuspense);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Ocurrió un error al realizar la consulta de novedades por rezago"
        )
      ).toBeInTheDocument();
    });
  });
});