import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserDetailContainer } from "../UserDetailContainer";
import { createContext } from "react";

jest.mock("../UserDetailView", () => ({
  UserDetailView: ({ userDetail, opened, onToggle }: any) => (
    <div data-testid="user-detail-view">
      <span data-testid="user-name">{userDetail?.nombre}</span>
      <span data-testid="opened-state">{opened.toString()}</span>
      <button onClick={onToggle} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  ),
}));

describe("UserDetailContainer Component", () => {
  const TestContext = createContext<{ userDetail: any }>({ userDetail: null });
  
  const mockUserDetail = {
    nombre: "John Doe",
    identificacion: "123456",
    tipoIdentificacion: "CC",
  };

  const renderComponent = (contextValue = { userDetail: mockUserDetail }) => {
    return render(
      <TestContext.Provider value={contextValue}>
        <UserDetailContainer ContextProvider={TestContext} />
      </TestContext.Provider>
    );
  };

  test("renderiza UserDetailView con las props correctas del contexto", () => {
    renderComponent();
    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
  });

  test("inicializa con opened en false", () => {
    renderComponent();
    expect(screen.getByTestId("opened-state")).toHaveTextContent("false");
  });

  test("maneja el toggle del estado opened", () => {
    renderComponent();
    
    const toggleButton = screen.getByTestId("toggle-button");
    
    expect(screen.getByTestId("opened-state")).toHaveTextContent("false");
    
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("opened-state")).toHaveTextContent("true");
    
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("opened-state")).toHaveTextContent("false");
  });

  test("renderiza con userDetail null", () => {
    renderComponent({ userDetail: null });
    expect(screen.getByTestId("user-name")).toHaveTextContent("");
  });

  test("mantiene el estado opened a través de re-renderizados", () => {
    const { rerender } = renderComponent();
    
    const toggleButton = screen.getByTestId("toggle-button");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("opened-state")).toHaveTextContent("true");
    
    rerender(
      <TestContext.Provider value={{ userDetail: { ...mockUserDetail, nombre: "Jane Doe" } }}>
        <UserDetailContainer ContextProvider={TestContext} />
      </TestContext.Provider>
    );
    
    expect(screen.getByTestId("opened-state")).toHaveTextContent("true");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Doe");
  });

  test("pasa todas las props requeridas a UserDetailView", () => {
    renderComponent();

    const view = screen.getByTestId("user-detail-view");
    expect(view).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("opened-state")).toHaveTextContent("false");
    
    const toggleButton = screen.getByTestId("toggle-button");
    expect(toggleButton).toBeInTheDocument();
  });

  test("maneja múltiples toggles correctamente", () => {
    renderComponent();
    
    const toggleButton = screen.getByTestId("toggle-button");
    
    fireEvent.click(toggleButton); // false -> true
    expect(screen.getByTestId("opened-state")).toHaveTextContent("true");
    
    fireEvent.click(toggleButton); // true -> false
    expect(screen.getByTestId("opened-state")).toHaveTextContent("false");
    
    fireEvent.click(toggleButton); // false -> true
    expect(screen.getByTestId("opened-state")).toHaveTextContent("true");
  });
});