import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountFdogenCard } from "../AccountFdogenCard";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  Enfasis: ({ children, "data-testid": testId }: any) => (
    <span data-testid={testId}>{children}</span>
  ),
  ParagraphNormal: ({ children }: any) => <p>{children}</p>,
}));

describe("AccountFdogenCard", () => {
  const mockAccountData = [
    {
      "Cuenta ID": "123456",
      Estado: "ACTIVO",
      "Tipo Afiliado": "DEPENDIENTE",
      "Tipo Vinculación": "NORMAL",
      "Valor Último Pago": "1.000.000",
      "Fecha Último Pago": "2024-01-15",
      "Periodo Último Pago": "2024-01",
      "NIT Último Pago": "900123456",
      Subestado: "NORMAL",
    },
    {
      "Cuenta ID": "789012",
      Estado: "INACTIVO",
      "Tipo Afiliado": "INDEPENDIENTE",
      "Tipo Vinculación": "ESPECIAL",
      "Valor Último Pago": "500.000",
      "Fecha Último Pago": "2023-12-15",
      "Periodo Último Pago": "2023-12",
      "NIT Último Pago": "900789012",
      Subestado: "SUSPENDIDO",
    },
  ];

  const defaultProps = {
    accountData: mockAccountData,
    onAccountSelect: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<AccountFdogenCard {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente con datos iniciales", () => {
    renderComponent();
    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA ID: 123456"
    );
    expect(defaultProps.onAccountSelect).toHaveBeenCalledWith("123456");
  });

  test("muestra el selector de cuentas con múltiples cuentas", () => {
    renderComponent();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.getElementsByTagName("option")).toHaveLength(
      mockAccountData.length + 1
    );
  });

  test("no muestra el selector con una sola cuenta", () => {
    renderComponent({ accountData: [mockAccountData[0]] });
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  test("actualiza la cuenta seleccionada al cambiar el selector", () => {
    renderComponent();
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "1" } });

    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA ID: 789012"
    );
    expect(defaultProps.onAccountSelect).toHaveBeenCalledWith("789012");
  });

  test("maneja datos de cuenta vacíos", () => {
    renderComponent({ accountData: [] });
    expect(screen.getByText("No hay datos para mostrar.")).toBeInTheDocument();
    expect(defaultProps.onAccountSelect).not.toHaveBeenCalled();
  });

  test("muestra todos los campos de la cuenta seleccionada", () => {
    renderComponent({ accountData: [mockAccountData[0]] });

    Object.entries(mockAccountData[0]).forEach(([key, value]) => {
      expect(screen.getByText(key)).toBeInTheDocument();
      expect(screen.getAllByText(String(value))).toHaveLength(
        screen.queryAllByText(String(value)).length
      );
    });
  });

  test("maneja valores nulos o vacíos", () => {
    const accountDataWithNulls = [
      {
        ...mockAccountData[0],
        "Valor Último Pago": null,
        "NIT Último Pago": "",
      },
    ];

    renderComponent({ accountData: accountDataWithNulls });
    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  test("maneja datos de cuenta inválidos", () => {
    renderComponent({ accountData: null });
    expect(screen.getByText("No hay datos para mostrar.")).toBeInTheDocument();
  });

  test("permite personalizar el título de la cuenta", () => {
    renderComponent({ accountTitle: "CUENTA TEST" });
    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA TEST: 123456"
    );
  });

  test("permite personalizar el campo ID", () => {
    const customData = [
      {
        "Custom ID": "999999",
        Estado: "ACTIVO",
      },
    ];

    renderComponent({
      accountData: customData,
      idField: "Custom ID",
    });

    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA ID: 999999"
    );
  });

  test("actualiza la selección cuando cambian los datos", () => {
    const { rerender } = renderComponent();
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "1" } });
    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA ID: 789012"
    );

    const newMockData = [
      {
        "Cuenta ID": "999999",
        Estado: "ACTIVO",
      },
      ...mockAccountData,
    ];

    rerender(<AccountFdogenCard {...defaultProps} accountData={newMockData} />);

    expect(screen.getByTestId("selected-account-display")).toHaveTextContent(
      "CUENTA ID: 999999"
    );
    expect(defaultProps.onAccountSelect).toHaveBeenLastCalledWith("999999");
  });
});
