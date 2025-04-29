import React from "react";
import { render } from "@testing-library/react";
import { ToggleButton } from "../ToggleButton.component";

describe("ToggleButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(render(<ToggleButton isActive={false} />));
  });
});
