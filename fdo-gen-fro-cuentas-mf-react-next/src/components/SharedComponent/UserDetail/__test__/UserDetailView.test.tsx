import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserDetailView } from "../UserDetailView";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="ver-mas-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/common", () => ({
  DataBox: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="data-box">
      <span data-testid="data-box-label">{label}</span>
      <span data-testid="data-box-value">{value || "-"}</span>
    </div>
  ),
}));

describe("UserDetailView Component", () => {
  const mockUserDetail = {
    numeroIdentificacion: "123456789",
    tipoIdentificacion: "CC",
    nombreCompleto: "John Doe",
    numeroCuenta: "987654321",
    estadoAfiliado: "Activo",
    subestadoAfiliado: "Normal",
    infoTabla: {
      Sarlaft: "OK",
      "Fecha de Nacimiento": "1990-01-01",
      "Género": "Masculino",
      Registraduría: "Verificado",
      Transición: "No",
      Ciudad: "Bogotá",
      Dirección: "Calle 123",
      Email: "john@example.com",
      Ocupación: "Desarrollador",
      Teléfono: "1234567",
      Celular: "3001234567",
    },
  };

  const defaultProps = {
    userDetail: mockUserDetail,
    opened: false,
    onToggle: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<UserDetailView {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza información básica del usuario", () => {
    renderComponent();

    expect(screen.getByText("CC - 123456789")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("987654321")).toBeInTheDocument();
  });

  test("renderiza los componentes DataBox principales", () => {
    renderComponent();

    const labels = [
      "CUENTA No.",
      "ESTADO AFILIADO",
      "SUBESTADO",
      "SARLAFT",
      "FECHA DE NACIMIENTO"
    ];

    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('renderiza el botón "Ver más" y maneja el click', () => {
    renderComponent();

    const button = screen.getByText("Ver más");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  test("muestra información adicional cuando opened es true", () => {
    renderComponent({ opened: true });

    const additionalLabels = [
      "GÉNERO",
      "REGISTRADURÍA",
      "TRANSICIÓN",
      "CIUDAD",
      "DIRECCIÓN",
      "EMAIL",
      "OCUPACIÓN",
      "TELÉFONO",
      "CELULAR"
    ];

    additionalLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("maneja valores faltantes en infoTabla", () => {
    const userDetailWithoutInfo = {
      ...mockUserDetail,
      infoTabla: {},
    };

    renderComponent({ userDetail: userDetailWithoutInfo, opened: true });
    
    const dataBoxValues = screen.getAllByTestId("data-box-value");
    const dashesCount = dataBoxValues.filter(el => el.textContent === "-").length;
    expect(dashesCount).toBeGreaterThan(0);
  });

  test("renderiza valores correctos en los DataBox", () => {
    renderComponent();

    const pairs = [
      ["CUENTA No.", "987654321"],
      ["ESTADO AFILIADO", "Activo"],
      ["SUBESTADO", "Normal"],
      ["SARLAFT", "OK"],
      ["FECHA DE NACIMIENTO", "1990-01-01"],
    ];

    pairs.forEach(([label, value]) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  test("maneja valores null en infoTabla", () => {
    const userDetailWithNulls = {
      ...mockUserDetail,
      infoTabla: {
        ...mockUserDetail.infoTabla,
        Email: null,
        Teléfono: null,
      },
    };

    renderComponent({ userDetail: userDetailWithNulls, opened: true });
    
    const emailBox = screen.getByText("EMAIL").closest('[data-testid="data-box"]');
    const phoneBox = screen.getByText("TELÉFONO").closest('[data-testid="data-box"]');
    
    expect(emailBox?.querySelector('[data-testid="data-box-value"]')).toHaveTextContent("-");
    expect(phoneBox?.querySelector('[data-testid="data-box-value"]')).toHaveTextContent("-");
  });

  test("oculta información adicional cuando opened es false", () => {
    renderComponent({ opened: false });

    const additionalLabels = ["GÉNERO", "EMAIL"];
    additionalLabels.forEach(label => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
  });

  test("retorna null cuando userDetail es null", () => {
    const { container } = renderComponent({ userDetail: null });
    expect(container.firstChild).toBeNull();
  });

  test("aplica estilos correctos al contenedor principal", () => {
    const { container } = renderComponent();
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveStyle({
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e8f4e1",
      width: "100%"
    });
  });
});