"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Criando uma instância do QueryClient
const queryClient = new QueryClient();

export default function QueryClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
