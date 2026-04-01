import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Pago exitoso · VocTest IA' };

export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}) {
  const params = await searchParams;
  const paymentId = params.payment_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">¡Pago aprobado!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tu test completo está desbloqueado.
          </p>
          {paymentId && (
            <p className="text-xs text-muted-foreground mt-1">Ref: {paymentId}</p>
          )}
        </div>

        <Button asChild className="w-full rounded-full bg-brand-600 hover:bg-brand-700">
          <Link href="/#chat-section">Continuar el test</Link>
        </Button>
      </div>
    </div>
  );
}
