import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { useCaseApplication } from "../useCaseApplication";
import { createCasePost } from "@/services";

jest.mock("@/services", () => ({
  createCasePost: jest.fn(),
}));

const mockForm = {
  getValues: jest.fn(),
  reset: jest.fn(),
};

const mockContext = React.createContext({ cuentaId: null });
const mockContextValue = { cuentaId: "123456" };

const TestComponent = ({ onHookChange }: { onHookChange: Function }) => {
  const hookResult = useCaseApplication({
    form: mockForm,
    context: mockContext,
    operationId: "TEST_OPERATION",
  });

  React.useEffect(() => {
    onHookChange(hookResult);
  }, [hookResult, onHookChange]);

  return null;
};

describe("useCaseApplication Hook", () => {
  let hookResult: any;
  const getHookResult = (result: any) => {
    hookResult = result;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hookResult = null;

    mockForm.getValues.mockReturnValue({
      tipoRequerimiento: "REQ_TYPE",
      tipoCausal: "CAUSAL_TYPE",
      relacionadoCon: "RELATED_WITH",
      documentoSoporte: "DOC-123",
      observacion: "Test observation",
    });
  });

  const renderTestComponent = () => {
    return render(
      <mockContext.Provider value={mockContextValue}>
        <TestComponent onHookChange={getHookResult} />
      </mockContext.Provider>
    );
  };

  it("initializes with default values", () => {
    renderTestComponent();

    expect(hookResult.isLoading).toBe(false);
    expect(hookResult.errorMessage).toBe("");
    expect(hookResult.successMessage).toBe("");
    expect(hookResult.caseNumber).toBe("");
    expect(hookResult.isCaseSaved).toBe(false);
  });

  it("handles case submission successfully", async () => {
    const mockResponse = {
      status: { statusCode: 200 },
      data: "CASE-123",
    };

    (createCasePost as jest.Mock).mockResolvedValue(mockResponse);

    renderTestComponent();

    await act(async () => {
      await hookResult.handleSubmitCase();
    });

    await waitFor(() => {
      expect(createCasePost).toHaveBeenCalledWith({
        caso: {
          numeroCtaDocumento: "123456",
          codigoOperacionId: "TEST_OPERATION",
          usuarioCreacion: "user-test",
          tipoRequerimientoId: "REQ_TYPE",
          causalCasoId: "CAUSAL_TYPE",
          autotareaTipoRelacion: "RELATED_WITH",
          autotareaValorRelacion: "DOC-123",
          autotareaInformacionRelacion: "Test observation",
        },
      });
      expect(hookResult.successMessage).toBe("Caso creado exitosamente");
      expect(hookResult.caseNumber).toBe("CASE-123");
      expect(hookResult.isCaseSaved).toBe(true);
      expect(hookResult.errorMessage).toBe("");
    });
  });

  it("handles case submission error", async () => {
    const mockError = new Error("Error al crear el caso");
    (createCasePost as jest.Mock).mockRejectedValue(mockError);

    renderTestComponent();

    await act(async () => {
      await hookResult.handleSubmitCase();
    });

    await waitFor(() => {
      expect(hookResult.errorMessage).toBe("Error al crear el caso");
      expect(hookResult.successMessage).toBe("");
      expect(hookResult.caseNumber).toBe("");
      expect(hookResult.isCaseSaved).toBe(false);
    });
  });

  it("handles missing account ID", async () => {
    render(
      <mockContext.Provider value={{ cuentaId: null }}>
        <TestComponent onHookChange={getHookResult} />
      </mockContext.Provider>
    );

    await act(async () => {
      await hookResult.handleSubmitCase();
    });

    expect(hookResult.errorMessage).toBe("No se ha seleccionado una cuenta.");
    expect(createCasePost).not.toHaveBeenCalled();
  });

  it("handles apply case action", () => {
    renderTestComponent();

    act(() => {
      hookResult.handleApplyCase();
    });

    expect(mockForm.reset).toHaveBeenCalled();
    expect(hookResult.isCaseSaved).toBe(false);
    expect(hookResult.errorMessage).toBe("");
    expect(hookResult.successMessage).toBe("");
    expect(hookResult.caseNumber).toBe("");
  });

  it("handles reject case action", () => {
    renderTestComponent();

    act(() => {
      hookResult.handleRejectCase();
    });

    expect(mockForm.reset).toHaveBeenCalled();
    expect(hookResult.isCaseSaved).toBe(false);
    expect(hookResult.errorMessage).toBe("");
    expect(hookResult.successMessage).toBe("");
    expect(hookResult.caseNumber).toBe("");
  });

  it("handles non-200 response status", async () => {
    const mockErrorResponse = {
      status: {
        statusCode: 400,
        statusDescription: "Error de validación",
      },
    };

    (createCasePost as jest.Mock).mockResolvedValue(mockErrorResponse);

    renderTestComponent();

    await act(async () => {
      await hookResult.handleSubmitCase();
    });

    await waitFor(() => {
      expect(hookResult.errorMessage).toBe("Error de validación");
      expect(hookResult.successMessage).toBe("");
      expect(hookResult.isCaseSaved).toBe(false);
    });
  });

  it("uses default operation ID when not provided", () => {
    const TestComponentWithoutOpId = ({
      onHookChange,
    }: {
      onHookChange: Function;
    }) => {
      const hookResult = useCaseApplication({
        form: mockForm,
        context: mockContext,
      });

      React.useEffect(() => {
        onHookChange(hookResult);
      }, [hookResult, onHookChange]);

      return null;
    };

    render(
      <mockContext.Provider value={mockContextValue}>
        <TestComponentWithoutOpId onHookChange={getHookResult} />
      </mockContext.Provider>
    );

    expect(hookResult.cuentaId).toBe("123456");
  });
});
