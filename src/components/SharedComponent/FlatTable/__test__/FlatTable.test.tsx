import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FlatTable } from "../FlatTable";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  TableContainer: ({
    children,
    "aria-label": ariaLabel,
    $borderStyle,
    $variants,
  }) => (
    <div
      data-testid="table-container"
      data-aria-label={ariaLabel}
      data-border-style={$borderStyle}
      data-variants={$variants ? $variants.join(",") : ""}
    >
      {children}
    </div>
  ),
  TableHeader: ({ children, $columns }) => (
    <div data-testid="table-header">
      {$columns.map((column) => children(column))}
    </div>
  ),
  TableBody: ({ children, $items, $emptyContent }) => (
    <div data-testid="table-body" data-empty-content={$emptyContent}>
      {$items.map((item) => children(item))}
    </div>
  ),
  TableRow: ({ children, $columns, key }) => (
    <div data-testid="table-row-undefined" key={key}>
      {$columns.map((columnKey) => children(columnKey))}
    </div>
  ),
  TableColumn: ({ children, key, $width }) => (
    <div data-testid="table-column-undefined" data-width={$width} key={key}>
      {children}
    </div>
  ),
  TableCell: ({ children }) => <div data-testid="table-cell">{children}</div>,
}));

describe("FlatTable Component", () => {
  const sampleData = [
    { id: 1, name: "John", age: 30, email: "john@example.com" },
    { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
    { id: 3, name: "Bob", age: 40, email: null },
  ];

  const sampleColumns = [
    { key: "name", label: "Name", width: "150px" },
    { key: "age", label: "Age", width: "80px" },
    { key: "email", label: "Email Address", width: "200px" },
  ];

  test("renders no data message when data is empty", () => {
    render(<FlatTable data={[]} />);
    expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
  });

  test("renders table with provided data and auto-generated columns", () => {
    render(<FlatTable data={sampleData} />);

    expect(screen.getByTestId("table-container")).toBeInTheDocument();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();

    // Buscar columnas con texto específico en lugar de por data-testid
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();

    // Verificar la presencia de filas y datos
    const rows = screen.getAllByTestId("table-row-undefined");
    expect(rows.length).toBe(3);

    const cells = screen.getAllByTestId("table-cell");
    expect(cells.length).toBe(12); // 3 filas x 4 columnas

    // Verificar contenido de celdas específicas
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("renders table with provided columns", () => {
    render(<FlatTable data={sampleData} columns={sampleColumns} />);

    // Verificar que las etiquetas de columna personalizadas están presentes
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();

    // Verificar que el Id no se muestra (no está incluido en las columnas personalizadas)
    expect(screen.queryByText("Id")).not.toBeInTheDocument();
  });

  test("applies custom column widths", () => {
    render(<FlatTable data={sampleData} columns={sampleColumns} />);

    // Verificar que los anchos se aplican correctamente
    const columns = screen.getAllByTestId("table-column-undefined");

    // Verificar que la primera columna tiene el ancho correcto
    expect(columns[0]).toHaveAttribute("data-width", "150px");
    expect(columns[1]).toHaveAttribute("data-width", "80px");
    expect(columns[2]).toHaveAttribute("data-width", "200px");
  });

  test("uses custom idField when provided", () => {
    const customIdData = [
      { customId: "a1", name: "John" },
      { customId: "a2", name: "Jane" },
    ];

    render(<FlatTable data={customIdData} idField="customId" />);

    // Verificar que los datos se renderizan correctamente
    const rows = screen.getAllByTestId("table-row-undefined");
    expect(rows.length).toBe(2);

    // Verificar contenido
    expect(screen.getByText("a1")).toBeInTheDocument();
    expect(screen.getByText("a2")).toBeInTheDocument();
  });

  test("handles null and undefined values with dash", () => {
    render(<FlatTable data={sampleData} columns={sampleColumns} />);

    // Verificar que los valores nulos se muestran como "-"
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders table with proper styling", () => {
    render(<FlatTable data={sampleData} />);

    const tableContainer = screen.getByTestId("table-container");
    expect(tableContainer).toHaveAttribute("data-border-style", "flat");
    expect(tableContainer).toHaveAttribute("data-variants", "headerGray");
    expect(tableContainer).toHaveAttribute("data-aria-label", "Tabla simple");
  });

  test("formats camelCase column names correctly", () => {
    const camelCaseData = [
      { id: 1, firstName: "John", lastLoginDate: "2025-03-01" },
    ];

    render(<FlatTable data={camelCaseData} />);

    // Verificar que los nombres de columna en camelCase se formatean con espacios
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Login Date")).toBeInTheDocument();
  });

  test("handles objects without id field", () => {
    const dataWithoutId = [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ];

    render(<FlatTable data={dataWithoutId} />);

    // Verificar que las filas se renderizan correctamente aunque no tengan ID
    const rows = screen.getAllByTestId("table-row-undefined");
    expect(rows.length).toBe(2);

    // Verificar contenido
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });
});
