import React, { useContext } from "react";

import { Button } from "pendig-fro-transversal-lib-react";

import { TabsWithLogic } from "@/components/SharedComponent";

import { SuspenseConsultForm } from "../SuspenseConsultFormView/SuspenseConsultForm";
import { SuspenseConsultDetail } from "../SuspenseConsultDetail/SuspenseDetail";
import {
  SuspenseConsultContext,
  SuspenseConsulttProvider,
} from "@/context/SuspenseConsultContext";
import { SuspenseDetailMovements } from "../SuspenseConsultDetail/SuspenseDetailMovements/SuspenseDetailMovements";

import styles from "./SuspenseConsultView.module.scss";

const SuspenseContent = () => {
  const { isShowConsultForm, setIsShowConsultForm } = useContext(
    SuspenseConsultContext
  );

  const tabElements = [
    {
      id: "affiliate",
      $title: "Detalles del rezago",
      component: <SuspenseConsultDetail />,
    },
    {
      id: "contribution",
      $title: "Movimientos del rezago",
      component: <SuspenseDetailMovements />,
    },
  ];

  return (
    <div style={{ width: "100%", padding: "0px 40px" }}>
      {isShowConsultForm ? (
        <SuspenseConsultForm />
      ) : (
        <>
          <div className={styles.buttonContainer}>
            <Button
              data-testid="volver-button"
              role="button"
              color="primary"
              $size="small"
              onClick={() => {
                setIsShowConsultForm(true);
              }}
            >
              Volver
            </Button>
          </div>
          <TabsWithLogic tabElements={tabElements} />
        </>
      )}
    </div>
  );
};

const SuspenseView = () => {
  return (
    <SuspenseConsulttProvider>
      <SuspenseContent />
    </SuspenseConsulttProvider>
  );
};

export { SuspenseView };
