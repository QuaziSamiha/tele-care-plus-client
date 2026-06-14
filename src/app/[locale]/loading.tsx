import LoadingPage from "@/components/shared/loading/LoadingPage";

export default function Loading() {
  return <LoadingPage />;
}
/**
 * Ensure your LoadingPage is a lightweight component (like a simple CSS spinner or a skeleton screen).
 * If the LoadingPage itself is heavy, it defeats the purpose of the dynamic import.
 */
