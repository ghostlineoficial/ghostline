'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'register'>(
    'login',
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Digite seu e-mail.');
      return;
    }

    if (!password) {
      setError('Digite sua senha.');
      return;
    }

    if (password.length < 6) {
      setError(
        'A senha precisa ter pelo menos 6 caracteres.',
      );
      return;
    }

    if (
      mode === 'register' &&
      password !== confirmPassword
    ) {
      setError('As senhas não são iguais.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
          });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          router.push('/shop');
          router.refresh();
          return;
        }

        setMessage(
          'Conta criada. Confira seu e-mail para confirmar o cadastro.',
        );

        return;
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(
          'E-mail ou senha incorretos.',
        );
        return;
      }

      router.push('/shop');
      router.refresh();
    } catch {
      setError(
        'Não foi possível concluir a operação. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/shop`,
          },
        });

      if (googleError) {
        setError(googleError.message);
        setLoading(false);
      }
    } catch {
      setError(
        'Não foi possível entrar com Google.',
      );
      setLoading(false);
    }
  }

  function changeMode(
    newMode: 'login' | 'register',
  ) {
    setMode(newMode);
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <Section>
      <Container size="sm">
        <SectionTitle
          eyebrow="Conta"
          title={
            mode === 'login'
              ? 'Entrar'
              : 'Criar conta'
          }
          className="mb-8"
        />

        <div className="mb-6 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={
              mode === 'login'
                ? 'primary'
                : 'outline'
            }
            onClick={() =>
              changeMode('login')
            }
          >
            Entrar
          </Button>

          <Button
            type="button"
            variant={
              mode === 'register'
                ? 'primary'
                : 'outline'
            }
            onClick={() =>
              changeMode('register')
            }
          >
            Criar conta
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete={
              mode === 'login'
                ? 'current-password'
                : 'new-password'
            }
            disabled={loading}
          />

          {mode === 'register' && (
            <Input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              autoComplete="new-password"
              disabled={loading}
            />
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Criar minha conta'}
          </Button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs uppercase text-muted">
              ou
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continuar com Google
          </Button>
        </form>
      </Container>
    </Section>
  );
}