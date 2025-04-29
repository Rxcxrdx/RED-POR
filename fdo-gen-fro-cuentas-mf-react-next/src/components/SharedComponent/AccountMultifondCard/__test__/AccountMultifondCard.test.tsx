import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountMultifondCard } from "../AccountMultifondCard";
import dayjs from "dayjs";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Enfasis: ({ children, "data-testid": testId }: any) => (
    <span data-testid={testId}>{children}</span>
  ),
  ParagraphNormal: ({ children, "data-testid": testId }: any) => (
    <p data-testid={testId}>{children}</p>
  ),
}));

const mockPensionAccounts = [
  {
    "Fecha de Creación": "2024-01-01T00:00:00.000+00:00",
    "Número de Cuenta": "100123",
    Estado: "ACTIVO",
    Subestado: "NORMAL",
  },
  {
    "Fecha de Creación": "2023-12-15T00:00:00.000+00:00",
    "Número de Cuenta": "100456",
    Estado: "INACTIVO",
    Subestado: "SUSPENDIDO",
  },
];

describe("AccountMultifondCard", () => {
  const renderComponent = (accounts = mockPensionAccounts) => {
    return render(<AccountMultifondCard pensionAccounts={accounts} />);
  };

  test("muestra la primera cuenta por defecto", () => {
    renderComponent();
    expect(screen.getByTestId("selected-account")).toHaveTextContent(
      "CUENTA 100: 100123"
    );
  });

  test("muestra el selector de cuentas cuando hay más de una cuenta", () => {
    renderComponent();
    const select = screen.getByTestId("account-select");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("100123");
  });

  test("no muestra el selector de cuentas cuando solo hay una cuenta", () => {
    renderComponent([mockPensionAccounts[0]]);
    expect(screen.queryByTestId("account-select")).not.toBeInTheDocument();
  });

  test("permite cambiar entre cuentas", () => {
    renderComponent();
    const select = screen.getByTestId("account-select");

    fireEvent.change(select, { target: { value: "100456" } });

    expect(screen.getByTestId("selected-account")).toHaveTextContent(
      "CUENTA 100: 100456"
    );
  });

  test("muestra mensaje cuando no hay datos", () => {
    renderComponent([]);
    expect(screen.getByTestId("no-data")).toHaveTextContent(
      "No hay datos para mostrar."
    );
  });

  test("formatea fechas correctamente", () => {
    const expectedDate = dayjs("2024-01-01T00:00:00.000+00:00").format("DD/MM/YYYY");
    renderComponent([mockPensionAccounts[0]]);
    const fechaCell = screen.getByTestId("valor-0");
    expect(fechaCell).toHaveTextContent(expectedDate);
  });

  test("maneja fechas inválidas", () => {
    const accountsWithInvalidDate = [
      {
        ...mockPensionAccounts[0],
        "Fecha de Creación": "invalid-date",
      },
    ];

    renderComponent(accountsWithInvalidDate);
    const fechaCell = screen.getByTestId("valor-0");
    expect(fechaCell).toHaveTextContent("invalid-date");
  });

  test("muestra guión para valores nulos o vacíos", () => {
    const accountsWithNullValue = [
      {
        ...mockPensionAccounts[0],
        Estado: null,
      },
    ];

    renderComponent(accountsWithNullValue);
    const estadoCell = screen.getByTestId("valor-2");
    expect(estadoCell).toHaveTextContent("-");
  });

  test("renderiza todas las filas de datos", () => {
    renderComponent([mockPensionAccounts[0]]);
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    expect(screen.getAllByRole("row")).toHaveLength(
      Object.keys(mockPensionAccounts[0]).length
    );
  });

  test("aplica estilos alternados a las filas", () => {
    renderComponent([mockPensionAccounts[0]]);
    const rows = screen.getAllByRole("row");
    
    rows.forEach((row, index) => {
      expect(row).toHaveStyle({
        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
      });
    });
  });

  test("mantiene el estado seleccionado al actualizar props", () => {
    const { rerender } = renderComponent();
    const select = screen.getByTestId("account-select");
    
    fireEvent.change(select, { target: { value: "100456" } });
    
    rerender(<AccountMultifondCard pensionAccounts={mockPensionAccounts} />);
    expect(screen.getByTestId("selected-account")).toHaveTextContent("100456");
  });
});