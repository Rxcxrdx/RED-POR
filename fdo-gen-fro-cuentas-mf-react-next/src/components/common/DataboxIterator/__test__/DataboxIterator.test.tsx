import React from "react";
import { render } from "@testing-library/react";
import { DataboxIterator } from "../DataboxIterator.component";

describe("DataboxIterator Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(
      render(
        <DataboxIterator itemsArray={[{ title: "test", value: "test" }]} />
      )
    );
  });
});
