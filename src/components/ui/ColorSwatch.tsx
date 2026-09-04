import { cn } from '@/utils/cn';

interface ColorSwatchProps {
  color: string;
  hex?: string; // se não vier, cai no fallback COLOR_HEX abaixo
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// Fallback pras 3 cores atuais do catálogo (ver CATALOG.md — "Cores").
// Arquitetura preparada pra novas cores: basta adicionar a entrada aqui
// ou passar `hex` diretamente via prop quando o banco tiver a coluna.
const COLOR_HEX: Record<string, string> = {
  Preta: '#111111',
  Branca: '#F5F5F5',
  Cinza: '#8A8AA8',
};

/** ColorSwatch — círculo de cor selecionável. Reutilizável em qualquer seletor de cor (produto, Ghost Studio). */
export function ColorSwatch({ color, hex, active, disabled, onClick }: ColorSwatchProps) {
  const swatchHex = hex ?? COLOR_HEX[color] ?? '#8A8AA8';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={color}
      aria-pressed={active}
      title={disabled ? `${color} — indisponível` : color}
      className={cn(
        'relative h-9 w-9 rounded-full border-2 transition-all',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active ? 'border-primary' : 'border-transparent hover:border-white/20',
        disabled && 'opacity-30 pointer-events-none',
      )}
    >
      <span
        className="absolute inset-1 rounded-full border border-white/10"
        style={{ backgroundColor: swatchHex }}
      />
    </button>
  );
}
