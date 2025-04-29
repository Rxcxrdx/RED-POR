import { Tabs } from "@mantine/core";
import React, { useContext } from "react";

import {
  TransferSuspenseAccount,
  TransferSuspenseValidation,
  TransferSuspenseContribution,
  TransferSuspenseCaseApplication,
  TransferSuspenseLaggingParameters,
} from "@/components";
import { CustomCard } from "@/components/common";
import { TransferSuspenseContext, TransferSuspenseProvider } from "@/context";

const TransferSuspenseContent = () => {
  const { setCurrentTab } = useContext(TransferSuspenseContext);

  const tabOptionsTransferSuspense = [
    {
      value: "affiliate",
      label: "Afiliado",
      component: <TransferSuspenseAccount />,
    },
    {
      value: "contribution",
      label: "Aportes",
      component: <TransferSuspenseContribution />,
    },
    {
      value: "laggingParameters",
      label: "Parametros Rezagos",
      component: <TransferSuspenseLaggingParameters />,
    },
    {
      value: "validation",
      label: "Validación",
      component: <TransferSuspenseValidation />,
    },
    {
      value: "caseApplication",
      label: "Aplicación Caso",
      component: <TransferSuspenseCaseApplication />,
    },
  ];

  return (
    <CustomCard style={{ width: "100%" }}>
      <h2>Operación Transferencia Cuenta CCAI a Rezago</h2>
      <Tabs
        color="#fb6903"
        defaultValue="affiliate"
        onChange={(value) => setCurrentTab(value || "affiliate")}
      >
        <Tabs.List>
          {tabOptionsTransferSuspense.map((options) => (
            <Tabs.Tab key={options.value} value={options.value}>
              {options.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabOptionsTransferSuspense.map((options) => (
          <Tabs.Panel key={options.value} mt={24} value={options.value}>
            {options.component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </CustomCard>
  );
};

const TransferSuspenseView = () => {
  return (
    <TransferSuspenseProvider>
      <TransferSuspenseContent />
    </TransferSuspenseProvider>
  );
};

export { TransferSuspenseView };
