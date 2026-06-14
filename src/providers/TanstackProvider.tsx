export default function TanstackProvider() {
  return <div></div>;
}

// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { ReactNode, useState } from "react";

// export default function TanstackProvider({ children }: { children: ReactNode }) {
//   // Use useState with a factory function to ensure a single instance
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             // With Next.js, it's often better to set a staleTime
//             // to avoid immediate refetching on the client.
//             staleTime: 60 * 1000,
//             refetchOnWindowFocus: false, // Prevents spamming your API while switching tabs
//             retry: 1, // Number of retries on failure
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       {/* Devtools are automatically excluded from production builds */}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }
