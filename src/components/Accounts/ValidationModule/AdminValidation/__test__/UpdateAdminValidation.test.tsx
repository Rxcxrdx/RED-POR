import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import UpdateAdminValidation from "../UpdateAdminValidation";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Input: ({ value, onChange, $title }) => (
    <input data-testid={`input-${$title}`} value={value} onChange={onChange} />
  ),
  TextArea: ({ value, onChange, $title }) => (
    <textarea
      data-testid={`textarea-${$title}`}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock("@/components/common", () => ({
  DataBox: ({ label, value }) => (
    <div data-testid={`databox-${label}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
  ConfirmationModal: ({
    children,
    onClose,
    onPrimaryAction,
    onSecondaryAction,
    primaryLabel,
    secondaryLabel,
    $title,
  }) => (
    <div data-testid="confirmation-modal">
      <h2>{$title}</h2>
      {children}
      <button onClick={onPrimaryAction} data-testid="primary-button">
        {primaryLabel}
      </button>
      <button onClick={onSecondaryAction} data-testid="secondary-button">
        {secondaryLabel}
      </button>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
    </div>
  ),
}));

jest.mock("../validation.module.scss", () => ({
  modalValidation: "modalValidation",
  validationInfoContainer: "validationInfoContainer",
}));

const mockValidationInformation = [
  { $header: "Id Validación", $key: "validacionId", $sortable: true },
  { $header: "Validación", $key: "nombre", $sortable: true },
  { $header: "Descripción", $key: "descripcion", $sortable: true },
  { $header: "Usuario", $key: "usuarioCreacion", $sortable: true },
  { $header: "Actualizar", $key: "custom" },
];

const mockModalInformation = {
  validacionId: "1",
  nombre: "Test Validation",
  descripcion: "Test Description",
  usuarioCreacion: "testUser",
};

const mockProps = {
  $isOpen: true,
  validationInformation: mockValidationInformation,
  modalInformation: mockModalInformation,
  onClose: jest.fn(),
  onSecondaryAction: jest.fn(),
};

describe("UpdateAdminValidation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all required props", () => {
    render(<UpdateAdminValidation {...mockProps} />);

    expect(screen.getByText("Edición de validación")).toBeInTheDocument();

    expect(screen.getByTestId("databox-Id Validación")).toBeInTheDocument();
    expect(screen.getByTestId("databox-Validación")).toBeInTheDocument();
    expect(screen.getByTestId("databox-Descripción")).toBeInTheDocument();
    expect(screen.getByTestId("databox-Usuario")).toBeInTheDocument();

    expect(screen.getByTestId("input-Validación")).toBeInTheDocument();
    expect(
      screen.getByTestId("textarea-Descripción de Validación")
    ).toBeInTheDocument();

    expect(screen.getByTestId("primary-button")).toHaveTextContent(
      "Actualizar"
    );
    expect(screen.getByTestId("secondary-button")).toHaveTextContent(
      "Cancelar"
    );
  });

  it("calls onClose and onSecondaryAction when closing modal", () => {
    render(<UpdateAdminValidation {...mockProps} />);

    fireEvent.click(screen.getByTestId("close-button"));

    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onSecondaryAction).toHaveBeenCalled();
  });

  it("updates input values when typing", () => {
    render(<UpdateAdminValidation {...mockProps} />);

    const validationInput = screen.getByTestId("input-Validación");
    const descriptionTextarea = screen.getByTestId(
      "textarea-Descripción de Validación"
    );

    fireEvent.change(validationInput, {
      target: { value: "New Validation Name" },
    });
    fireEvent.change(descriptionTextarea, {
      target: { value: "New Description" },
    });

    expect(validationInput).toHaveValue("New Validation Name");
    expect(descriptionTextarea).toHaveValue("New Description");
  });

  it("resets modal information when closing", () => {
    render(<UpdateAdminValidation {...mockProps} />);

    const validationInput = screen.getByTestId("input-Validación");

    fireEvent.change(validationInput, {
      target: { value: "New Validation Name" },
    });

    fireEvent.click(screen.getByTestId("secondary-button"));

    expect(validationInput).toHaveValue(mockModalInformation.nombre);
  });

  it('filters out "Actualizar" column from validation information', () => {
    render(<UpdateAdminValidation {...mockProps} />);

    // The "Actualizar" header should not be present in DataBox components
    const allHeaders = screen.getAllByTestId(/databox-/);
    const updateHeader = allHeaders.find((header) =>
      header.textContent.includes("Actualizar")
    );

    expect(updateHeader).toBeUndefined();
  });
});
