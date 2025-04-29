import React from "react";
import { render } from "@testing-library/react";
import { DepositAccountValidation } from "../DepositAccountValidation";
import { useValidationOperation } from "@/hooks";
import { DepositAccountTransferContext } from "@/context";
import { DE_CTA_A_REZAGO_CCAI } from "@/common/constants";

jest.mock("@/hooks", () => ({
  useValidationOperation: jest.fn(),
}));

jest.mock("../DepositAccountValidationView", () => ({
  DepositAccountValidationView: (props: any) => (
    <div data-testid="deposit-account-validation-view">
      <div data-testid="loading">{props.isLoading.toString()}</div>
      <div data-testid="error">{props.errorMessage}</div>
      <div data-testid="validation-data">
        {JSON.stringify(props.validationData)}
      </div>
      <div data-testid="selected-record">
        {JSON.stringify(props.selectedRecord)}
      </div>
      <div data-testid="page">{props.page}</div>
      <div data-testid="page-size">{props.pageSize}</div>
      <div data-testid="total-pages">{props.totalPages}</div>
      <div data-testid="total-records">{props.totalRecords}</div>
      <button data-testid="set-page-button" onClick={() => props.setPage(2)}>
        Set Page
      </button>
      <button
        data-testid="set-page-size-button"
        onClick={() => props.setPageSize(10)}
      >
        Set Page Size
      </button>
    </div>
  ),
}));

describe("DepositAccountValidation", () => {
  const mockHookData = {
    page: 1,
    pageSize: 20,
    cuentaId: "ACC123",
    isLoading: false,
    totalPages: 5,
    totalRecords: 100,
    errorMessage: "",
    selectedRecord: null,
    validationData: [],
    setPage: jest.fn(),
    setPageSize: jest.fn(),
    setSelectedRecord: jest.fn(),
    handleValidateOperation: jest.fn(),
  };

  // Mock del contexto
  const mockContext = {
    currentTab: "validation",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useValidationOperation as jest.Mock).mockReturnValue(mockHookData);
  });

  const renderComponent = () => {
    return render(
      <DepositAccountTransferContext.Provider value={mockContext}>
        <DepositAccountValidation />
      </DepositAccountTransferContext.Provider>
    );
  };

  test("renders without crashing", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("deposit-account-validation-view")).toBeInTheDocument();
  });

  test("initializes hook with correct context and operation ID", () => {
    renderComponent();

    const hookCall = (useValidationOperation as jest.Mock).mock.calls[0];
    expect(hookCall[0]).toBe(DepositAccountTransferContext);
    expect(hookCall[1]).toBe(DE_CTA_A_REZAGO_CCAI);
  });

  test("calls handleValidateOperation when currentTab is validation", () => {
    renderComponent();
    expect(mockHookData.handleValidateOperation).toHaveBeenCalled();
  });

  test("does not call handleValidateOperation when currentTab is not validation", () => {
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookData,
      handleValidateOperation: jest.fn(),
    });

    render(
      <DepositAccountTransferContext.Provider value={{ currentTab: "other" }}>
        <DepositAccountValidation />
      </DepositAccountTransferContext.Provider>
    );

    expect(mockHookData.handleValidateOperation).not.toHaveBeenCalled();
  });

  test("passes correct props to DepositAccountValidationView", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("loading")).toHaveTextContent("false");
    expect(getByTestId("error")).toHaveTextContent("");
    expect(getByTestId("validation-data")).toHaveTextContent("[]");
    expect(getByTestId("page")).toHaveTextContent("1");
    expect(getByTestId("page-size")).toHaveTextContent("20");
    expect(getByTestId("total-pages")).toHaveTextContent("5");
    expect(getByTestId("total-records")).toHaveTextContent("100");
  });

  test("handles loading state correctly", () => {
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("true");
  });

  test("handles error state correctly", () => {
    const errorMessage = "Test error message";
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("error")).toHaveTextContent(errorMessage);
  });

  test("handles validation data correctly", () => {
    const mockValidationData = [{ id: 1, name: "Test Validation" }];
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookData,
      validationData: mockValidationData,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("validation-data")).toHaveTextContent(
      JSON.stringify(mockValidationData)
    );
  });

  test("handles selected record correctly", () => {
    const mockSelectedRecord = { id: 1, name: "Selected Record" };
    (useValidationOperation as jest.Mock).mockReturnValue({
      ...mockHookData,
      selectedRecord: mockSelectedRecord,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("selected-record")).toHaveTextContent(
      JSON.stringify(mockSelectedRecord)
    );
  });

  test("handles pagination props correctly", () => {
    const { getByTestId } = renderComponent();

    const newPage = 2;
    const newPageSize = 10;

    getByTestId("set-page-button").click();
    expect(mockHookData.setPage).toHaveBeenCalledWith(newPage);

    getByTestId("set-page-size-button").click();
    expect(mockHookData.setPageSize).toHaveBeenCalledWith(newPageSize);
  });
});
