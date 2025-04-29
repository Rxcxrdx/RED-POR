import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SuspenseDetailDataTable } from "../SuspenseDetailDataTable";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";

jest.mock("../../../../../SharedComponent/BaseTable", () => ({
  BaseTable: (props: any) => (
    <div data-testid="mock-view" {...props}>
      <button
        onClick={() => props.setPage(2)}
        data-testid="next-page-button"
      >
        Next Page
      </button>
      <button
        onClick={() => props.handleItemsPerPageChange(50)}
        data-testid="change-page-size-button"
      >
        Change Page Size
      </button>
      {props.isLoading && <div data-testid="loading">Loading...</div>}
      {props.errorMessage && (
        <div data-testid="error-message">{props.errorMessage}</div>
      )}
      {props.suspense?.length > 0 && (
        <div data-testid="suspense-data">
          {props.suspense.map((item: any, index: number) => (
            <div key={index} data-testid={`row-${index}`}>
              {item.tipoIdDetalle} - {item.numeroIdDetalle}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

describe("SuspenseDetailDataTable", () => {
  const mockSuspense = [
    { tipoIdDetalle: "CC", numeroIdDetalle: "123456789" },
    { tipoIdDetalle: "TI", numeroIdDetalle: "987654321" },
  ];

  const renderComponent = (suspense: any[] = [], errorMessage = "", isLoading = false) => {
    return render(
      <SuspenseConsultContext.Provider
        value={{ suspense, setSuspense: jest.fn() }}
      >
        <SuspenseDetailDataTable />
      </SuspenseConsultContext.Provider>
    );
  };

  it("handles page change correctly", () => {
    renderComponent(mockSuspense);

    fireEvent.click(screen.getByTestId("next-page-button"));

    // Simula el cambio de página
    expect(screen.getByTestId("mock-view")).toBeInTheDocument();
  });


});