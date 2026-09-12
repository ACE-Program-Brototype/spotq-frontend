import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          (error as { response?: { status?: number } }).response
        ) {
          const status = (error as { response: { status: number } }).response.status;
          if (status === 401 || status === 403 || status === 404 || status === 422) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});

type QueryProviderProps = {
  children: ReactNode;
};

function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
