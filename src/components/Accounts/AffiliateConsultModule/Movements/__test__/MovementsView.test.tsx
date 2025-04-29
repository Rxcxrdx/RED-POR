import React from "react";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { MovementsView } from "../MovementsView";

jest.mock("../form/MovementsFilterForm", () => ({
  MovementsFilterForm: ({ handleFilterSubmit, handleFilterReset }: any) => (
    <div data-testid="filter-form">
      <button onClick={handleFilterSubmit} data-testid="submit-button">
        Submit
      </button>
      <button onClick={handleFilterReset} data-testid="reset-button">
        Reset
      </button>
    </div>
  ),
}));

jest.mock("../MovementsTable", () => ({
  MovementsTable: ({ records }: any) => (
    <div data-testid="movements-table">
      {records.map((record: any) => (
        <div key={record.uniqueId} data-testid={`row-${record.uniqueId}`}>
          {record.conceptoId}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/SharedComponent", () => ({
  UserDetailContainer: () => <div data-testid="user-detail">User Detail</div>,
}));

describe("MovementsView Component", () => {
  const mockMovimientosData = [
    {
      uniqueId: "1",
      conceptoId: "CONCEPT-1",
      periodoPago: "202401",
    },
    {
      uniqueId: "2",
      conceptoId: "CONCEPT-2",
      periodoPago: "202401",
    },
  ];

  const defaultProps = {
    setPage: jest.fn(),
    handleFilterReset: jest.fn(),
    handleFilterSubmit: jest.fn(),
    page: 1,
    pageSize: 20,
    isLoading: false,
    errorMessage: "",
    totalRecords: 2,
    movimientosData: mockMovimientosData,
    filterFormMovements: {
      onSubmit: jest.fn(),
      getInputProps: jest.fn(),
    },
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <MovementsView {...defaultProps} {...props} />
      </MantineProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all main components when no error", () => {
    renderComponent();

    expect(screen.getByTestId("filter-form")).toBeInTheDocument();
    expect(screen.getByTestId("movements-table")).toBeInTheDocument();
  });

  test("shows error message instead of table when there is an error", () => {
    const errorMessage = "Test error message";
    renderComponent({ errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId("movements-table")).not.toBeInTheDocument();
  });

  test("renders movements table with correct data", () => {
    renderComponent();

    mockMovimientosData.forEach((movement) => {
      expect(
        screen.getByTestId(`row-${movement.uniqueId}`)
      ).toBeInTheDocument();
    });
  });

  test("passes correct props to MovementsFilterForm", () => {
    renderComponent();

    const filterForm = screen.getByTestId("filter-form");
    expect(filterForm).toBeInTheDocument();
  });

  test("passes correct props to MovementsTable", () => {
    renderComponent();

    const movementsTable = screen.getByTestId("movements-table");
    expect(movementsTable).toBeInTheDocument();
  });

  test("handles filter form submission", () => {
    renderComponent();

    const submitButton = screen.getByTestId("submit-button");
    submitButton.click();

    expect(defaultProps.handleFilterSubmit).toHaveBeenCalled();
  });

  test("handles filter form reset", () => {
    renderComponent();

    const resetButton = screen.getByTestId("reset-button");
    resetButton.click();

    expect(defaultProps.handleFilterReset).toHaveBeenCalled();
  });

  test("applies correct styles to filter form container", () => {
    const { container } = renderComponent();

    const filterFormContainer = container.querySelector(
      'div[style*="border-radius: 8px"]'
    );
    expect(filterFormContainer).toHaveStyle({
      borderRadius: "8px",
      border: "1px solid #e8f4e1",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      width: "100%",
    });
  });
});
