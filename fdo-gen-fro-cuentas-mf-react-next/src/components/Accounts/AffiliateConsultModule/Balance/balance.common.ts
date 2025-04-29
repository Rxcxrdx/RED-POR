export const balanceColumns = (item: any) => [
  // TODO: check corrections with backend
  { $header: "Fondo Generacional", $key: item.nombreInversion, icon: "topic" },
  { $header: "Valor pesos", $key: item.pesosObligatorio, icon: "money" },
  { $header: "Valor unidades", $key: item.obligatorio, icon: "money" },
];
