import { DepositAccountTransferView } from "@/components";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

export default function DepositAccountTransferMain() {
  return (
    <MantineProvider>
      <DepositAccountTransferView />
    </MantineProvider>
  );
}
