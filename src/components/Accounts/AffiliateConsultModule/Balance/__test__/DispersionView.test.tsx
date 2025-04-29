import React from "react";
import { render } from "@testing-library/react";
import { DispersionView } from "../Dispersion/DispersionView";

describe("BalanceView Component", () => {
  const defaultProps = {
    historicDispersion: [
      {
        saldoPortafolioId: "18",
        cuentaId: "100",
        fondoId: "1",
        inversionId: "1",
        obligatorio: "5399.887787",
        voluntarioAfiliado: "0",
        voluntarioEmpleador: "0.47988418",
        retencionContingente: "0",
        usuarioCreacion: "OPS$OPENECO",
        fechaCreacion: "2010-10-17",
        fechaModificacion: "2024-08-25",
        usuarioModificacion: "OPS$OPEEDRO",
      },
    ],
  };
  const renderComponent = (props = {}) => {
    return render(<DispersionView {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(renderComponent());
  });
});
