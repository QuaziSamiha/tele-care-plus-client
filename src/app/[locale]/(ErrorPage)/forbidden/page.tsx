import { Forbidden } from "@/components/Error";

export const metadata = { title: "403 — Access Forbidden" };

export default function ForbiddenPage() {
  return <Forbidden />;
}
