import React from "react";
import { render } from "@testing-library/react";
import { BalanceView } from "../BalanceView";

const defaultProps = {
  balanceData: [
    {
      saldoPortafolioId: "201",
      cuentaId: "62636718",
      fondoId: "3",
      inversionId: "1",
      obligatorio: "0",
      voluntarioAfiliado: "0",
      voluntarioEmpleador: "0",
      retencionContingente: "null",
      fechaCreacion: "2024-12-10",
      usuarioCreacion: "MIGRACION",
      fechaModificacion: "null",
      usuarioModificacion: null,
    },
  ],
  dispersionData: [],
};

const renderComponent = (props = {}) =>
  render(<BalanceView {...defaultProps} {...props} />);

describe("BalanceView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(renderComponent());
  });
});
