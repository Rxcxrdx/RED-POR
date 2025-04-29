import { SuspenseView } from "../../components/Suspenses/SuspenseConsult/SuspenseConsultView";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.layer.css';

export default function Rezagos() {
  
  return (
    <MantineProvider>
      <SuspenseView/>
    </MantineProvider>
  );
}