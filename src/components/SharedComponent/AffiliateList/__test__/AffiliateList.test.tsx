import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AffiliateList } from '../AffiliateList';

jest.mock('../AfilliateListView', () => ({
  AfilliateListView: jest.fn(({ onConsult, onPageChange, onItemsPerPageChange }) => (
    <div>
      <button onClick={() => onConsult({ afiliadoFondoId: '123' })} data-testid="consult-button">
        Consult
      </button>
      <button onClick={() => onPageChange(2)} data-testid="page-change-button">
        Next Page
      </button>
      <button onClick={() => onItemsPerPageChange(20)} data-testid="page-size-button">
        Change Page Size
      </button>
    </div>
  )),
}));

describe('AffiliateList Component', () => {
  const mockGetData = jest.fn();
  const mockOnCloseModal = jest.fn();
  const mockSetSelectedAffiliate = jest.fn();

  const defaultProps = {
    getData: mockGetData,
    isModalOpen: true,
    onCloseModal: mockOnCloseModal,
    setSelectedAffiliate: mockSetSelectedAffiliate,
    initialPageSize: 10,
    modalTitle: 'Test Modal'
  };

  const mockApiResponse = {
    data: {
      suscriptor: [
        {
          tipoIdentificacion: 'CC',
          numeroIdentificacion: '123456',
          primerApellido: 'Doe',
          segundoApellido: 'Smith',
          primerNombre: 'John',
          segundoNombre: 'James',
          afiliadoFondoId: '123'
        }
      ],
      page: {
        totalElement: 100,
        totalPage: 10,
        size: 10,
        page: 0
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetData.mockResolvedValue(mockApiResponse);
  });

  test('renders the component and fetches initial data', async () => {
    render(<AffiliateList {...defaultProps} />);
    
    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith(0, 10);
    });
  });

  test('handles empty data response', async () => {
    mockGetData.mockResolvedValueOnce({
      data: {
        suscriptor: [],
        page: {
          totalElement: 0,
          totalPage: 1,
          size: 10,
          page: 0
        }
      }
    });

    render(<AffiliateList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('consult-button')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    mockGetData.mockRejectedValueOnce(new Error('API Error'));

    render(<AffiliateList {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalled();
    });
  });

  test('handles page change', async () => {
    render(<AffiliateList {...defaultProps} />);

    const pageChangeButton = await screen.findByTestId('page-change-button');
    fireEvent.click(pageChangeButton);

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith(1, 10);
    });
  });

  test('handles page size change', async () => {
    render(<AffiliateList {...defaultProps} />);

    const pageSizeButton = await screen.findByTestId('page-size-button');
    fireEvent.click(pageSizeButton);

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith(0, 20);
    });
  });

  test('handles affiliate consultation', async () => {
    render(<AffiliateList {...defaultProps} />);

    const consultButton = await screen.findByTestId('consult-button');
    fireEvent.click(consultButton);

    await waitFor(() => {
      expect(mockSetSelectedAffiliate).toHaveBeenCalledWith({ afiliadoFondoId: '123' });
    });
  });

  test('does not fetch data when modal is closed', () => {
    render(<AffiliateList {...defaultProps} isModalOpen={false} />);
    expect(mockGetData).not.toHaveBeenCalled();
  });

  test('handles invalid page numbers', async () => {
    render(<AffiliateList {...defaultProps} />);
    
    const component = screen.getByTestId('page-change-button');
    
    fireEvent.click(component);
    
    await waitFor(() => {
      expect(mockGetData).not.toHaveBeenCalledWith(-1, 10);
    });
  });

  test('updates data when modal is opened', async () => {
    const { rerender } = render(<AffiliateList {...defaultProps} isModalOpen={false} />);
    
    expect(mockGetData).not.toHaveBeenCalled();
    
    rerender(<AffiliateList {...defaultProps} isModalOpen={true} />);
    
    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith(0, 10);
    });
  });
});