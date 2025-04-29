import { fireEvent, render, screen } from "@testing-library/react";

import * as services from "@/services";
import { mockPostSearchValidationService } from "@/mocks";

import AdminValidation from "../AdminValidation";

jest.mock("@/services", () => ({
  postSearchValidationsService: jest.fn(),
}));

describe("AdminValidation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (services.postSearchValidationsService as jest.Mock).mockResolvedValue(
      mockPostSearchValidationService
    );
    render(<AdminValidation />);
  });

  it("should render table when click on search button", () => {
    const searchButton = screen.getByText("Consultar");
    fireEvent.click(searchButton);
    const tableRows = document.getElementsByTagName("tr");
    expect(tableRows.length > 0);
  });
});
