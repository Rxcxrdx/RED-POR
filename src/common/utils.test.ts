import { 
  setStateValue, 
  CURRENCY_FORMATTER, 
  formatPeriodForService, 
  getFileName, 
  saveFile, 
  formatBalanceValue, 
  formatCurrency 
} from './utils';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { Parser } from 'json2csv';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('json2csv', () => ({
  Parser: jest.fn().mockImplementation(() => ({
    parse: jest.fn().mockReturnValue('csv-content'),
  })),
}));

describe('utils', () => {
  describe('setStateValue', () => {
    it('should set state value from event target value', () => {
      const setState = jest.fn();
      const event = { target: { value: 'test-value' } } as React.ChangeEvent<HTMLInputElement>;
      setStateValue(event, setState, 'testProperty');
      expect(setState).toHaveBeenCalledWith(expect.any(Function));
      const setStateFunction = setState.mock.calls[0][0];
      const prevState = { otherProperty: 'other-value' };
      const newState = setStateFunction(prevState);
      expect(newState).toEqual({
        ...prevState,
        testProperty: 'test-value',
      });
    });

    it('should set state value from provided value', () => {
      const setState = jest.fn();
      const event = { target: { value: 'test-value' } } as React.ChangeEvent<HTMLInputElement>;
      setStateValue(event, setState, 'testProperty', 'provided-value');
      expect(setState).toHaveBeenCalledWith(expect.any(Function));
      const setStateFunction = setState.mock.calls[0][0];
      const prevState = { otherProperty: 'other-value' };
      const newState = setStateFunction(prevState);
      expect(newState).toEqual({
        ...prevState,
        testProperty: 'provided-value',
      });
    });
  });

  describe('CURRENCY_FORMATTER', () => {
    it('should format number as currency', () => {
      const formatted = CURRENCY_FORMATTER.format(123456);
      expect(formatted.replace(/\u00A0/g, ' ')).toBe('$ 123.456');
    });
  });

  describe('formatPeriodForService', () => {
    it('should return null for null period', () => {
      const result = formatPeriodForService(null);
      expect(result).toBeNull();
    });

    it('should format period by removing hyphen', () => {
      const result = formatPeriodForService('2021-12');
      expect(result).toBe('202112');
    });
  });

  describe('getFileName', () => {
    it('should generate file name with date', () => {
      const date = dayjs().format('DD-MM-YYYY-HH-mm-ss');
      const fileName = getFileName('test', 'id', 123);
      expect(fileName).toBe(`test-id-123-${date}.csv`);
    });
  });

  describe('saveFile', () => {
    it('should save file with correct data and file name', () => {
      const data = [{ key: 'value' }];
      const fileName = 'test-file.csv';
      saveFile(data, fileName);
      expect(Parser).toHaveBeenCalledWith({ delimiter: ';' });
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), fileName);
    });
  });

  describe('formatBalanceValue', () => {
    it('should format null value as $ 0', () => {
      const result = formatBalanceValue(null);
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 0'); // Normaliza el espacio
    });
  
    it('should format undefined value as $ 0', () => {
      const result = formatBalanceValue(undefined);
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 0'); // Normaliza el espacio
    });
  
    it('should format empty string as $ 0', () => {
      const result = formatBalanceValue('');
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 0'); // Normaliza el espacio
    });
  
    it('should format valid numeric string as currency', () => {
      const result = formatBalanceValue('123456');
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 123.456'); // Normaliza el espacio
    });
  
    it('should format valid number as currency', () => {
      const result = formatBalanceValue(123456);
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 123.456'); // Normaliza el espacio
    });
  
    it('should format NaN as $ 0', () => {
      const result = formatBalanceValue('not-a-number');
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 0'); // Normaliza el espacio
    });
  });

  describe('formatCurrency', () => {
    // NUEVA PRUEBA
    it('should format valid number as currency', () => {
      const result = formatCurrency(123456);
      expect(result.replace(/\u00A0/g, ' ')).toBe('$ 123.456');
    });

    // NUEVA PRUEBA
    it('should return "-" for null value', () => {
      const result = formatCurrency(null);
      expect(result).toBe('-');
    });

    // NUEVA PRUEBA
    it('should return "-" for undefined value', () => {
      const result = formatCurrency(undefined);
      expect(result).toBe('-');
    });
  });
});