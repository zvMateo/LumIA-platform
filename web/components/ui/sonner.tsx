'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'font-sans text-sm',
          title: 'font-semibold',
          description: 'text-muted-foreground text-xs',
        },
      }}
      {...props}
    />
  );
}
