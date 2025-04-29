import React from "react";
import { render } from "@testing-library/react";
import { CustomCard } from "../CustomCard";

describe("CustomCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(render(<CustomCard>test</CustomCard>));
  });
});
