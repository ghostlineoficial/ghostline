import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'Rota de cálculo do Melhor Envio ativa.',
  });
}