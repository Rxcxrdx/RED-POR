import React from "react";
import { render } from "@testing-library/react";
import { TransferSuspenseCaseApplication } from "../TransferSuspenseCaseApplication";
import { useCaseApplication, useValidationOperation } from "@/hooks";
import { TransferSuspenseContext } from "@/context";

jest.mock("@/hooks", () => ({
  useCaseApplication: jest.fn(),
  useValidationOperation: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(),
    register: jest.fn(),
    formState: { mode: "onChange" },
    getValues: jest.fn(),
    setValue: jest.fn(),
    reset: jest.fn(),
    defaultValues: {
      numeroCaso: "",
      tipoRequerimiento: "",
      tipoCausal: "",
      relacionadoCon: "",
      documentoSoporte: "",
      observacion: "",
    },
  })),
}));

jest.mock("../TransferSuspenseCaseApplicationView", () => ({
  TransferSuspenseCaseApplicationView: (props: any) => (
    <div data-testid="case-application-view">
      <div data-testid="loading">{props.isLoading.toString()}</div>
      <div data-testid="case-number">{props.caseNumber}</div>
      <div data-testid="error-message">{props.errorMessage}</div>
      <div data-testid="success-message">{props.successMessage}</div>
      <div data-testid="is-case-saved">{props.isCaseSaved.toString()}</div>
      <button data-testid="submit-button" onClick={props.handleSubmitCase}>
        Submit Case
      </button>
      <button data-testid="apply-button" onClick={props.handleApplyCase}>
        Apply Case
      </button>
      <button data-testid="reject-button" onClick={props.handleRejectCase}>
        Reject Case
      </button>
    </div>
  ),
}));

describe("TransferSuspenseCaseApplication", () => {
  const mockHookData = {
    handleSubmitCase: jest.fn(),
    handleApplyCase: jest.fn(),
    handleRejectCase: jest.fn(),
    isLoading: false,
    caseNumber: "",
    errorMessage: "",
    successMessage: "",
    isCaseSaved: false,
  };

  const mockContext = {
    setCaseId: jest.fn(),
    setCaseDetail: jest.fn(),
  };

  const mockValidationContext = {
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
    validationData: [],
    handleValidateOperation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCaseApplication as jest.Mock).mockReturnValue(mockHookData);
    (useValidationOperation as jest.Mock).mockReturnValue(
      mockValidationContext
    );
  });

  const renderComponent = () => {
    return render(
      <TransferSuspenseContext.Provider value={mockContext}>
        <TransferSuspenseCaseApplication />
      </TransferSuspenseContext.Provider>
    );
  };

  test("renders without crashing", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("case-application-view")).toBeInTheDocument();
  });

  test("initializes hook with correct form and context", () => {
    renderComponent();

    const hookCall = (useCaseApplication as jest.Mock).mock.calls[0][0];
    expect(hookCall).toHaveProperty("form");
    expect(hookCall).toHaveProperty("context");
    expect(hookCall.context).toBe(TransferSuspenseContext);
  });

  test("passes correct props to TransferSuspenseCaseApplicationView", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("loading")).toHaveTextContent("false");
    expect(getByTestId("case-number")).toHaveTextContent("");
    expect(getByTestId("error-message")).toHaveTextContent("");
    expect(getByTestId("success-message")).toHaveTextContent("");
    expect(getByTestId("is-case-saved")).toHaveTextContent("false");
  });

  test("handles loading state correctly", () => {
    (useCaseApplication as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("true");
  });

  test("handles case number correctly", () => {
    const testCaseNumber = "CASE-123";
    (useCaseApplication as jest.Mock).mockReturnValue({
      ...mockHookData,
      caseNumber: testCaseNumber,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("case-number")).toHaveTextContent(testCaseNumber);
  });

  test("handles error message correctly", () => {
    const errorMessage = "Test error message";
    (useCaseApplication as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  test("handles success message correctly", () => {
    const successMessage = "Case created successfully";
    (useCaseApplication as jest.Mock).mockReturnValue({
      ...mockHookData,
      successMessage,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("success-message")).toHaveTextContent(successMessage);
  });

  test("handles isCaseSaved state correctly", () => {
    (useCaseApplication as jest.Mock).mockReturnValue({
      ...mockHookData,
      isCaseSaved: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("is-case-saved")).toHaveTextContent("true");
  });

  test("provides correct form instance to hook", () => {
    renderComponent();

    const hookCall = (useCaseApplication as jest.Mock).mock.calls[0][0];
    expect(hookCall.form).toBeDefined();
    expect(hookCall.form).toHaveProperty("handleSubmit");
    expect(hookCall.form).toHaveProperty("register");
    expect(hookCall.form).toHaveProperty("formState");
    expect(hookCall.form).toHaveProperty("getValues");
    expect(hookCall.form).toHaveProperty("setValue");
    expect(hookCall.form).toHaveProperty("reset");
  });

  test("all case handlers are passed to view component", () => {
    const { getByTestId } = renderComponent();

    const submitButton = getByTestId("submit-button");
    const applyButton = getByTestId("apply-button");
    const rejectButton = getByTestId("reject-button");

    submitButton.click();
    applyButton.click();
    rejectButton.click();

    expect(mockHookData.handleSubmitCase).toHaveBeenCalled();
    expect(mockHookData.handleApplyCase).toHaveBeenCalled();
    expect(mockHookData.handleRejectCase).toHaveBeenCalled();
  });
});
