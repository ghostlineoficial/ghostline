'use client';

import * as RadixToast from '@radix-ui/react-toast';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';
import { cn } from '@/utils/cn';

type ToastTone = 'success' | 'warning' | 'danger' | 'info';

interface ToastState {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastStore {
  toasts: ToastState[];
  push: (toast: Omit<ToastState, 'id'>) => void;
  remove: (id: number) => void;
}

let counter = 0;

/** Store global de toasts. Chame useToast().push({...}) de qualquer Client Component. */
export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: counter++ }] })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const toneIcon: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

const toneColor: Record<ToastTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-primary',
};

/** Renderizar uma vez no layout raiz, dentro do <body>. */
export function Toaster() {
  const { toasts, remove } = useToast();

  return (
    <RadixToast.Provider swipeDirection="right" duration={4000}>
      {toasts.map((toast) => {
        const Icon = toneIcon[toast.tone];
        return (
          <RadixToast.Root
            key={toast.id}
            onOpenChange={(open) => !open && remove(toast.id)}
            className={cn(
              'flex items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-lg',
              'data-[state=open]:animate-slide-in data-[swipe=end]:animate-fade-in',
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', toneColor[toast.tone])} />
            <div className="flex-1">
              <RadixToast.Title className="text-body-sm text-foreground">
                {toast.title}
              </RadixToast.Title>
              {toast.description && (
                <RadixToast.Description className="mt-1 text-caption text-muted">
                  {toast.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close aria-label="Fechar" className="text-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </RadixToast.Close>
          </RadixToast.Root>
        );
      })}
      <RadixToast.Viewport className="fixed bottom-6 right-6 z-[100] flex w-96 max-w-[92vw] flex-col gap-3" />
    </RadixToast.Provider>
  );
}
