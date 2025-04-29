import { AffiliateConsultNavigation } from "@/components";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

export default function ConsultaAfiliadoMain() {
  return (
    <MantineProvider>
      <AffiliateConsultNavigation />
    </MantineProvider>
  );
}
