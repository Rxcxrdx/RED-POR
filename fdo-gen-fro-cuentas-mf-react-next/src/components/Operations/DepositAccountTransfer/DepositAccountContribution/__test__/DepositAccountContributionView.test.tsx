import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { DepositAccountContributionView } from "../DepositAccountContributionView";
import { UseFormReturn } from "react-hook-form";
import { ContributionFilterFormValues } from "@/components/Accounts/AffiliateConsultModule/Contribution/IContribution";

jest.mock("@/components/SharedComponent", () => ({
  ContributionForm: ({ onSubmit, onReset }: any) => (
    <div data-testid="contribution-form">
      <button onClick={onSubmit} data-testid="submit-button">
        Submit
      </button>
      <button onClick={onReset} data-testid="reset-button">
        Reset
      </button>
    </div>
  ),
  UserDetailContainer: () => <div data-testid="user-detail-container" />,
  BaseContributionTable: ({
    records,
    page,
    setPage,
    handleSelectionChange,
    onItemsPerPageChange,
  }: any) => (
    <div data-testid="contribution-table">
      <span data-testid="records-length">{records.length}</span>
      <span data-testid="current-page">{page}</span>
      <button data-testid="change-page" onClick={() => setPage(page + 1)}>
        Next Page
      </button>
      <button
        data-testid="change-selection"
        onClick={() => handleSelectionChange([{ id: 1 }])}
      >
        Select
      </button>
      <select
        data-testid="items-per-page"
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
      >
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  ),
}));

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }: { errorMessage: string }) => (
    <div data-testid="box-message">{errorMessage}</div>
  ),
}));

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Spinner: ({ $message }: any) => <div data-testid="spinner">{$message}</div>,
}));

const customRender = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("DepositAccountContributionView", () => {
  const mockFormMethods = {
    handleSubmit: jest.fn(),
    reset: jest.fn(),
    control: {},
  } as unknown as UseFormReturn<ContributionFilterFormValues>;

  const defaultProps = {
    page: 1,
    pageSize: 20,
    totalPages: 5,
    totalRecords: 100,
    isLoading: false,
    contributionData: [{ id: 1, name: "Test" }],
    selectedRecord: null,
    filterFormContribution: mockFormMethods,
    handleFilterSubmit: jest.fn(),
    handleFilterReset: jest.fn(),
    handleItemsPerPageChange: jest.fn(),
    setPage: jest.fn(),
    handleSelectionChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería renderizar todos los componentes cuando no hay error", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    expect(screen.getByTestId("user-detail-container")).toBeInTheDocument();
    expect(screen.getByTestId("contribution-form")).toBeInTheDocument();
    expect(screen.getByTestId("contribution-table")).toBeInTheDocument();
  });

  it("debería mostrar el spinner cuando isLoading es true", () => {
    customRender(
      <DepositAccountContributionView {...defaultProps} isLoading={true} />
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("Cargando información...")).toBeInTheDocument();
  });

  it("debería mostrar mensaje de error y ocultar la tabla cuando hay un error", () => {
    customRender(
      <DepositAccountContributionView
        {...defaultProps}
        errorMessage="Error de prueba"
      />
    );

    expect(screen.getByTestId("box-message")).toBeInTheDocument();
    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
    expect(screen.queryByTestId("contribution-table")).not.toBeInTheDocument();
  });

  it("debería manejar cambios en la paginación", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    fireEvent.click(screen.getByTestId("change-page"));
    expect(defaultProps.setPage).toHaveBeenCalledWith(2);
  });

  it("debería manejar cambios en items por página", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    fireEvent.change(screen.getByTestId("items-per-page"), {
      target: { value: "50" },
    });
    expect(defaultProps.handleItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  it("debería manejar la selección de registros", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    fireEvent.click(screen.getByTestId("change-selection"));
    expect(defaultProps.handleSelectionChange).toHaveBeenCalledWith([
      { id: 1 },
    ]);
  });

  it("debería manejar el envío del formulario", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    fireEvent.click(screen.getByTestId("submit-button"));
    expect(defaultProps.handleFilterSubmit).toHaveBeenCalled();
  });

  it("debería manejar el reset del formulario", () => {
    customRender(<DepositAccountContributionView {...defaultProps} />);

    fireEvent.click(screen.getByTestId("reset-button"));
    expect(defaultProps.handleFilterReset).toHaveBeenCalled();
  });

  it("debería mostrar la cantidad correcta de registros", () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    customRender(
      <DepositAccountContributionView
        {...defaultProps}
        contributionData={mockData}
      />
    );

    expect(screen.getByTestId("records-length")).toHaveTextContent("3");
  });

  it("debería manejar el caso de datos vacíos", () => {
    customRender(
      <DepositAccountContributionView {...defaultProps} contributionData={[]} />
    );

    expect(screen.getByTestId("records-length")).toHaveTextContent("0");
  });
});
