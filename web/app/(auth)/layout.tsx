import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(53,37,205,0.05)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(113,42,226,0.05)' }} />

      <main className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-2 font-headline font-extrabold tracking-tight text-on-background text-2xl">
            <Sparkles className="w-5 h-5 text-primary fill-primary" />
            LumIA
          </Link>
        </div>

        {children}

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-6">
          {['Privacidad', 'Términos', 'Ayuda'].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
