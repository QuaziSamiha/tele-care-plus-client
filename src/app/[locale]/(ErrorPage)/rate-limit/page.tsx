import { RateLimitError } from "@/components/Error";

export const metadata = { title: "429 — Too Many Requests" };

export default function RateLimitPage() {
  return <RateLimitError />;
}
