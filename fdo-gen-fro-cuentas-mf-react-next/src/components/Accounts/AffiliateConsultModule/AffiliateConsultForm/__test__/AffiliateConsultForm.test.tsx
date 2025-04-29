import React from "react";
import { render, act } from "@testing-library/react";
import { AffiliateConsultForm } from "../AffiliateConsultForm";
import { useAffiliateData } from "@/hooks";
import { AffiliateAccountContext } from "@/context";

// Mock hooks
jest.mock("@/hooks", () => ({
  useAffiliateData: jest.fn(),
}));

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(),
    register: jest.fn(),
    formState: { mode: "onChange" },
    getValues: jest.fn(),
    setValue: jest.fn(),
    reset: jest.fn(),
    control: {},
    watch: jest.fn(),
  })),
}));

// Mock the view component
jest.mock("../AffiliateConsultViewForm", () => ({
  AffiliateConsultViewForm: (props: any) => (
    <div data-testid="affiliate-consult-view-form">
      <div data-testid="loading">{props.isLoading.toString()}</div>
      <div data-testid="error">{props.errorMessage}</div>
      <div data-testid="account-data">{JSON.stringify(props.accountData)}</div>
      <div data-testid="pension-accounts">
        {JSON.stringify(props.pensionAccounts)}
      </div>
      <div data-testid="affiliate-data">
        {JSON.stringify(props.affiliateConsultData)}
      </div>
      <div data-testid="modal-open">
        {props.isNameSearchModalOpen.toString()}
      </div>
      <div data-testid="form-data">
        {JSON.stringify(props.filterFormAffiliateConsult)}
      </div>
      <button data-testid="submit-button" onClick={props.handleFilterSubmit}>
        Submit
      </button>
      <button data-testid="reset-button" onClick={props.handleFilterReset}>
        Reset
      </button>
      <button
        data-testid="close-modal-button"
        onClick={props.onCloseNameSearchModal}
      >
        Close Modal
      </button>
      <button
        data-testid="name-search-button"
        onClick={props.getNameSearchData}
      >
        Search by Name
      </button>
    </div>
  ),
}));

describe("AffiliateConsultForm", () => {
  // Mock data for the hook
  const mockHookData = {
    isLoading: false,
    accountData: [],
    errorMessage: "",
    pensionAccounts: [],
    affiliateConsultData: [],
    isNameSearchModalOpen: false,
    getNameSearchData: jest.fn(),
    handleFilterReset: jest.fn(),
    handleFilterSubmit: jest.fn(),
    setSelectedAffiliate: jest.fn(),
    onCloseNameSearchModal: jest.fn(),
  };

  // Mock context
  const mockContext = {
    setCurrentTab: jest.fn(),
    userDetail: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useAffiliateData as jest.Mock).mockReturnValue(mockHookData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <AffiliateAccountContext.Provider value={mockContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );
  };

  test("renders without crashing", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("affiliate-consult-view-form")).toBeInTheDocument();
  });

  test("initializes hook with correct form and context", () => {
    renderComponent();
    const hookCall = (useAffiliateData as jest.Mock).mock.calls[0][0];
    expect(hookCall).toHaveProperty("form");
    expect(hookCall).toHaveProperty("context", mockContext);
  });

  test("passes correct props to AffiliateConsultViewForm", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("loading")).toHaveTextContent("false");
    expect(getByTestId("error")).toHaveTextContent("");
    expect(getByTestId("account-data")).toHaveTextContent("[]");
    expect(getByTestId("pension-accounts")).toHaveTextContent("[]");
    expect(getByTestId("affiliate-data")).toHaveTextContent("[]");
    expect(getByTestId("modal-open")).toHaveTextContent("false");
  });

  test("handles loading state correctly", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("loading")).toHaveTextContent("true");
  });

  test("handles error state correctly", () => {
    const errorMessage = "Test error message";
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("error")).toHaveTextContent(errorMessage);
  });

  test("handles account data correctly", () => {
    const mockAccountData = [{ id: 1, name: "Test Account" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      accountData: mockAccountData,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("account-data")).toHaveTextContent(
      JSON.stringify(mockAccountData)
    );
  });

  test("handles pension accounts correctly", () => {
    const mockPensionAccounts = [{ id: 1, type: "Pension" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      pensionAccounts: mockPensionAccounts,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("pension-accounts")).toHaveTextContent(
      JSON.stringify(mockPensionAccounts)
    );
  });

  test("handles affiliate data correctly", () => {
    const mockAffiliateData = [{ id: 1, name: "John Doe" }];
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      affiliateConsultData: mockAffiliateData,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("affiliate-data")).toHaveTextContent(
      JSON.stringify(mockAffiliateData)
    );
  });

  test("handles modal state correctly", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isNameSearchModalOpen: true,
    });

    const { getByTestId } = renderComponent();
    expect(getByTestId("modal-open")).toHaveTextContent("true");
  });

  test("all form handlers are passed to view component", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("submit-button")).toBeInTheDocument();
    expect(getByTestId("reset-button")).toBeInTheDocument();
    expect(getByTestId("close-modal-button")).toBeInTheDocument();
    expect(getByTestId("name-search-button")).toBeInTheDocument();
  });

  test("useEffect sets current tab after timeout when conditions are met", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: false,
      errorMessage: "",
      isNameSearchModalOpen: false,
    });

    const modifiedContext = {
      ...mockContext,
      userDetail: { id: 1, name: "Test User" },
    };

    render(
      <AffiliateAccountContext.Provider value={modifiedContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100001);
    });

    expect(modifiedContext.setCurrentTab).toHaveBeenCalledWith(
      "affiliateResponse"
    );
  });

  test("useEffect doesn't set current tab when isLoading is true", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: true,
    });

    const modifiedContext = {
      ...mockContext,
      userDetail: { id: 1, name: "Test User" },
    };

    render(
      <AffiliateAccountContext.Provider value={modifiedContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100001);
    });

    expect(modifiedContext.setCurrentTab).not.toHaveBeenCalled();
  });

  test("useEffect doesn't set current tab when userDetail is null", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: false,
    });

    render(
      <AffiliateAccountContext.Provider value={mockContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100001);
    });

    expect(mockContext.setCurrentTab).not.toHaveBeenCalled();
  });

  test("useEffect doesn't set current tab when errorMessage exists", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      errorMessage: "Error message",
    });

    const modifiedContext = {
      ...mockContext,
      userDetail: { id: 1, name: "Test User" },
    };

    render(
      <AffiliateAccountContext.Provider value={modifiedContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100001);
    });

    expect(modifiedContext.setCurrentTab).not.toHaveBeenCalled();
  });

  test("useEffect doesn't set current tab when modal is open", () => {
    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isNameSearchModalOpen: true,
    });

    const modifiedContext = {
      ...mockContext,
      userDetail: { id: 1, name: "Test User" },
    };

    render(
      <AffiliateAccountContext.Provider value={modifiedContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100001);
    });

    expect(modifiedContext.setCurrentTab).not.toHaveBeenCalled();
  });

  test("useEffect cleans up timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

    (useAffiliateData as jest.Mock).mockReturnValue({
      ...mockHookData,
      isLoading: false,
      errorMessage: "",
      isNameSearchModalOpen: false,
    });

    const modifiedContext = {
      ...mockContext,
      userDetail: { id: 1, name: "Test User" },
    };

    const { unmount } = render(
      <AffiliateAccountContext.Provider value={modifiedContext}>
        <AffiliateConsultForm />
      </AffiliateAccountContext.Provider>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
