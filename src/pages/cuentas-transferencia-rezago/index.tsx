import { MantineProvider } from "@mantine/core";
import { TransferSuspenseView } from "@/components";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

export default function TransferSuspenseAccountPage() {
  return (
    <MantineProvider>
      <TransferSuspenseView />
    </MantineProvider>
  );
}
