'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useChatStore } from '@/features/chat/store/chat.store';
import { ResultsDashboard } from '@/features/chat/components/ResultsDashboard';
import { Button } from '@/components/ui/button';

export function DashboardClient() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const { user } = useAuth();
  const { result, resetSession } = useChatStore();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-brand-700 text-lg">Mi Dashboard</h1>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground">{user.email}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                logout();
                router.replace('/login');
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {result ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tu informe vocacional</h2>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={resetSession}
              >
                Nuevo test
              </Button>
            </div>
            <ResultsDashboard result={result} />
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-brand-600">V</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Aún no tenés resultados</h2>
            <p className="text-sm text-muted-foreground">
              Completá el test vocacional para ver tu informe aquí.
            </p>
            <Button
              className="rounded-full bg-brand-600 hover:bg-brand-700"
              onClick={() => router.push('/#chat-section')}
            >
              Iniciar test
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
