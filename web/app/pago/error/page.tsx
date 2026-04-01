import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Error de pago · VocTest IA' };

export default async function PagoErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <XCircle className="w-9 h-9 text-red-500" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">No se pudo procesar el pago</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Podés intentarlo de nuevo. Tu progreso está guardado.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full rounded-full bg-brand-600 hover:bg-brand-700">
            <Link href="/#chat-section">Intentar de nuevo</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
