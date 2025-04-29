import React from "react";
import { render } from "@testing-library/react";
import { CardWithIcon } from "../CardWithIcon.component";

describe("CardWithIcon Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(render(<CardWithIcon label="label" value="value" icon={"money"} />));
  });
});
