import { NextRequest, NextResponse } from 'next/server';

const MELHOR_ENVIO_TOKEN_URL =
  'https://sandbox.melhorenvio.com.br/oauth/token';

const REDIRECT_URI =
  'https://ghostline-woad.vercel.app/api/melhor-envio/callback';

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

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Credenciais do Melhor Envio não configuradas.' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(MELHOR_ENVIO_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'GHOSTLINE (ghostlinestoreoficial@gmail.com)',
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

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro OAuth Melhor Envio:', data);

      return NextResponse.json(
        {
          error: 'Não foi possível concluir a autorização do Melhor Envio.',
          details: data,
        },
        { status: response.status },
      );
    }

    /*
     * Por enquanto mostramos apenas a confirmação.
     * NUNCA retornamos access_token ou refresh_token para o navegador.
     *
     * No próximo passo vamos armazenar essas credenciais de forma segura
     * no servidor.
     */
    console.log('Melhor Envio autorizado com sucesso.');

    return NextResponse.redirect(
      new URL('/?melhor-envio=autorizado', request.url),
    );
  } catch (error) {
    console.error('Erro ao conectar ao Melhor Envio:', error);

    return NextResponse.json(
      { error: 'Erro interno ao conectar com o Melhor Envio.' },
      { status: 500 },
    );
  }
}