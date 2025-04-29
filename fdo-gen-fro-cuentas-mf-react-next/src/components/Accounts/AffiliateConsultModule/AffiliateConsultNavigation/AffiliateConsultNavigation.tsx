import React, { useEffect, useContext } from "react";
import { AffiliateAccountProvider, AffiliateAccountContext } from "@/context";
import { AffiliateConsultForm, AffiliateConsultResponse } from "@/components";
import {
  Icon,
  Button,
  Breadcrumb,
  ParagraphSmall,
} from "pendig-fro-transversal-lib-react";
import { ConsultResult } from "../../AffiliateConsultModule/ConsultResult/ConsultResult";
import { ReportDownloadList } from "@/components/SharedComponent/ReportDownloadPopover";

type ViewId = "affiliate" | "affiliateResponse" | "affiliateResponseAccounts";
type Views = {
  [key in ViewId]: {
    id: string;
    component: React.ReactNode;
    label: string;
  };
};

type BreadcrumbItemType = {
  $label: string;
  $icon:
    | "pause"
    | "search"
    | "img"
    | "svg"
    | "warningAmber"
    | "arrowDropDown"
    | "keyBoardArrowDown"
    | "groupAdd"
    | "moreHoriz"
    | "home"
    | "lan"
    | "logout"
    | "info"
    | "slashBold"
    | "calendarToday"
    | undefined;
  onClick: () => void;
  $id?: string;
};

const AffiliateConsultNavigation = () => {
  return (
    <AffiliateAccountProvider>
      <NavigationManager />
    </AffiliateAccountProvider>
  );
};

const NavigationManager = () => {
  const {
    userDetail,
    currentView,
    setCurrentView,
    completedViews,
    setCompletedViews,
    handleFilterReset,
  } = useContext(AffiliateAccountContext);

  const views: Views = {
    affiliate: {
      id: "affiliate",
      component: <AffiliateConsultForm />,
      label: "Consulta de afiliado",
    },
    affiliateResponse: {
      id: "affiliateResponse",
      component: <AffiliateConsultResponse />,
      label: "Resultado de consulta",
    },
    affiliateResponseAccounts: {
      id: "affiliateResponseAccounts",
      component: <ConsultResult />,
      label: "Cuenta Ley 2381",
    },
  };

  useEffect(() => {
    if (userDetail && currentView === "affiliate") {
      if (!completedViews.includes("affiliateResponse")) {
        setCompletedViews((prev) => [...prev, "affiliateResponse"]);
      }
      setCurrentView("affiliateResponse");
    }
  }, [
    userDetail,
    currentView,
    completedViews,
    setCurrentView,
    setCompletedViews,
  ]);

  const generateBreadcrumbItems = (): BreadcrumbItemType[] => {
    const items: BreadcrumbItemType[] = [
      {
        $label: "Home",
        $icon: "home",
        onClick: () => {},
      },
    ];

    const viewFlow: ViewId[] = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];

    viewFlow.forEach((viewId) => {
      if (completedViews.includes(viewId) || viewId === currentView) {
        items.push({
          $label: views[viewId].label,
          $icon: undefined,
          $id: viewId,
          onClick: () => handleBreadcrumbClick(viewId),
        });
      }
    });

    return items;
  };

  const handleBreadcrumbClick = (viewId: ViewId) => {
    if (completedViews.includes(viewId)) {
      if (viewId === "affiliate") {
        resetNavigation();
      } else {
        setCurrentView(viewId);
      }
    }
  };

  const resetNavigation = () => {
    if (handleFilterReset) {
      handleFilterReset();
    }

    setCompletedViews(["affiliate"]);

    setCurrentView("affiliate");
  };

  const goToNextView = () => {
    const viewFlow: ViewId[] = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];
    const currentIndex = viewFlow.indexOf(currentView as ViewId);

    if (currentIndex < viewFlow.length - 1) {
      const nextViewId = viewFlow[currentIndex + 1];

      if (!completedViews.includes(nextViewId)) {
        setCompletedViews((prev) => [...prev, nextViewId]);
      }

      setCurrentView(nextViewId);
    }
  };

  const goToPreviousView = () => {
    const viewFlow: ViewId[] = [
      "affiliate",
      "affiliateResponse",
      "affiliateResponseAccounts",
    ];
    const currentIndex = viewFlow.indexOf(currentView as ViewId);

    if (currentIndex > 0) {
      const previousViewId = viewFlow[currentIndex - 1];

      if (previousViewId === "affiliate") {
        resetNavigation();
      } else {
        setCurrentView(previousViewId);
      }
    }
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#fb6903",
    color: "white",
    marginLeft: "10px",
  };

  return (
    <div
      style={{
        width: "auto",
        padding: "26px 40px",
        backgroundColor: "#F0F1F2",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "self-start",
            gap: "16px",
          }}
        >
          {currentView !== "affiliate" && (
            <div
              onClick={goToPreviousView}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                marginRight: "24px",
                cursor: "pointer",
                userSelect: "none",
              }}
              role="button"
              tabIndex={0}
              aria-label="Volver a la vista anterior"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToPreviousView();
                }
              }}
            >
              <Icon
                $h="16px"
                $name="keyboardArrowLeft"
                $w="16px"
                title="keyboardArrowLeft"
              />

              <ParagraphSmall>Volver</ParagraphSmall>
            </div>
          )}

          <Breadcrumb
            $items={generateBreadcrumbItems()}
            $typeContainer="base"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
          }}
        >
          {currentView !== "affiliate" && (
            <Button $type="outline" $size="small" onClick={resetNavigation}>
              Nueva Consulta
            </Button>
          )}
          {currentView !== "affiliate" && userDetail && (
            <AffiliateAccountProvider>
              <ReportDownloadList userDetail={userDetail} />
            </AffiliateAccountProvider>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        {views[currentView as ViewId]?.component}

        {/* <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {currentView === "affiliate" && (
            <button onClick={goToNextView} style={primaryButtonStyle}>
              Continuar a resultados
            </button>
          )}
          {currentView === "affiliateResponse" && (
            <button onClick={goToNextView} style={primaryButtonStyle}>
              Continuar a detalle
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export { AffiliateConsultNavigation };
