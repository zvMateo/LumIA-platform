import { Users, Clock, Brain, Mail, LockOpen } from 'lucide-react';

const ITEMS = [
  { icon: Users,    stat: '+2.400', label: 'Estudiantes' },
  { icon: Clock,    stat: '15 min', label: 'Duración' },
  { icon: Brain,    stat: 'RIASEC', label: 'Código Holland' },
  { icon: Mail,     stat: 'PDF',    label: 'Informe por email' },
  { icon: LockOpen, stat: 'Gratis', label: 'Sin registro' },
];

export function TrustBar() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {ITEMS.map(({ icon: Icon, stat, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-indigo-600 shrink-0" />
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">{stat}</span>
              <span className="text-xs text-on-surface-variant/60">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
