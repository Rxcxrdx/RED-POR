import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransferSuspenseLaggingParametersView } from '../TransferSuspenseLaggingParametersView';
import { UseFormReturn } from 'react-hook-form';

jest.mock('../TransferSuspenseLaggingParametersTable', () => ({
  TransferSuspenseLaggingParametersTable: ({
    records,
    page,
    pageSize,
    setPage,
    totalRecords,
    setPageSize,
  }: any) => (
    <div data-testid="lagging-parameters-table">
      <span>Records: {records.length}</span>
      <span>Page: {page}</span>
      <span>PageSize: {pageSize}</span>
      <span>Total Records: {totalRecords}</span>
      <button onClick={() => setPage(page + 1)}>Next Page</button>
      <button onClick={() => setPageSize(50)}>Change Page Size</button>
    </div>
  ),
}));

jest.mock('../form/TransferSuspenseLaggingParametersForm', () => ({
  TransferSuspenseLaggingParametersForm: ({
    filterForm,
    handleFilterSubmit,
    handleFilterReset,
  }: any) => (
    <div data-testid="lagging-parameters-form">
      <button onClick={handleFilterSubmit}>Submit</button>
      <button onClick={handleFilterReset}>Reset</button>
    </div>
  ),
}));

describe('TransferSuspenseLaggingParametersView', () => {
  const mockSetPage = jest.fn();
  const mockSetPageSize = jest.fn();
  const mockSetSelectedRecord = jest.fn();
  const mockHandleFilterSubmit = jest.fn();
  const mockHandleFilterReset = jest.fn();

  const mockFilterForm = {
    handleSubmit: jest.fn(),
    reset: jest.fn(),
    register: jest.fn(),
    formState: { errors: {} },
  } as UseFormReturn<any>;

  const defaultProps = {
    filterFormCaseApplication: mockFilterForm,
    handleFilterSubmit: mockHandleFilterSubmit,
    handleFilterReset: mockHandleFilterReset,
    setPage: mockSetPage,
    setPageSize: mockSetPageSize,
    setSelectedRecord: mockSetSelectedRecord,
    page: 1,
    pageSize: 20,
    isLoading: false,
    errorMessage: '',
    totalRecords: 100,
    selectedRecord: null,
    contributionData: [{ id: 1, name: 'Test' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente la estructura básica', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByText('Información de transferencia')).toBeInTheDocument();
    
    expect(screen.getByTestId('lagging-parameters-table')).toBeInTheDocument();
    expect(screen.getByTestId('lagging-parameters-form')).toBeInTheDocument();
  });

  it('pasa las props correctamente a la tabla', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const table = screen.getByTestId('lagging-parameters-table');
    expect(table).toHaveTextContent('Records: 1');
    expect(table).toHaveTextContent('Page: 1');
    expect(table).toHaveTextContent('PageSize: 20');
    expect(table).toHaveTextContent('Total Records: 100');
  });

  it('pasa las props correctamente al formulario', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const form = screen.getByTestId('lagging-parameters-form');
    expect(form).toBeInTheDocument();
  });

  it('maneja los estilos correctamente', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const container = screen.getByTestId('lagging-parameters-form').parentElement;
    expect(container).toHaveStyle({
      borderRadius: '8px',
      border: '1px solid #e8f4e1',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
    });
  });

  it('renderiza correctamente con datos vacíos', () => {
    const propsWithEmptyData = {
      ...defaultProps,
      contributionData: [],
      totalRecords: 0,
    };

    render(<TransferSuspenseLaggingParametersView {...propsWithEmptyData} />);
    
    const table = screen.getByTestId('lagging-parameters-table');
    expect(table).toHaveTextContent('Records: 0');
    expect(table).toHaveTextContent('Total Records: 0');
  });

  it('aplica el espacio entre componentes correctamente', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const tableContainer = screen.getByTestId('lagging-parameters-table').parentElement;
    expect(tableContainer).toHaveStyle({
      marginBottom: '16px',
    });
  });

  it('mantiene la estructura flex correcta', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const mainContainer = screen.getByTestId('lagging-parameters-table').parentElement?.parentElement;
    expect(mainContainer).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('renderiza h3 con el estilo correcto', () => {
    render(<TransferSuspenseLaggingParametersView {...defaultProps} />);
    
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Saldo');
    expect(headings[1]).toHaveTextContent('Información de transferencia');
  });
});