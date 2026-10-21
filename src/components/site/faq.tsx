import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./reveal";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  className?: string;
}

/** Accordéon de questions fréquentes en capsules de verre fumé. */
export function Faq({ items, className }: FaqProps) {
  return (
    <Reveal className={className}>
      <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
        {items.map((item, i) => (
          <AccordionItem
            key={item.question}
            value={`item-${i}`}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 transition-colors duration-200 hover:border-white/[0.15] data-[state=open]:border-white/[0.18] data-[state=open]:bg-white/[0.045]"
          >
            <AccordionTrigger className="py-5 text-left font-display text-[15px] font-semibold tracking-tight hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[14px] leading-[1.7] text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}
