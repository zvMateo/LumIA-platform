'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function StickyTestCTA() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }, // account for sticky navbar height
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Invisible sentinel placed right after the hero section */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Floating pill */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToChat}
          className="flex items-center gap-2 text-white px-6 py-3.5 rounded-full text-sm font-bold shadow-2xl shadow-indigo-500/30 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}
        >
          <Sparkles className="w-4 h-4" />
          Empezar el test gratis
        </button>
      </div>
    </>
  );
}
