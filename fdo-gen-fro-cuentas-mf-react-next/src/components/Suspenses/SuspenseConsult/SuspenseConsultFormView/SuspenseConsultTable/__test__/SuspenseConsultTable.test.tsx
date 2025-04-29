import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SuspenseTable, SuspenseTableProps } from "../SuspenseConsultTable";
import { SuspenseConsultContext } from "@/context";

const newMockRecords = [
  {
    rezagoId: 101,
    saldoPesos: 5000,
    estadoLevante: "Activo",
    indicadorCongelamiento: "N",
    causalCongelaRezagoId: "NINGUNA",
    periodoPago: 202401,
    cuentaId: 98765,
    tipoIdDetalle: "TI",
    numeroIdDetalle: 12345678,
    primerApellido: "GARCIA",
    segundoApellido: "MARTINEZ",
    primerNombre: "CARLOS",
    segundoNombre: "ANDRES",
    tipoRezagoId: "CON_CUENTA",
    causalRezagoId: "TRANSFERENCIA",
    tipoIdNitPago: "NIT",
    nitPago: 900123456,
    razonSocial: "Empresa XYZ",
    fechaPago: "2024-12-01",
    fechaCreacion: "2024-12-15",
    encabezadoPlanillaId: 42,
  },
];

const newMockContext = {
  setIsShowConsultForm: jest.fn(),
  setSuspense: jest.fn(),
  setCuentaId: jest.fn(),
};

const newMockProps: SuspenseTableProps = {
  page: 2,
  records: newMockRecords,
  pageSize: 5,
  totalRecords: newMockRecords.length,
  setPage: jest.fn(),
  onItemsPerPageChange: jest.fn(),
};

describe("SuspenseTable - New Tests", () => {
  it("calls context functions when clicking on rezagoId link", () => {
    render(
      <SuspenseConsultContext.Provider value={newMockContext}>
        <SuspenseTable {...newMockProps} />
      </SuspenseConsultContext.Provider>
    );

    const rezagoIdLink = screen.getByText(newMockRecords[0].rezagoId);
    fireEvent.click(rezagoIdLink);

    expect(newMockContext.setIsShowConsultForm).toHaveBeenCalledWith(false);
    expect(newMockContext.setSuspense).toHaveBeenCalledWith([newMockRecords[0]]);
    expect(newMockContext.setCuentaId).toHaveBeenCalledWith(newMockRecords[0].cuentaId);
  });

  it("renders razonSocial column with correct formatting", () => {
    render(<SuspenseTable {...newMockProps} />);

    const razonSocialCell = screen.getByText(newMockRecords[0].razonSocial);
    expect(razonSocialCell).toBeInTheDocument();
    expect(razonSocialCell).toHaveStyle({
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    });
  });

  it("renders razonSocial column with fallback value when empty", () => {
    const recordsWithEmptyRazonSocial = [
      { ...newMockRecords[0], razonSocial: null },
    ];
    render(
      <SuspenseTable
        {...newMockProps}
        records={recordsWithEmptyRazonSocial}
      />
    );

    const fallbackCell = screen.getByText("-");
    expect(fallbackCell).toBeInTheDocument();
  });

  it("renders razonSocial column with numeric value correctly formatted", () => {
    const recordsWithNumericRazonSocial = [
      { ...newMockRecords[0], razonSocial: 12345 },
    ];
    render(
      <SuspenseTable
        {...newMockProps}
        records={recordsWithNumericRazonSocial}
      />
    );

    const numericCell = screen.getByText("12345");
    expect(numericCell).toBeInTheDocument();
  });
});