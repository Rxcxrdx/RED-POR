import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";

import * as services from "@/services";
import { Toast } from "pendig-fro-transversal-lib-react";

import AssociateValidation from "../AssociateValidation";

const mockValidations = {
  data: {
    listValidacion: [
      { validacionId: "1", nombre: "Validación 1" },
      { validacionId: "2", nombre: "Validación 2" },
      { validacionId: "3", nombre: "Validación 3" },
    ],
  },
};

const mockOperationType = {
  text: "Operación de Prueba",
  value: "123",
};

const mockSuccessResponse = {
  status: {
    statusCode: 200,
    message: "Asociación exitosa",
  },
};

const mockPartialResponse = {
  status: {
    statusCode: 206,
    message: "Asociación parcial",
  },
};

jest.mock("@/services", () => ({
  postSearchValidationsService: jest.fn(),
  postAssociateValidationOperationService: jest.fn(),
}));

jest.mock("pendig-fro-transversal-lib-react", () => {
  const originalModule = jest.requireActual("pendig-fro-transversal-lib-react");

  return {
    ...originalModule,
    Button: ({ children, ...props }) => (
      <button {...props} data-testid="button">
        {children}
      </button>
    ),
    Dropdown: ({
      $title,
      onChange,
      $options,
      placeholder,
      $Value,
      ...props
    }) => (
      <div data-testid="dropdown">
        <label>{$title}</label>
        <select
          onChange={onChange}
          data-testid="dropdown-select"
          value={$Value}
          {...props}
        >
          <option value="">{placeholder}</option>
          {$options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    ),
    Toast: {
      init: jest.fn(),
      showStatusCode: jest.fn(),
    },
  };
});

jest.mock("@/components/common", () => ({
  BoxMessage: ({ errorMessage }) => (
    <div data-testid="box-message">{errorMessage}</div>
  ),
  Loader: ({ isLoading }) =>
    isLoading ? <div data-testid="loader">Loading...</div> : null,
}));

describe("AssociateValidation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Toast.init.mockClear();
    Toast.showStatusCode.mockClear();
  });

  it("should render component with error message when operationType is undefined", () => {
    render(<AssociateValidation operationType={undefined} />);

    expect(screen.getByTestId("box-message")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Debe seleccionar una operación para realizar la asociación"
      )
    ).toBeInTheDocument();
    expect(Toast.init).toHaveBeenCalled();
  });

  it("should render loader while fetching validations", async () => {
    services.postSearchValidationsService.mockResolvedValueOnce(
      new Promise((resolve) => setTimeout(() => resolve(mockValidations), 100))
    );

    render(<AssociateValidation operationType={mockOperationType} />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(services.postSearchValidationsService).toHaveBeenCalledWith({
        validacionId: null,
        page: { page: 0, size: 30 },
      });
    });
  });

  it("should display error message when validation fetch fails", async () => {
    services.postSearchValidationsService.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<AssociateValidation operationType={mockOperationType} />);

    await waitFor(() => {
      expect(
        screen.getByText("Error al consultar validaciones.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("box-message")).toBeInTheDocument();
    });
  });

  it("should display error message when no validations are available", async () => {
    services.postSearchValidationsService.mockResolvedValueOnce({
      data: { listValidacion: [] },
    });

    render(<AssociateValidation operationType={mockOperationType} />);

    await waitFor(() => {
      expect(
        screen.getByText("Sin validaciones para mostrar")
      ).toBeInTheDocument();
      expect(screen.getByTestId("box-message")).toBeInTheDocument();
    });
  });

  it("should load and display validations in dropdown", async () => {
    services.postSearchValidationsService.mockResolvedValueOnce(
      mockValidations
    );

    render(<AssociateValidation operationType={mockOperationType} />);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-select")).toBeInTheDocument();
      expect(services.postSearchValidationsService).toHaveBeenCalled();
    });

    const select = screen.getByTestId("dropdown-select");
    expect(select.options.length).toBe(4); // 3 validations + placeholder
    expect(select.options[1].text).toBe("Validación 1");
    expect(select.options[1].value).toBe("1");
  });

  it("should handle validation selection in the dropdown", async () => {
    services.postSearchValidationsService.mockResolvedValueOnce(
      mockValidations
    );

    render(<AssociateValidation operationType={mockOperationType} />);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-select")).toBeInTheDocument();
    });

    const select = screen.getByTestId("dropdown-select");

    fireEvent.change(select, {
      target: { value: "2", textContent: "Validación 2" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("button")).not.toBeDisabled();
    });
  });

  it("should fetch validations when operationType changes", async () => {
    services.postSearchValidationsService.mockResolvedValueOnce(
      mockValidations
    );

    const { rerender } = render(
      <AssociateValidation operationType={mockOperationType} />
    );

    await waitFor(() => {
      expect(services.postSearchValidationsService).toHaveBeenCalledTimes(1);
    });

    services.postSearchValidationsService.mockClear();
    services.postSearchValidationsService.mockResolvedValueOnce(
      mockValidations
    );

    const newOperationType = { text: "Nueva Operación", value: "456" };
    rerender(<AssociateValidation operationType={newOperationType} />);

    await waitFor(() => {
      expect(services.postSearchValidationsService).toHaveBeenCalledTimes(1);
    });
  });
});
