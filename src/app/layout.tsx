import type { ReactNode } from 'react';
import '@/styles/globals.css';

// The real <html lang> is set per-locale in src/app/[locale]/layout.tsx; this
// root layout only exists to satisfy the App Router's structure.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
