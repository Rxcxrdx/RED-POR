import {
  Enfasis,
  Icon,
  ParagraphNormal,
} from "pendig-fro-transversal-lib-react";
import React from "react";

export const BoxError = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        border: "1px solid #BBBEC5",
        padding: "32px",
        borderRadius: "12px",
        gap: "20px",
      }}
    >
      <Icon $h="40px" $name="warningAmber" $w="40px" title="warningAmber" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <Enfasis justify="start" color="#6B7280">
          ¡Ups! datos no encontrados
        </Enfasis>
        <ParagraphNormal>
          Ha ocurrido un error, inténtalo más tarde
        </ParagraphNormal>
      </div>
    </div>
  );
};
