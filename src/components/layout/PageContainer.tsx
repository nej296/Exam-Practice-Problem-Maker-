import type { ReactNode } from 'react';

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full animate-fade-in">
      {children}
    </main>
  );
}
