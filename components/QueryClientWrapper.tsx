// components/QueryClientWrapper.tsx
"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
};

export default QueryClientWrapper;
