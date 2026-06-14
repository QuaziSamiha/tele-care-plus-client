import { MaintenanceError } from "@/components/Error";

export const metadata = { title: "503 — Under Maintenance" };

export default function MaintenancePage() {
  return <MaintenanceError />;
}
