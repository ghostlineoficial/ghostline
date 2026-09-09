import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MELHOR_ENVIO_TOKEN_URL =
  'https://sandbox.melhorenvio.com.br/oauth/token';

const REDIRECT_URI =
  'https://ghostline-woad.vercel.app/api/melhor-envio/callback';

type MelhorEnvioTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Código de autorização não recebido.' },
      { status: 400 },
    );
  }

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Credenciais do Melhor Envio não configuradas.' },
      { status: 500 },
    );
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: 'Credenciais do Supabase não configuradas.' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(MELHOR_ENVIO_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent':
          'GHOSTLINE (ghostlinestoreoficial@gmail.com)',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      cache: 'no-store',
    });

    const data = (await response.json()) as
      | MelhorEnvioTokenResponse
      | Record<string, unknown>;

    if (!response.ok) {
      console.error(
        'Erro OAuth Melhor Envio. Status:',
        response.status,
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível concluir a autorização do Melhor Envio.',
        },
        { status: response.status },
      );
    }

    if (
      !('access_token' in data) ||
      !('refresh_token' in data) ||
      !('expires_in' in data) ||
      typeof data.access_token !== 'string' ||
      typeof data.refresh_token !== 'string' ||
      typeof data.expires_in !== 'number'
    ) {
      console.error(
        'Resposta inválida recebida do OAuth do Melhor Envio.',
      );

      return NextResponse.json(
        {
          error:
            'O Melhor Envio não retornou as credenciais esperadas.',
        },
        { status: 502 },
      );
    }

    const expiresAt = new Date(
      Date.now() + data.expires_in * 1000,
    ).toISOString();

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    /*
     * Mantemos somente uma credencial ativa do Melhor Envio.
     * A tabela possui RLS e não possui políticas públicas.
     */
    const { error: deleteError } = await supabaseAdmin
      .from('melhor_envio_credentials')
      .delete()
      .not('id', 'is', null);

    if (deleteError) {
      console.error(
        'Erro ao substituir credencial antiga do Melhor Envio:',
        deleteError.message,
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível preparar o armazenamento das credenciais.',
        },
        { status: 500 },
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from('melhor_envio_credentials')
      .insert({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type:
          'token_type' in data &&
          typeof data.token_type === 'string'
            ? data.token_type
            : 'Bearer',
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error(
        'Erro ao salvar credenciais do Melhor Envio:',
        insertError.message,
      );

      return NextResponse.json(
        {
          error:
            'A autorização funcionou, mas não foi possível salvar as credenciais.',
        },
        { status: 500 },
      );
    }

    console.log(
      'Melhor Envio autorizado e credenciais armazenadas com sucesso.',
    );

    return NextResponse.redirect(
      new URL(
        '/?melhor-envio=autorizado',
        request.url,
      ),
    );
  } catch (error) {
    console.error(
      'Erro ao conectar ao Melhor Envio:',
      error instanceof Error ? error.message : 'Erro desconhecido',
    );

    return NextResponse.json(
      {
        error:
          'Erro interno ao conectar com o Melhor Envio.',
      },
      { status: 500 },
    );
  }
}