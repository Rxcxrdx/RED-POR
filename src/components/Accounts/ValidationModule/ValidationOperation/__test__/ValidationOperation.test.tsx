import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ValidationOperation } from "../ValidationOperation";

jest.mock("@/services", () => ({
  updateValidationStateService: jest.fn(),
}));

jest.mock("pendig-fro-transversal-lib-react", () => {
  const originalModule = jest.requireActual("pendig-fro-transversal-lib-react");

  return {
    ...originalModule,
    DropdownButton: ({ $title, $options, $Value, onChange, ...props }: any) => (
      <div data-testid="dropdown-button">
        <label>{$title}</label>
        <select
          data-testid="dropdown-select"
          value={$Value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        >
          {$options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    ),
    Table: ({
      $columns,
      $data,
      $currentPage,
      $totalPages,
      $itemsPerPage,
      $totalItems,
      $onPageChange,
      $onItemsPerPageChange,
      $itemsPerPageOptions,
      $onSelectionChange,
      $onSort,
      $selectionType,
      $variants,
    }: any) => <></>,
    Toast: {
      showStatusCode: jest.fn(),
      init: jest.fn(),
    },
  };
});

jest.mock("@/components/common", () => ({
  ToggleButton: () => <></>,
  BoxMessage: () => <></>,
  TextWithDivider: () => <></>,
  Loader: ({ isLoading }: any) => <div></div>,
  DataBox: ({ label, value }: any) => (
    <div data-testid={`databox-${label}`}>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  ),
  ConfirmationModal: ({
    $title,
    children,
    primaryLabel,
    secondaryLabel,
    onPrimaryAction,
    onSecondaryAction,
    onClose,
    ...props
  }: any) => (
    <div data-testid="confirmation-modal" {...props}>
      <h2>{$title}</h2>
      <div>{children}</div>
      <button data-testid="primary-button" onClick={onPrimaryAction}>
        {primaryLabel}
      </button>
      <button data-testid="secondary-button" onClick={onSecondaryAction}>
        {secondaryLabel}
      </button>
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

jest.mock("../../validation.common", () => ({
  validationStates: [
    { value: "ACTIVO", text: "Activo" },
    { value: "INACTIVO", text: "Inactivo" },
  ],
  tableValidationColumns: () => [],
}));

jest.mock("@/common/utils", () => ({
  setStateValue: (value: any, setState: any, field: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));
  },
}));

describe("BalanceView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(render(<ValidationOperation />));
  });
});
