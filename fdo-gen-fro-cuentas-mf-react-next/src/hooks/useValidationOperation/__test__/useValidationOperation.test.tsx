import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { useValidationOperation } from "../useValidationOperation";
import { validateOperationPost } from "@/services";

jest.mock("@/services", () => ({
  validateOperationPost: jest.fn(),
}));

const mockValidationResponse = [
  {
    validacionId: 1,
    nombre: "Validación 1",
    resultado: "EXITOSO",
    descripcion: "Validación exitosa",
  },
  {
    validacionId: 2,
    nombre: "Validación 2",
    resultado: "FALLIDO",
    descripcion: "Error en validación",
  },
];

const mockContext = {
  cuentaId: "ABC123",
  affiliateDetail: {
    numeroCuenta: "12345",
    afiliado: {
      primerNombre: "Juan",
      segundoNombre: "Carlos",
      primerApellido: "Pérez",
      segundoApellido: "López",
    },
  },
  selectedContributions: [
    { id: 1, monto: 1000 },
    { id: 2, monto: 2000 },
  ],
  setSelectedContributions: jest.fn(),
  setAffiliateDetail: jest.fn(),
};

const TestContext = React.createContext(null);

const TestComponent = ({ onHookChange }: { onHookChange: Function }) => {
  const hookResult = useValidationOperation(TestContext, "OP001");

  React.useEffect(() => {
    onHookChange(hookResult);
  }, [hookResult, onHookChange]);

  return (
    <div data-testid="test-component">
      {hookResult.errorMessage && (
        <div data-testid="error-message">{hookResult.errorMessage}</div>
      )}
      <div data-testid="validation-count">
        {hookResult.validationData.length}
      </div>
      <div data-testid="loading-state">
        {hookResult.isLoading ? "loading" : "not-loading"}
      </div>
      <button
        data-testid="validate-button"
        onClick={hookResult.handleValidateOperation}
      >
        Validar
      </button>
    </div>
  );
};

describe("useValidationOperation Hook", () => {
  let hookResult: any;
  const getHookResult = (result: any) => {
    hookResult = result;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hookResult = null;
    (validateOperationPost as jest.Mock).mockResolvedValue(
      mockValidationResponse
    );
  });

  const renderTestComponent = () => {
    return render(
      <TestContext.Provider value={mockContext}>
        <TestComponent onHookChange={getHookResult} />
      </TestContext.Provider>
    );
  };

  it("initializes with default values", () => {
    renderTestComponent();

    expect(hookResult.validationData).toHaveLength(0);
    expect(hookResult.page).toBe(1);
    expect(hookResult.pageSize).toBe(20);
    expect(hookResult.isLoading).toBe(false);
    expect(hookResult.errorMessage).toBe("");
  });

  it("validates operation successfully", async () => {
    const { getByTestId } = renderTestComponent();

    await act(async () => {
      getByTestId("validate-button").click();
    });

    await waitFor(() => {
      expect(validateOperationPost).toHaveBeenCalledWith({
        codigoOperacionId: "OP001",
        numeroCuenta: "12345",
        afiliado: mockContext.affiliateDetail.afiliado,
        listaAportes: mockContext.selectedContributions,
      });
      expect(hookResult.validationData).toEqual(mockValidationResponse);
      expect(hookResult.totalRecords).toBe(2);
      expect(hookResult.totalPages).toBe(1);
    });
  });

  it("shows error when no account is selected", async () => {
    const contextWithoutAccount = {
      ...mockContext,
      cuentaId: null,
    };

    const { getByTestId } = render(
      <TestContext.Provider value={contextWithoutAccount}>
        <TestComponent onHookChange={getHookResult} />
      </TestContext.Provider>
    );

    await act(async () => {
      getByTestId("validate-button").click();
    });

    await waitFor(() => {
      expect(getByTestId("error-message")).toHaveTextContent(
        "No se ha seleccionado una cuenta."
      );
    });
  });

  it("shows error when no affiliate detail is available", async () => {
    const contextWithoutAffiliate = {
      ...mockContext,
      affiliateDetail: null,
    };

    const { getByTestId } = render(
      <TestContext.Provider value={contextWithoutAffiliate}>
        <TestComponent onHookChange={getHookResult} />
      </TestContext.Provider>
    );

    await act(async () => {
      getByTestId("validate-button").click();
    });

    await waitFor(() => {
      expect(getByTestId("error-message")).toHaveTextContent(
        "No hay información suficiente para realizar la validacíon"
      );
    });
  });

  it("shows error when no contributions are selected", async () => {
    const contextWithoutContributions = {
      ...mockContext,
      selectedContributions: [],
    };

    const { getByTestId } = render(
      <TestContext.Provider value={contextWithoutContributions}>
        <TestComponent onHookChange={getHookResult} />
      </TestContext.Provider>
    );

    await act(async () => {
      getByTestId("validate-button").click();
    });

    await waitFor(() => {
      expect(getByTestId("error-message")).toHaveTextContent(
        "Debe seleccionar al menos un aporte para realizar la validación."
      );
    });
  });

  it("handles API error gracefully", async () => {
    (validateOperationPost as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const { getByTestId } = renderTestComponent();

    await act(async () => {
      getByTestId("validate-button").click();
    });

    await waitFor(() => {
      expect(getByTestId("error-message")).toHaveTextContent("API Error");
      expect(hookResult.validationData).toHaveLength(0);
    });
  });

  it("handles pagination changes", async () => {
    renderTestComponent();

    await act(async () => {
      hookResult.setPage(2);
      hookResult.setPageSize(10);
    });

    expect(hookResult.page).toBe(2);
    expect(hookResult.pageSize).toBe(10);
  });

  it("handles selected record changes", async () => {
    renderTestComponent();

    const testRecord = mockValidationResponse[0];

    await act(async () => {
      hookResult.setSelectedRecord(testRecord);
    });

    expect(hookResult.selectedRecord).toEqual(testRecord);
  });
});
