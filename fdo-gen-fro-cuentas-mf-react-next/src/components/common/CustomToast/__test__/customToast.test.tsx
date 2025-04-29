import { showCustomToast } from "../customToast";
import { Toast } from "pendig-fro-transversal-lib-react";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Toast: {
    showStatusCode: jest.fn(),
    show: jest.fn(),
  },
}));

describe("showCustomToast Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls Toast.showStatusCode when type is not 'noResults'", () => {
    const statusCode = 400;
    showCustomToast(statusCode);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(statusCode);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  test("calls Toast.showStatusCode with string status codes", () => {
    const statusCode = "500";
    showCustomToast(statusCode);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(statusCode);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  test("calls Toast.show with correct parameters when type is 'noResults'", () => {
    showCustomToast("noResults");

    expect(Toast.show).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith("Sin resultados", {
      $borderLeft: true,
      $iconSwap: "info",
      $color: "red",
      $content:
        "La búsqueda no arrojó resultados. Intenta ajustar tus criterios de búsqueda o verifica la información ingresada.",
      $type: "soft",
      $showCloseButton: true,
    });
    expect(Toast.showStatusCode).not.toHaveBeenCalled();
  });

  test("handles null input by passing it to showStatusCode", () => {
    showCustomToast(null);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(null);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  test("handles undefined input by passing it to showStatusCode", () => {
    showCustomToast(undefined);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(undefined);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  test("handles numeric input by passing it to showStatusCode", () => {
    showCustomToast(404);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(404);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  test("handles object input by passing it to showStatusCode", () => {
    const errorObject = { code: 403, message: "Forbidden" };
    showCustomToast(errorObject);

    expect(Toast.showStatusCode).toHaveBeenCalledTimes(1);
    expect(Toast.showStatusCode).toHaveBeenCalledWith(errorObject);
    expect(Toast.show).not.toHaveBeenCalled();
  });
});
