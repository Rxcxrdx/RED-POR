import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { ValidationView } from "../ValidationView";

jest.mock("../ValidationOperation/ValidationOperation", () => ({
  ValidationOperation: () => (
    <div data-testid="validation-operation">Validation Operation Content</div>
  ),
}));

jest.mock("../AdminValidation/AdminValidation", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="admin-validation">Admin Validation Content</div>
  ),
}));

describe("ValidationView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render tabs component", () => {
    render(<ValidationView />);
    expect(screen.getByTestId("tabs-container")).toBeInTheDocument();
  });

  it("should render both sections with correct titles", () => {
    render(<ValidationView />);
    expect(screen.getByText("Validaciones por Operación")).toBeInTheDocument();
    expect(
      screen.getByText("Administración Validaciones Operación")
    ).toBeInTheDocument();
  });

  it("should render child components", () => {
    render(<ValidationView />);

    expect(screen.getByTestId("validation-operation")).toBeInTheDocument();
    expect(screen.getByTestId("admin-validation")).toBeInTheDocument();
  });

  it("should preserve tabs order according to tabElements array", () => {
    render(<ValidationView />);
    const tabs = document.getElementsByClassName("tvr-comp-tab-container");
    expect(tabs[0]).toHaveTextContent("Validaciones por Operación");
    expect(tabs[1]).toHaveTextContent("Administración Validaciones Operación");
  });

  it("should show content when click in each tab", () => {
    render(<ValidationView />);

    const operationTab = screen.getByText("Validaciones por Operación");
    fireEvent.click(operationTab);
    expect(screen.getByTestId("validation-operation")).toBeVisible;

    const adminTab = screen.getByText("Administración Validaciones Operación");
    fireEvent.click(adminTab);
    expect(screen.getByTestId("admin-validation")).toBeVisible();
  });
});
