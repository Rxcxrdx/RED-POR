export const mockPostAssociateValidationOperation200 = {
  status: { statusCode: 200, statusDescription: "Transaccion Exitosa" },
  data: 15,
};

export const mockPostAssociateValidationOperation206 = {
  status: {
    statusCode: 206,
    statusDescription: "Los criterios de consulta no generan información",
  },
  data: null,
};

export const mockPostAssociateValidationOperation400 = {
  status: {
    statusCode: 400,
    statusDescription: "Error - Datos de entrada requeridos",
  },
  data: null,
};

export const mockPostAssociateValidationOperation500 = {
  status: {
    statusCode: 500,
    statusDescription: "Internal Server Error",
  },
  data: null,
};
