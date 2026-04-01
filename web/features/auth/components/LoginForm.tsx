'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    await login.mutateAsync(data);
    router.push('/dashboard');
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-8 md:p-10" style={{ border: '1px solid rgba(199,196,216,0.1)' }}>
      <header className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2" style={{ letterSpacing: '-0.03em' }}>
          Bienvenido de vuelta
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Continuá tu camino hacia el éxito con LumIA.
        </p>
      </header>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: '1px solid rgba(199,196,216,0.2)' }} />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface-container-lowest px-4 text-on-surface-variant font-medium tracking-wide uppercase">
            Ingresá con tu email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="vos@ejemplo.com"
            className="w-full px-5 py-4 bg-surface-container-low rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label htmlFor="password" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Contraseña
            </label>
            <button type="button" className="text-xs font-bold text-primary hover:text-[#5a40e8] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-surface-container-low rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 hover:text-on-surface transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {login.error && (
          <p className="text-sm text-red-500 text-center">Credenciales incorrectas. Intentá de nuevo.</p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting || login.isPending}
            className="w-full py-4 px-6 rounded-full text-white font-bold text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}
          >
            {login.isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant">
          ¿No tenés cuenta?{' '}
          <a href="/registro" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1">
            Registrate gratis
          </a>
        </p>
      </footer>
    </div>
  );
}
