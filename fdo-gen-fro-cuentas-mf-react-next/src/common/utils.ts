import { saveAs } from "file-saver";
import { Parser } from "json2csv";
import dayjs from "dayjs";

// TODO: add documentation
export const setStateValue = (
  item:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>,
  setState: React.Dispatch<any>,
  property: string,
  value?: any
) => {
  let valueToSet: any = value === undefined ? item.target.value : value;
  setState((prevState: any) => ({
    ...prevState,
    [property]: valueToSet,
  }));
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatDate = (value: string): string => {
  const date = new Date(value);

  const formattedDate = date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
};

export const formatPeriodForService = (
  period: any | null
): any | null => {
  if (!period) return null;
  return period.replace("-", "");
};

export const formatBalanceValue = (
  value: string | number | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return CURRENCY_FORMATTER.format(0);
  }

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return Number.isNaN(numericValue)
    ? CURRENCY_FORMATTER.format(0)
    : CURRENCY_FORMATTER.format(numericValue);
};

export const getFileName = (nombre: string, identificador?: string , idIdentificador?: number ) => {
  const date = dayjs().format("DD-MM-YYYY-HH-mm-ss");
  return `${nombre}${identificador ?  '-' + identificador: ""}${idIdentificador ? '-' + idIdentificador : "" }-${date}.csv`;
};

export const saveFile = (data: any, fileName: string) => {
  const json2csvParser = new Parser({ delimiter: ";" });
  const csv = json2csvParser.parse(data);
  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};

export const formatCurrency = (value: number): string => {
  return value !== null && value !== undefined
    ? CURRENCY_FORMATTER.format(value)
    : "-";
};
