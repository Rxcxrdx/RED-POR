export const mockPostValidationOperationService = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: {
    page: { totalElement: 8, totalPage: 0, actualPage: 0 },
    listValidacion: [
      {
        operacionValidacionId: 1,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 1,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar Saldo Cuadrado",
        descripcion:
          "Valida que la suma de unidades en movimientos credito y debito corresponda con saldo portafolio",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 2,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 2,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar Cuenta Sin Saldo",
        descripcion:
          "Valida que las unidades en saldo portafolio no sean menores o iguales a 0",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 3,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 3,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar Aportes Trasladados",
        descripcion:
          "Valida que los aportes seleccionados no se hayan girado en un traslado de salida",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 4,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 4,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar aportes en cero",
        descripcion:
          "Valida si los detalles de aporte tienen unidades o pesos en cero",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 5,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 5,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar estado afiliado",
        descripcion: "Valida que estado cuenta sea diferente a vigente",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 6,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 6,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar fondo bloqueado para pagos",
        descripcion: "Valida si el fondo esta bloqueado para realizar pagos",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 7,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 7,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
        nombre: "Validar fondo bloqueado para transferencias",
        descripcion:
          "Valida si el fondo esta bloqueado para realizar transferencias entre inversiones",
        nombreOperacion: null,
      },
      {
        operacionValidacionId: 8,
        codigoOperacionId: "DE_CTA_A_REZAGO_CCAI",
        validacionId: 8,
        estado: "ACTIVO",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: "usuario1",
        nombre: "Validación 1",
        descripcion: "Descripción 1",
        nombreOperacion: null,
      },
    ],
  },
};

export const mockPostSearchValidationService = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: {
    page: { totalElement: 5, totalPage: 0, actualPage: 0 },
    listValidacion: [
      {
        validacionId: 1,
        nombre: "Validar Saldo Cuadrado",
        descripcion:
          "Valida que la suma de unidades en movimientos credito y debito corresponda con saldo portafolio",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
      },
      {
        validacionId: 2,
        nombre: "Validar Cuenta Sin Saldo",
        descripcion:
          "Valida que las unidades en saldo portafolio no sean menores o iguales a 0",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
      },
      {
        validacionId: 3,
        nombre: "Validar Aportes Trasladados",
        descripcion:
          "Valida que los aportes seleccionados no se hayan girado en un traslado de salida",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
      },
      {
        validacionId: 4,
        nombre: "Validar aportes en cero",
        descripcion:
          "Valida si los detalles de aporte tienen unidades o pesos en cero",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
      },
      {
        validacionId: 5,
        nombre: "Validar estado afiliado",
        descripcion: "Valida que estado cuenta sea diferente a vigente",
        fechaCreacion: "2024-12-10T00:00:00.000+00:00",
        usuarioCreacion: "sisjuto",
        fechaUltimaModificacion: null,
        usuarioUltimaModificacion: null,
      },
    ],
  },
};

export const mockCreateValidationService = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: 19,
};

export const mockUpdateValidationService = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: 6,
};

export const mockUpdateValidationStateService = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: 6,
};
