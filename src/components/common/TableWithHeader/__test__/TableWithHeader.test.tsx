import React from "react";
import { render } from "@testing-library/react";
import { TableWithHeader } from "../TableWithHeader.component";

describe("TableWithHeader Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(
      render(
        <TableWithHeader
          title="test"
          tableProps={{
            $columns: [],
            $data: [],
            $currentPage: 0,
            $totalPages: 0,
            $itemsPerPage: 0,
            $totalItems: 0,
            $onPageChange: () => {},
            $onItemsPerPageChange: () => {},
            $itemsPerPageOptions: [2, 10, 20, 30],
            $onSelectionChange: () => {},
            $onSort: () => {},
            $variants: ["headerGray", "withShadow", "stripedRows"],
          }}
        />
      )
    );
  });
});
