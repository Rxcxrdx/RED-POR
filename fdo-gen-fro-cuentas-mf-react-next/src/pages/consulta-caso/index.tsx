import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

import { ConsultCases } from "@/components";

export default function ConsultCasesMain() {
  return (
    <MantineProvider>
      <ConsultCases />
    </MantineProvider>
  );
}
