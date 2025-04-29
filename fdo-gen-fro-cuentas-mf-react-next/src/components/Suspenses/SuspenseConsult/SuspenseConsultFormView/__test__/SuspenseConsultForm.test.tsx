import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { DepositAccountTransferContext, SuspenseConsultContext } from "@/context";
import { SuspenseConsultForm } from "../SuspenseConsultForm";
import { suspensePost } from "@/services/suspenses";
import { SuspenseConsultFormView } from "../SuspenseConsultFormView";

jest.mock("@/services/suspenses", () => ({
  suspensePost: jest.fn(),
}));

jest.mock("@/common/utils", () => ({
  formatPeriodForService: jest.fn(),
  getFileName: jest.fn(),
  saveFile: jest.fn(),
}));

jest.mock("../SuspenseConsultFormView", () => ({
  SuspenseConsultFormView: (props: any) => (
    <div data-testid="mock-view">
      <button
        onClick={props.handleFilterSubmit}
        data-testid="submit-button"
      >
        Consultar
      </button>
      <button
        onClick={props.handleFilterReset}
        data-testid="reset-button"
      >
        Limpiar
      </button>
      <button
        onClick={() => props.handlePageChange(2)}
        data-testid="change-page"
      >
        Cambiar página
      </button>
      <button
        onClick={props.handleDownloadSuspenses}
        data-testid="download-button"
      >
        Descargar
      </button>
      <select
        data-testid="page-size-select"
        onChange={(e) =>
          props.handleItemsPerPageChange(Number(e.target.value))
        }
      >
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
      <div data-testid="error-message">{props.errorMessage}</div>
      <div data-testid="total-records">{props.totalRecords}</div>
      <div data-testid="total-pages">{props.totalPages}</div>
      <div data-testid="current-page">{props.page}</div>
      <div>
        <button
          onClick={() => props.handleSelectionChange([{ id: "1" }])}
          data-testid="select-row"
        >
          Seleccionar fila
        </button>
        <button
          onClick={() => props.handleSelectionChange([])}
          data-testid="deselect-row"
        >
          Deseleccionar fila
        </button>
      </div>
    </div>
  ),
}));

describe("SuspenseConsultForm", () => {

  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockSetPage = jest.fn();
  const mockOnItemsPerPageChange = jest.fn();
  const mockHandleDownloadSuspenses = jest.fn();
  

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const mockContextValue = {
    depositAccountTransferState: {
      account: { id: "12345" },
    },
    setSelectedContributions: jest.fn(),
  };

  const mockSuspenseContextValue = {
    setSuspense: jest.fn(),
  };

  const mockSuspenseData = [
    {
      id: "1",
      description: "Test Data",
    },
  ];

  const mockProps = {
    page: 1,
    pageSize: 20,
    totalRecords: 0,
    totalPages: 0,
    suspenseData: [],
    errorMessage: "",
    handleFilterSubmit: jest.fn(),
    handleFilterReset: jest.fn(),
    handleItemsPerPageChange: jest.fn(),
    handlePageChange: jest.fn(),
    handleSelectionChange: jest.fn(),
    handleDownloadSuspenses: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra un mensaje de error si el servicio falla", async () => {
    (suspensePost as jest.Mock).mockRejectedValueOnce(
      new Error("Error al consultar los rezagos")
    );

    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    const submitButton = screen.getByTestId("submit-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(suspensePost).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Error al consultar los rezagos"
    );
  });

  it("cambia de página correctamente al hacer clic en el botón de cambio de página", async () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultFormView
          {...mockProps}
          page={1}
          totalPages={2}
          suspenseData={mockSuspenseData}
        />
      </DepositAccountTransferContext.Provider>
    );

    const changePageButton = screen.getByTestId("change-page");

    await act(async () => {
      fireEvent.click(changePageButton);
    });

    expect(mockProps.handlePageChange).toHaveBeenCalledWith(2);
  });

  it("cambia el tamaño de página correctamente al seleccionar un nuevo valor", () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultFormView {...mockProps} />
      </DepositAccountTransferContext.Provider>
    );

    const pageSizeSelect = screen.getByTestId("page-size-select");
    fireEvent.change(pageSizeSelect, { target: { value: "50" } });

    expect(mockProps.handleItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  it("muestra un mensaje de error cuando no se seleccionan filtros", async () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "No se han seleccionado filtros para realizar la consulta."
    );
  });

  it("resetea los filtros correctamente al hacer clic en el botón de limpiar", async () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    const resetButton = screen.getByTestId("reset-button");

    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(screen.getByTestId("total-records")).toHaveTextContent("0");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("0");
  });

  it("maneja correctamente la selección de filas", () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultFormView {...mockProps} />
      </DepositAccountTransferContext.Provider>
    );

    const selectRowButton = screen.getByTestId("select-row");

    fireEvent.click(selectRowButton);

    expect(mockProps.handleSelectionChange).toHaveBeenCalledWith([{ id: "1" }]);
  });

  it("maneja correctamente la deselección de filas", () => {
    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultFormView {...mockProps} />
      </DepositAccountTransferContext.Provider>
    );

    const deselectRowButton = screen.getByTestId("deselect-row");

    fireEvent.click(deselectRowButton);

    expect(mockProps.handleSelectionChange).toHaveBeenCalledWith([]);
  });

  it("descarga los datos correctamente cuando el servicio devuelve datos válidos", async () => {
    (suspensePost as jest.Mock).mockResolvedValueOnce({
      data: { rezagos: [{ id: "1", description: "Test Data" }] },
    });

    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    const submitButton = screen.getByTestId("submit-button");
    const downloadButton = screen.getByTestId("download-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(suspensePost).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al consultar los rezagos."
      );
    });
  });

  it("muestra un mensaje de error si no se encuentran datos al descargar", async () => {
    (suspensePost as jest.Mock).mockResolvedValueOnce({
      data: { rezagos: undefined },
    });

    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    const submitButton = screen.getByTestId("submit-button");
    const downloadButton = screen.getByTestId("download-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al consultar los rezagos."
      );
    });
  });

  it("maneja correctamente los errores al consultar los rezagos", async () => {
    (suspensePost as jest.Mock).mockRejectedValueOnce(
      new Error("Error al consultar los rezagos.")
    );

    render(
      <DepositAccountTransferContext.Provider value={mockContextValue}>
        <SuspenseConsultForm />
      </DepositAccountTransferContext.Provider>
    );

    const submitButton = screen.getByTestId("submit-button");
    const downloadButton = screen.getByTestId("download-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await act(async () => {
      fireEvent.click(downloadButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error al consultar los rezagos."
      );
    });
  });

});