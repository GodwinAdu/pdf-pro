"use client";

import { trpc } from "@/app/(eduxcel)/_trpc/client";
import { absoluteUrl } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";


const Provider = ({ children }: PropsWithChildren) => {
  let [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl("/api/trpc"),
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Provider;
