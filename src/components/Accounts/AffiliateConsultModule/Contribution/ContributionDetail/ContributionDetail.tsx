import React from "react";

import {
  Accordion,
  AccordionTab,
  Button,
} from "pendig-fro-transversal-lib-react";

import {
  BoxMessage,
  CustomCard,
  DataboxIterator,
  Loader,
} from "@/components/common";
import { TabsWithLogic } from "@/components/SharedComponent";

import { IDetailData } from "../IContribution";
import { ContributionDetailTable } from "./ContributionDetailTable";
import { MovementsDetailTable } from "./MovementsDetailTable";

interface ContributionDetailProps {
  detailData: IDetailData | null;
  movementsData: any[] | null;
  onBack: () => void;
  isLoadingDetail: boolean;
  detailError: string;
  movementsError: string;
  errorMessage: string;
  selectedRecord: any;
}

export const ContributionDetail: React.FC<ContributionDetailProps> = ({
  detailData,
  movementsData,
  onBack,
  isLoadingDetail,
  detailError,
  movementsError,
  errorMessage,
  selectedRecord,
}) => {
  const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const contributionSummary = [
    { title: "Aporte Id", value: selectedRecord.cuentaAporteId },
    { title: "Periodo pago", value: selectedRecord.periodoPago },
    { title: "Fecha de", value: selectedRecord.fechaPago },
    { title: "Fecha acreditación", value: selectedRecord.fechaCreacion },
    {
      title: "IBC calculado",
      value: CURRENCY_FORMATTER.format(selectedRecord.salarioBaseCal),
    },
    {
      title: "IBC informado",
      value: CURRENCY_FORMATTER.format(selectedRecord.salarioBase),
    },
    { title: "Id empleador", value: selectedRecord.numeroIdAportante },
    { title: "Razón social", value: selectedRecord.razonSocial },
    { title: "Código operación", value: selectedRecord.codigoOperacionId },
  ];

  const tabElements = [
    {
      id: "contribution",
      $title: "Aportes",
      component: (
        <ContributionDetailTable
          detailData={detailData}
          detailError={detailError}
        />
      ),
    },
    {
      id: "movements",
      $title: "Movimientos",
      component: (
        <MovementsDetailTable
          movementsData={movementsData}
          movementsError={movementsError}
        />
      ),
    },
  ];

  return (
    <>
      <Loader isLoading={isLoadingDetail} />
      {/* TODO: remove this button when this layout is implemented with the new contributions layout  */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "white",
          padding: "16px 0",
          marginBottom: "16px",
        }}
      >
        <Button onClick={onBack}>Volver</Button>
      </div>

      {errorMessage && <BoxMessage errorMessage={errorMessage} />}
      <Accordion>
        <AccordionTab $header="Resumen del Aporte">
          <DataboxIterator itemsArray={contributionSummary} />
        </AccordionTab>
      </Accordion>

      <CustomCard>
        <TabsWithLogic tabElements={tabElements} />
      </CustomCard>
    </>
  );
};
