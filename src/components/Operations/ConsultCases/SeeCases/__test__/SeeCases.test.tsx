import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as services from "@/services/operations";

import SeeCases from "../SeeCases";
import { mockGetConsultCasesResponse } from "@/mocks";

// const mockPayload = {
//   casoId: null,
//   cuentaId: null,
//   codigoOperacionId: null,
//   estado: null,
//   fechaInicial: null,
//   fechaFinal: null,
//   usuario: null,
//   page: { page: 0, size: 10 },
// };

jest.mock("@/services/operations", () => ({
  postCasesService: jest.fn(),
}));

describe("SeeCases Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component correctly", () => {
    expect(render(<SeeCases />));
  });

  it("should search cases when click on consult", async () => {
    (services.postCasesService as jest.Mock).mockResolvedValue(
      mockGetConsultCasesResponse
    );
    render(<SeeCases />);
    const noInformation = screen.getByText("Sin información para mostrar");
    const consultButton = screen.getByText("Consultar");
    await act(async () => {
      fireEvent.click(consultButton);
    });
    expect(noInformation).not.toBeVisible();
  });
});
