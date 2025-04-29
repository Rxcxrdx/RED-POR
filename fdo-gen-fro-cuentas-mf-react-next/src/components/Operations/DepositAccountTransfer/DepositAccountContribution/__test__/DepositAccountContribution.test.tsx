import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DepositAccountTransferContext } from '@/context';
import { DepositAccountContribution } from '../DepositAccountContribution';
import { contributionPost } from '@/services';
import { IAporte, IContributionResponse } from '@/components/Accounts/AffiliateConsultModule/Contribution/IContribution';

jest.mock('@/services', () => ({
  contributionPost: jest.fn(),
}));

let mockHandleSelectionChange: (rows: any[]) => void;

jest.mock('../DepositAccountContributionView', () => ({
  DepositAccountContributionView: (props: any) => {
    mockHandleSelectionChange = props.handleSelectionChange;
    return (
      <div data-testid="mock-contribution-view">
        <button onClick={props.handleFilterSubmit} data-testid="submit-button">
          Consultar
        </button>
        <button onClick={props.handleFilterReset} data-testid="reset-button">
          Limpiar
        </button>
        <select
          data-testid="page-size-select"
          onChange={(e) => props.handleItemsPerPageChange(Number(e.target.value))}
        >
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        {props.errorMessage && (
          <div data-testid="error-message">{props.errorMessage}</div>
        )}
        {props.isLoading && <div data-testid="loading">Cargando...</div>}
        <div data-testid="total-records">Total: {props.totalRecords}</div>
        <div data-testid="current-page">Página: {props.page}</div>
      </div>
    );
  },
}));

describe('DepositAccountContribution', () => {
  const mockCuentaId = '123456';
  type ContextType = {
    cuentaId: string | null;
    setSelectedContributions: (contributions: any[] | null) => void;
  };

  const mockAporte: IAporte = {
    cuentaId: mockCuentaId,
    periodoPago: '2024-01',
    uniqueId: '123-0',
    idDisponible: '1',
    valorAporte: 1000000,
  };

  const mockSuccessResponse: IContributionResponse = {
    status: {
      statusCode: 200,
      statusDescription: 'Success',
    },
    data: {
      aporte: [mockAporte],
      page: {
        totalElement: 1,
        totalPage: 0,
      },
    },
  };

  const mockContextValue: ContextType = {
    cuentaId: mockCuentaId,
    setSelectedContributions: jest.fn(),
  };

  const renderComponent = (contextValue: ContextType = mockContextValue) => {
    return render(
      <DepositAccountTransferContext.Provider value={contextValue}>
        <DepositAccountContribution />
      </DepositAccountTransferContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (contributionPost as jest.Mock).mockResolvedValue(mockSuccessResponse);
  });

  describe('Inicialización y renderizado', () => {
    it('debería renderizar correctamente con valores iniciales', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('mock-contribution-view')).toBeInTheDocument();
      });
    });

    it('debería mostrar mensaje cuando no hay cuentaId seleccionada', () => {
      renderComponent({ ...mockContextValue, cuentaId: null });
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'No se ha seleccionado una cuenta.'
      );
    });
  });

  describe('Manejo de datos y paginación', () => {
    it('debería cargar datos iniciales correctamente', async () => {
      renderComponent();
      await waitFor(() => {
        expect(contributionPost).toHaveBeenCalledWith(
          expect.objectContaining({
            cuentaId: mockCuentaId,
            page: { page: 0, size: 20 },
          })
        );
      });
    });

    it('debería manejar cambios en el tamaño de página', async () => {
      renderComponent();
      const pageSizeSelect = screen.getByTestId('page-size-select');
      fireEvent.change(pageSizeSelect, { target: { value: '50' } });
      await waitFor(() => {
        expect(contributionPost).toHaveBeenCalledWith(
          expect.objectContaining({
            page: { page: 0, size: 50 },
          })
        );
      });
    });
  });

  describe('Manejo de errores y casos límite', () => {
    it('debería manejar error de servicio', async () => {
      const error = new Error('Error del servicio');
      (contributionPost as jest.Mock).mockRejectedValue(error);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Error al consultar aportes'
        );
      });
    });

    it('debería manejar respuesta sin datos (código 206)', async () => {
      (contributionPost as jest.Mock).mockResolvedValue({
        status: { statusCode: 206 },
        data: null,
      });
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'La consulta no generan datos'
        );
      });
    });

    it('debería manejar error de validación (código 400)', async () => {
      (contributionPost as jest.Mock).mockResolvedValue({
        status: { 
          statusCode: 400,
          statusDescription: 'Error de validación'
        },
        data: null,
      });
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Los parámetros de consulta no generan información'
        );
      });
    });
  });

  describe('Manejo de selección', () => {
    it('debería manejar la selección de registros', async () => {
      const mockSetSelectedContributions = jest.fn();
      renderComponent({
        ...mockContextValue,
        setSelectedContributions: mockSetSelectedContributions
      });

      await waitFor(() => {
        mockHandleSelectionChange([{
          cuentaAporteId: '1',
          cuentaId: mockCuentaId,
          fondoId: '1'
        }]);
      });

      expect(mockSetSelectedContributions).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            cuentaAporteId: '1',
            cuentaId: mockCuentaId
          })
        ])
      );
    });

    it('debería limpiar la selección cuando se deseleccionan todos los registros', async () => {
      const mockSetSelectedContributions = jest.fn();
      renderComponent({
        ...mockContextValue,
        setSelectedContributions: mockSetSelectedContributions
      });

      await waitFor(() => {
        mockHandleSelectionChange([]);
      });

      expect(mockSetSelectedContributions).toHaveBeenCalledWith(null);
    });
  });

  describe('Filtros y reseteo', () => {
    it('debería resetear filtros correctamente', async () => {
      renderComponent();
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-page')).toHaveTextContent('Página: 1');
      });
    });

    it('debería aplicar filtros correctamente', async () => {
      renderComponent();
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(contributionPost).toHaveBeenCalledWith(
          expect.objectContaining({
            page: { page: 0, size: 20 },
          })
        );
      });
    });
  });
});