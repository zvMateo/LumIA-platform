'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../constants/landing.constants';

const AVATAR_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'bg-violet-100', text: 'text-violet-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
];

export function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-headline text-4xl font-extrabold tracking-tight text-on-background text-center mb-16"
          style={{ letterSpacing: '-0.03em' }}
        >
          Historias que inspiran
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="p-8 rounded-2xl bg-surface">
              {/* Stars */}
              <div className="flex gap-1 text-amber-400 mb-6">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-on-surface-variant italic leading-relaxed mb-8">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length].bg} ${AVATAR_COLORS[i % AVATAR_COLORS.length].text}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.career}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
