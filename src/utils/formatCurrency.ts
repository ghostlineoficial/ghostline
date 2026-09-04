/**
 * Formata um valor em centavos (inteiro, vindo do banco) para BRL exibível.
 * Guardar preços como inteiros (centavos) evita erros de ponto flutuante.
 */
export function formatCurrency(valueInCents: number): string {
  return (valueInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
