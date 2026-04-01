import type { ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';


export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-8 px-6" style={{ borderTop: '1px solid rgba(79,70,229,0.08)' }}>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-headline font-extrabold tracking-tight text-on-background text-lg">LumIA</p>
          <div className="flex gap-8">
            {(['Términos', 'Privacidad'] as const).map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-on-surface-variant text-xs font-medium uppercase tracking-wide hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="mailto:hola@goodapps.space"
              className="text-on-surface-variant text-xs font-medium uppercase tracking-wide hover:text-primary transition-colors"
            >
              Contacto
            </Link>
          </div>
          <p className="text-xs text-on-surface-variant/70">
            © {new Date().getFullYear()} LumIA · Powered by GoodApps
          </p>
        </div>
      </footer>
    </div>
  );
}
