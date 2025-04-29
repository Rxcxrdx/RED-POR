import React from "react";
import { Spinner } from "pendig-fro-transversal-lib-react";
import { SpinnerProps } from "pendig-fro-transversal-lib-react/dist/components/Spinner/ISpinner";

export const Loader = ({
  isLoading,
  ...props
}: { isLoading: boolean } & SpinnerProps) => {
  return (
    <>
      {isLoading && (
        <Spinner
          $variant="fullScreen"
          $message="Cargando información..."
          $hContainer="180px"
          $wContainer="282px"
          {...props}
        />
      )}
    </>
  );
};
