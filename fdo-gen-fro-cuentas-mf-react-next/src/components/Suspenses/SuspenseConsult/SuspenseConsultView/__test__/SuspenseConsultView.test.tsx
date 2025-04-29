// SuspenseConsultView.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core"; // Importar MantineProvider
import { SuspenseView } from "../SuspenseConsultView";
import { SuspenseConsultContext } from "@/context/SuspenseConsultContext";
import { ISuspense } from "../../SuspenseConsultFormView/ISuspenseConsultForm";
import { ISuspenseUpdate } from "../../SuspenseConsultDetail/SuspenseDetailUpdate/ISuspenseDetailUpdate";
import { ISuspenseMovement } from "../../SuspenseConsultDetail";
import { ICuentaRaw } from "@/components/Accounts";

// Mock del contexto

interface ISuspenseConsultContext {
  cuentaId: number | null;
  setCuentaId: React.Dispatch<React.SetStateAction<number | null>>;
  isShowConsultForm: boolean;
  setIsShowConsultForm: React.Dispatch<React.SetStateAction<boolean>>;
  suspense: ISuspense[];
  setSuspense: React.Dispatch<React.SetStateAction<ISuspense[]>>;
  account: ICuentaRaw[];
  setAccount: React.Dispatch<React.SetStateAction<ICuentaRaw[]>>;
  update: ISuspenseUpdate[];
  setUpdate: React.Dispatch<React.SetStateAction<ISuspenseUpdate[]>>;
  movements: ISuspenseMovement[];
  setMovements: React.Dispatch<React.SetStateAction<ISuspenseMovement[]>>;
}

const mockContext: ISuspenseConsultContext = {
  cuentaId: 12345,
  setCuentaId: jest.fn(),
  account: [], 
  setAccount: jest.fn(),
  isShowConsultForm: true,
  setIsShowConsultForm: jest.fn(),
  suspense: [],
  setSuspense: jest.fn(),
  update: [],
  setUpdate: jest.fn(),
  movements: [],
  setMovements: jest.fn(),
};

const renderWithContext = () => {
  return render(
    <MantineProvider> {/* Envolver con MantineProvider */}
      <SuspenseConsultContext.Provider
        value={mockContext}
      >
        <SuspenseView />
      </SuspenseConsultContext.Provider>
    </MantineProvider>
  );
};

describe("SuspenseConsultView Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Renderiza el formulario cuando isShowConsultForm es true", () => {
    renderWithContext();
    // console.log(container.innerHTML)

    // Verificar que el formulario se renderiza
    expect(screen.getByTestId("suspense-filter-form")).toBeInTheDocument();
  });

// test("Renderiza el botón 'Volver' y cambia el estado cuando se hace clic", () => {
//   mockContext.isShowConsultForm = false;
//   console.log(mockContext);
//   const {container} = renderWithContext();
//   console.log(container.innerHTML);
//   // Verificar que el botón 'Volver' se renderiza

//   const volverButton = screen.getByTestId("volver-button"); // Cambiar a getByRole

//   // const volverButton = screen.getByTestId("volver-button"); // Cambiar a getByTestId
//   expect(volverButton).toBeInTheDocument();

//   // Simular clic en el botón
//   // fireEvent.click(volverButton);

//   // Verificar que se llama a setIsShowConsultForm con true
//   // expect(mockSetIsShowConsultForm).toHaveBeenCalledWith(true);
// });

// test("Renderiza correctamente las pestañas cuando isShowConsultForm es false", () => {
//     renderWithContext(false);
  
//     // Verificar que las pestañas se renderizan buscando por su texto accesible
//     const detallesTab = screen.getByText("Detalles del rezago");
//     const movimientosTab = screen.getByText("Movimientos del rezago");
  
//     expect(detallesTab).toBeInTheDocument();
//     expect(movimientosTab).toBeInTheDocument();
  
//     // Simular clic en la pestaña "Movimientos del rezago"
//     fireEvent.click(movimientosTab);
  
//     // Verificar que el contenido de la pestaña "Movimientos del rezago" se renderiza
//     expect(screen.getByText(/Movimientos del rezago/i)).toBeInTheDocument();
//   });
});