'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NewsletterProps {
  onSubmit?: (email: string) => Promise<void> | void;
  title?: string;
  description?: string;
}

/**
 * Newsletter — componente de UI puro: recebe onSubmit e cuida só do
 * estado local (loading/sucesso/erro). A chamada real ao backend
 * (Supabase, serviço de e-mail, etc.) é responsabilidade de quem usa.
 */
export function Newsletter({
  onSubmit,
  title = 'Fique por dentro dos próximos drops',
  description,
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="text-center">
      <p className="text-h3 uppercase text-foreground">{title}</p>
      {description && <p className="mt-2 text-body-sm text-muted">{description}</p>}

      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-3">
        <Input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" loading={status === 'loading'}>
          Inscrever
        </Button>
      </form>

      {status === 'success' && (
        <p className="mt-3 text-body-sm text-success">Inscrição confirmada.</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-body-sm text-danger">Não deu certo, tenta de novo.</p>
      )}
    </div>
  );
}
