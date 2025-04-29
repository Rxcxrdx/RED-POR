import React from "react";
import { render } from "@testing-library/react";
import { TabsWithLogic } from "../TabsWithLogic";

const mockTabElements = [
  { id: "balance", $title: "Saldos", component: <></> },
  { id: "validity", $title: "Vigencias", component: <></> },
];

describe("BalanceView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render component correctly", () => {
    expect(
      render(
        <TabsWithLogic
          tabElements={mockTabElements}
          currentTab={mockTabElements[0]}
          handleTabClick={() => {}}
        />
      )
    );
  });
});
