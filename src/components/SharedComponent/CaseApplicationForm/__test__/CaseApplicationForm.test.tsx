import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useForm } from "react-hook-form";

import { CaseApplicationForm } from "../CaseApplicationForm";
import {
  causalTypeOptions,
  relatedWithOptions,
  requirementTypeOptions,
} from "@/common/constants";

jest.mock("pendig-fro-transversal-lib-react", () => ({
  Input: ({
    "data-testid": testId,
    onChange,
    value,
    $title,
    $isError,
    placeholder,
  }: any) => (
    <input
      data-testid={testId}
      onChange={onChange}
      value={value || ""}
      aria-label={$title}
      placeholder={placeholder}
      aria-invalid={$isError}
    />
  ),
  Dropdown: ({
    "data-testid": testId,
    onChange,
    $Value,
    $options,
    $title,
    placeholder,
    $isError,
  }: any) => (
    <select
      data-testid={testId}
      onChange={(e) => onChange(e.target.value)}
      value={$Value || ""}
      aria-label={$title}
      aria-invalid={$isError}
    >
      <option value="">{placeholder}</option>
      {$options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </select>
  ),
}));

describe("CaseApplicationForm", () => {
  const TestWrapper = ({ defaultValues = {}, onSubmit = jest.fn() }) => {
    const methods = useForm({
      defaultValues: {
        tipoRequerimiento: "",
        tipoCausal: "",
        relacionadoCon: "",
        documentoSoporte: "",
        observacion: "",
        ...defaultValues,
      },
    });

    return <CaseApplicationForm filterForm={methods} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos los campos del formulario", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText("Tipo de Requerimiento")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de causal")).toBeInTheDocument();
    expect(screen.getByLabelText("Relacionado con")).toBeInTheDocument();
    expect(screen.getByLabelText("Documento soporte *")).toBeInTheDocument();
    expect(screen.getByLabelText("Observación *")).toBeInTheDocument();
  });

  it("muestra las opciones correctas en los dropdowns", () => {
    render(<TestWrapper />);

    const tipoRequerimiento = screen.getByLabelText("Tipo de Requerimiento");
    const tipoCausal = screen.getByLabelText("Tipo de causal");
    const relacionadoCon = screen.getByLabelText("Relacionado con");

    requirementTypeOptions.forEach((option) => {
      expect(tipoRequerimiento).toHaveTextContent(option.text);
    });

    causalTypeOptions.forEach((option) => {
      expect(tipoCausal).toHaveTextContent(option.text);
    });

    relatedWithOptions.forEach((option) => {
      expect(relacionadoCon).toHaveTextContent(option.text);
    });
  });

  it("maneja los cambios en los campos correctamente", async () => {
    render(<TestWrapper />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Tipo de Requerimiento"), {
        target: { value: requirementTypeOptions[0].value },
      });
      fireEvent.change(screen.getByLabelText("Tipo de causal"), {
        target: { value: causalTypeOptions[0].value },
      });
      fireEvent.change(screen.getByLabelText("Relacionado con"), {
        target: { value: relatedWithOptions[0].value },
      });
      fireEvent.change(screen.getByLabelText("Documento soporte *"), {
        target: { value: "DOC-123" },
      });
      fireEvent.change(screen.getByLabelText("Observación *"), {
        target: { value: "Observación de prueba" },
      });
    });

    expect(screen.getByLabelText("Tipo de Requerimiento")).toHaveValue(
      requirementTypeOptions[0].value
    );
    expect(screen.getByLabelText("Tipo de causal")).toHaveValue(
      causalTypeOptions[0].value
    );
    expect(screen.getByLabelText("Relacionado con")).toHaveValue(
      relatedWithOptions[0].value
    );
    expect(screen.getByLabelText("Documento soporte *")).toHaveValue("DOC-123");
    expect(screen.getByLabelText("Observación *")).toHaveValue(
      "Observación de prueba"
    );
  });

  it("muestra errores cuando los campos requeridos están vacíos", async () => {
    const FormWithValidation = () => {
      const methods = useForm({
        defaultValues: {
          tipoRequerimiento: "",
          tipoCausal: "",
          relacionadoCon: "",
          documentoSoporte: "",
          observacion: "",
        },
      });

      React.useEffect(() => {
        methods.trigger();
      }, [methods]);

      return <CaseApplicationForm filterForm={methods} />;
    };

    render(<FormWithValidation />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const fields = [
      "Tipo de Requerimiento",
      "Tipo de causal",
      "Relacionado con",
      "Documento soporte *",
      "Observación *",
    ];

    fields.forEach((fieldLabel) => {
      const field = screen.getByLabelText(fieldLabel);
      expect(field).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("valida el formulario cuando todos los campos están llenos", async () => {
    const FormWithValidation = () => {
      const methods = useForm({
        defaultValues: {
          tipoRequerimiento: requirementTypeOptions[0].value,
          tipoCausal: causalTypeOptions[0].value,
          relacionadoCon: relatedWithOptions[0].value,
          documentoSoporte: "DOC-123",
          observacion: "Observación de prueba",
        },
      });

      React.useEffect(() => {
        methods.trigger();
      }, [methods]);

      return <CaseApplicationForm filterForm={methods} />;
    };

    render(<FormWithValidation />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const fields = [
      "Tipo de Requerimiento",
      "Tipo de causal",
      "Relacionado con",
      "Documento soporte *",
      "Observación *",
    ];

    fields.forEach((fieldLabel) => {
      const field = screen.getByLabelText(fieldLabel);
      expect(field).not.toHaveAttribute("aria-invalid", "true");
    });
  });
});
