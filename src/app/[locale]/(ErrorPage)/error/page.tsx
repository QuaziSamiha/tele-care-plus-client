import { ServerError } from "@/components/Error";

export const metadata = { title: "500 — Server Error" };

export default function ServerErrorPage() {
  return <ServerError />;
}
