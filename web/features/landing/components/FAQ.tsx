'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ_ITEMS } from '../constants/landing.constants';

export function FAQ() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-headline text-4xl font-extrabold tracking-tight text-on-background text-center mb-16"
          style={{ letterSpacing: '-0.03em' }}
        >
          Preguntas frecuentes
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-surface rounded-2xl px-6 data-[state=open]:bg-surface-container-lowest data-[state=open]:shadow-lg data-[state=open]:shadow-indigo-500/5"
            >
              <AccordionTrigger className="font-bold text-on-surface hover:text-primary hover:no-underline py-5 text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-on-surface-variant pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
