'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { type ReactNode } from 'react';

export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
}

export function Accordion({ items, type = 'single' }: AccordionProps) {
  const rootProps =
    type === 'single' ? { type: 'single' as const, collapsible: true } : { type: 'multiple' as const };

  return (
    <RadixAccordion.Root {...rootProps} className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <RadixAccordion.Item key={item.value} value={item.value}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between py-5 text-left text-body text-foreground outline-none">
              {item.title}
              <ChevronDown className="h-4 w-4 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden text-body-sm text-muted data-[state=open]:animate-fade-in">
            <div className="pb-5">{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
