'use client';

import {
  ChangeEvent,
  PointerEvent,
  useRef,
  useState,
} from 'react';

import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

type PrintSide = 'front' | 'back';
type ShirtSize = 'M' | 'G' | 'GG' | 'XGG';

interface CustomArt {
  url: string | null;
  size: number;
  x: number;
  y: number;
}

const BASE_PRICE = 89.99;

const MIN_PRINT_SIZE = 10;
const MAX_PRINT_SIZE = 60;

const SHIRT_SIZES: ShirtSize[] = [
  'M',
  'G',
  'GG',
  'XGG',
];

const INITIAL_ART: CustomArt = {
  url: null,
  size: 10,
  x: 50,
  y: 46,
};

/*
 * PRIMEIRA ESTAMPA
 *
 * Até 10 cm já está incluído
 * no valor inicial de R$ 89,99.
 *
 * 10 cm = incluído
 * 20 cm = + R$ 10
 * 30 cm = + R$ 20
 * 40 cm = + R$ 30
 * 50 cm = + R$ 40
 * 60 cm = + R$ 50
 */
function calculatePrimaryPrintExtra(
  size: number,
) {
  if (size <= 10) {
    return 0;
  }

  return (
    Math.ceil((size - 10) / 10) * 10
  );
}

/*
 * SEGUNDA ESTAMPA
 *
 * Quando o cliente já possui uma
 * estampa e adiciona outra no lado
 * oposto, ela é cobrada separadamente.
 *
 * 10 cm = + R$ 10
 * 20 cm = + R$ 20
 * 30 cm = + R$ 30
 * 40 cm = + R$ 40
 * 50 cm = + R$ 50
 * 60 cm = + R$ 60
 */
function calculateSecondPrintExtra(
  size: number,
) {
  return Math.ceil(size / 10) * 10;
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

export default function GhostStudioPage() {
  const [side, setSide] =
    useState<PrintSide>('front');

  const [shirtSize, setShirtSize] =
    useState<ShirtSize | null>(null);

  const [message, setMessage] =
    useState('');

  const [frontArt, setFrontArt] =
    useState<CustomArt>({
      ...INITIAL_ART,
    });

  const [backArt, setBackArt] =
    useState<CustomArt>({
      ...INITIAL_ART,
    });

  const printAreaRef =
    useRef<HTMLDivElement | null>(null);

  const draggingRef = useRef(false);

  const currentArt =
    side === 'front'
      ? frontArt
      : backArt;

  const hasFrontArt =
    Boolean(frontArt.url);

  const hasBackArt =
    Boolean(backArt.url);

  const hasAnyArt =
    hasFrontArt || hasBackArt;

  /*
   * ==========================================
   * CÁLCULO DO PREÇO
   * ==========================================
   */

  let totalPrice = BASE_PRICE;

  /*
   * Somente frente.
   */
  if (hasFrontArt && !hasBackArt) {
    totalPrice +=
      calculatePrimaryPrintExtra(
        frontArt.size,
      );
  }

  /*
   * Somente costas.
   */
  if (!hasFrontArt && hasBackArt) {
    totalPrice +=
      calculatePrimaryPrintExtra(
        backArt.size,
      );
  }

  /*
   * Frente + costas.
   *
   * A frente utiliza a regra da primeira
   * estampa e as costas são cobradas
   * como segunda estampa.
   */
  if (hasFrontArt && hasBackArt) {
    totalPrice +=
      calculatePrimaryPrintExtra(
        frontArt.size,
      );

    totalPrice +=
      calculateSecondPrintExtra(
        backArt.size,
      );
  }

  /*
   * ==========================================
   * ATUALIZAR ARTE ATUAL
   * ==========================================
   */

  function updateCurrentArt(
    changes: Partial<CustomArt>,
  ) {
    if (side === 'front') {
      setFrontArt((previous) => ({
        ...previous,
        ...changes,
      }));
    } else {
      setBackArt((previous) => ({
        ...previous,
        ...changes,
      }));
    }
  }

  /*
   * ==========================================
   * UPLOAD DA ARTE
   * ==========================================
   */

  function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (currentArt.url) {
      URL.revokeObjectURL(
        currentArt.url,
      );
    }

    const url =
      URL.createObjectURL(file);

    updateCurrentArt({
      url,
      x: 50,
      y: 46,
    });

    /*
     * Permite selecionar novamente
     * o mesmo arquivo.
     */
    event.target.value = '';
  }

  /*
   * ==========================================
   * REMOVER ARTE
   * ==========================================
   */

  function removeCurrentArt() {
    if (currentArt.url) {
      URL.revokeObjectURL(
        currentArt.url,
      );
    }

    updateCurrentArt({
      ...INITIAL_ART,
    });
  }

  /*
   * ==========================================
   * TAMANHO DA ESTAMPA
   * ==========================================
   */

  function changePrintSize(
    size: number,
  ) {
    updateCurrentArt({
      size,
    });
  }

  /*
   * ==========================================
   * MOVIMENTAÇÃO DA ARTE
   * ==========================================
   */

  function moveArtFromPointer(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (
      !draggingRef.current ||
      !printAreaRef.current ||
      !currentArt.url
    ) {
      return;
    }

    const rect =
      printAreaRef.current.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    updateCurrentArt({
      x: clamp(x, 12, 88),
      y: clamp(y, 12, 88),
    });
  }

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (!currentArt.url) {
      return;
    }

    draggingRef.current = true;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    moveArtFromPointer(event);
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>,
  ) {
    moveArtFromPointer(event);
  }

  function handlePointerUp(
    event: PointerEvent<HTMLDivElement>,
  ) {
    draggingRef.current = false;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }
  }

  /*
   * ==========================================
   * CENTRALIZAR ARTE
   * ==========================================
   */

  function resetArtPosition() {
    updateCurrentArt({
      x: 50,
      y: 46,
    });
  }

  /*
   * ==========================================
   * MOVIMENTAÇÃO PELOS BOTÕES
   * ==========================================
   */

  function nudgeArt(
    xChange: number,
    yChange: number,
  ) {
    updateCurrentArt({
      x: clamp(
        currentArt.x + xChange,
        12,
        88,
      ),

      y: clamp(
        currentArt.y + yChange,
        12,
        88,
      ),
    });
  }

  /*
   * ==========================================
   * TAMANHO VISUAL DA ARTE
   * ==========================================
   *
   * O limite agora é 60 cm.
   */

  const visualArtSize = clamp(
    55 + currentArt.size * 4.2,
    95,
    310,
  );

  return (
    <Container>
      <div className="py-10">
        <SectionTitle
          eyebrow="Ghost Studio"
          title="Personalize sua peça"
        />

        <p className="mt-4 max-w-2xl text-body text-muted">
          Crie sua própria GHOSTLINE.
          Envie sua arte, escolha frente,
          costas ou os dois lados, ajuste
          o tamanho e posicione a estampa
          como desejar.
        </p>

        {/* ================================= */}
        {/* APRESENTAÇÃO — FAÇA VOCÊ MESMO */}
        {/* ================================= */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-black">
          <img
            src="/images/ghost-studio-banner.png"
            alt="Ghost Studio — Faça Você Mesmo"
            className="block h-auto w-full object-cover"
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* ================================= */}
          {/* ÁREA DO MOCKUP */}
          {/* ================================= */}

          <div className="relative flex min-h-[680px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-6">

            {/*
             * CAMISETA OVERSIZED 30.1
             *
             * Aumentada para ocupar melhor
             * a área do personalizador.
             */}

            <div className="relative h-[620px] w-full max-w-[680px]">

              {/* MANGA ESQUERDA */}
              <div className="absolute left-[-2%] top-[105px] h-[220px] w-[215px] -rotate-[12deg] rounded-[32px] bg-[#080808]" />

              {/* MANGA DIREITA */}
              <div className="absolute right-[-2%] top-[105px] h-[220px] w-[215px] rotate-[12deg] rounded-[32px] bg-[#080808]" />

              {/* CORPO */}
              <div className="absolute bottom-[5px] left-1/2 h-[500px] w-[470px] max-w-[78%] -translate-x-1/2 rounded-b-[36px] bg-[#080808] shadow-2xl" />

              {/* OMBROS */}
              <div className="absolute left-1/2 top-[55px] h-[175px] w-[485px] max-w-[80%] -translate-x-1/2 rounded-t-[110px] bg-[#080808]" />

              {/* GOLA */}
              <div
                className={`absolute left-1/2 top-[55px] z-30 h-[68px] w-[110px] -translate-x-1/2 rounded-b-full border-[12px] border-[#181818] ${
                  side === 'front'
                    ? 'bg-card'
                    : 'bg-[#050505]'
                }`}
              />

              {/* ================================= */}
              {/* ÁREA DE IMPRESSÃO */}
              {/* ================================= */}

              <div
                ref={printAreaRef}
                onPointerDown={
                  handlePointerDown
                }
                onPointerMove={
                  handlePointerMove
                }
                onPointerUp={
                  handlePointerUp
                }
                onPointerCancel={
                  handlePointerUp
                }
                className={`absolute left-1/2 top-[145px] z-20 h-[405px] w-[325px] -translate-x-1/2 select-none ${
                  currentArt.url
                    ? 'cursor-grab active:cursor-grabbing'
                    : ''
                }`}
                style={{
                  touchAction: 'none',
                }}
              >
                {currentArt.url ? (
                  <img
                    src={currentArt.url}
                    alt={
                      side === 'front'
                        ? 'Arte personalizada da frente'
                        : 'Arte personalizada das costas'
                    }
                    draggable={false}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 object-contain"
                    style={{
                      left: `${currentArt.x}%`,
                      top: `${currentArt.y}%`,
                      width: `${visualArtSize}px`,
                      height: `${visualArtSize}px`,
                      maxWidth: '94%',
                      maxHeight: '94%',
                    }}
                  />
                ) : (
                  <div className="absolute left-1/2 top-[46%] w-[200px] -translate-x-1/2 -translate-y-1/2 border border-dashed border-white/20 px-4 py-14 text-center text-xs uppercase tracking-[0.2em] text-white/30">
                    {side === 'front'
                      ? 'Arte da frente'
                      : 'Arte das costas'}
                  </div>
                )}
              </div>
            </div>

            {/* LADO VISUALIZADO */}

            <div className="absolute bottom-6 left-6 rounded-full border border-border bg-background/80 px-4 py-2 text-xs uppercase tracking-wider text-muted backdrop-blur">
              {side === 'front'
                ? 'Frente'
                : 'Costas'}
            </div>

            {/* INSTRUÇÃO */}

            {currentArt.url && (
              <div className="absolute bottom-6 right-6 rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted backdrop-blur">
                Arraste a arte para posicionar
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* PAINEL DE PERSONALIZAÇÃO */}
          {/* ================================= */}

          <div className="space-y-7 rounded-2xl border border-border bg-surface p-6">

            {/* PRODUTO */}

            <div>
              <p className="text-h4">
                Personalização
              </p>

              <p className="mt-2 text-body-sm text-muted">
                Camiseta Oversized 30.1
                Preta
              </p>
            </div>

            {/* PREÇO */}

            <div className="border-y border-border py-5">
              <p className="text-xs uppercase tracking-wider text-muted">
                Valor atual
              </p>

              <p className="mt-2 text-3xl font-semibold text-foreground">
                {formatPrice(
                  totalPrice,
                )}
              </p>

              <p className="mt-2 text-xs text-muted">
                Frente e costas são
                calculadas separadamente.
              </p>
            </div>

            {/* ================================= */}
            {/* TAMANHO DA CAMISETA */}
            {/* ================================= */}

            <div>
              <p className="mb-3 text-sm font-medium">
                1. Tamanho da camiseta
              </p>

              <div className="grid grid-cols-4 gap-2">
                {SHIRT_SIZES.map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setShirtSize(
                          size,
                        )
                      }
                      className={`rounded-xl border px-2 py-3 text-sm font-medium transition ${
                        shirtSize ===
                        size
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* ================================= */}
            {/* FRENTE / COSTAS */}
            {/* ================================= */}

            <div>
              <p className="mb-3 text-sm font-medium">
                2. Escolha o lado
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSide('front')
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    side === 'front'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted hover:border-foreground'
                  }`}
                >
                  Frente
                  {hasFrontArt
                    ? ' ✓'
                    : ''}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSide('back')
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    side === 'back'
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted hover:border-foreground'
                  }`}
                >
                  Costas
                  {hasBackArt
                    ? ' ✓'
                    : ''}
                </button>
              </div>
            </div>

            {/* ================================= */}
            {/* UPLOAD */}
            {/* ================================= */}

            <div>
              <p className="mb-3 text-sm font-medium">
                3. Envie sua arte
              </p>

              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border px-4 py-6 text-center transition hover:border-foreground">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={
                    handleUpload
                  }
                />

                <span className="text-sm text-muted">
                  {currentArt.url
                    ? `Trocar arte ${
                        side ===
                        'front'
                          ? 'da frente'
                          : 'das costas'
                      }`
                    : 'Enviar PNG, JPG ou WEBP'}
                </span>
              </label>

              {currentArt.url && (
                <button
                  type="button"
                  onClick={
                    removeCurrentArt
                  }
                  className="mt-3 text-xs text-muted underline transition hover:text-foreground"
                >
                  Remover esta arte
                </button>
              )}
            </div>

            {/* ================================= */}
            {/* TAMANHO DA ESTAMPA */}
            {/* ================================= */}

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  4. Tamanho da estampa
                </p>

                <span className="shrink-0 text-sm font-semibold">
                  {currentArt.size} cm
                </span>
              </div>

              <input
                type="range"
                min={
                  MIN_PRINT_SIZE
                }
                max={
                  MAX_PRINT_SIZE
                }
                step={1}
                value={
                  currentArt.size
                }
                onChange={(event) =>
                  changePrintSize(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="w-full cursor-pointer accent-white"
              />

              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>10 cm</span>
                <span>60 cm</span>
              </div>

              <div className="mt-4 rounded-xl bg-card p-4 text-xs leading-relaxed text-muted">
                Até 10 cm está incluído
                no valor inicial da peça.
                Acima desse tamanho, o
                preço aumenta R$ 10,00
                por faixa de 10 cm.
              </div>
            </div>

            {/* ================================= */}
            {/* POSIÇÃO DA ESTAMPA */}
            {/* ================================= */}

            {currentArt.url && (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    5. Posição da estampa
                  </p>

                  <button
                    type="button"
                    onClick={
                      resetArtPosition
                    }
                    className="text-xs text-muted underline hover:text-foreground"
                  >
                    Centralizar
                  </button>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Arraste a arte
                  diretamente sobre a
                  camiseta ou use os
                  controles abaixo.
                </p>

                <div className="mx-auto mt-4 grid w-[150px] grid-cols-3 gap-2">
                  <div />

                  <button
                    type="button"
                    aria-label="Mover arte para cima"
                    onClick={() =>
                      nudgeArt(0, -3)
                    }
                    className="rounded-lg border border-border py-2 hover:border-foreground"
                  >
                    ↑
                  </button>

                  <div />

                  <button
                    type="button"
                    aria-label="Mover arte para esquerda"
                    onClick={() =>
                      nudgeArt(-3, 0)
                    }
                    className="rounded-lg border border-border py-2 hover:border-foreground"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    aria-label="Centralizar arte"
                    onClick={
                      resetArtPosition
                    }
                    className="rounded-lg border border-border py-2 text-xs hover:border-foreground"
                  >
                    •
                  </button>

                  <button
                    type="button"
                    aria-label="Mover arte para direita"
                    onClick={() =>
                      nudgeArt(3, 0)
                    }
                    className="rounded-lg border border-border py-2 hover:border-foreground"
                  >
                    →
                  </button>

                  <div />

                  <button
                    type="button"
                    aria-label="Mover arte para baixo"
                    onClick={() =>
                      nudgeArt(0, 3)
                    }
                    className="rounded-lg border border-border py-2 hover:border-foreground"
                  >
                    ↓
                  </button>

                  <div />
                </div>
              </div>
            )}

            {/* ================================= */}
            {/* MENSAGEM */}
            {/* ================================= */}

            <div>
              <p className="mb-3 text-sm font-medium">
                {currentArt.url
                  ? '6. Observações'
                  : '5. Observações'}
              </p>

              <Textarea
                label="Mensagem para a GHOSTLINE"
                placeholder="Ex.: Gostaria que a estampa ficasse um pouco mais próxima da gola..."
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                maxLength={500}
                rows={4}
                hint={`${message.length}/500 caracteres. Este campo é opcional.`}
              />
            </div>

            {/* ================================= */}
            {/* RESUMO */}
            {/* ================================= */}

            <div className="rounded-xl border border-border p-4">

              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Resumo do projeto
              </p>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  Peça
                </span>

                <span className="text-right">
                  Oversized 30.1 Preta
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  Tamanho
                </span>

                <span>
                  {shirtSize ??
                    'Selecione'}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  Base
                </span>

                <span>
                  {formatPrice(
                    BASE_PRICE,
                  )}
                </span>
              </div>

              {/* FRENTE */}

              {hasFrontArt && (
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span className="text-muted">
                    Frente —{' '}
                    {frontArt.size} cm
                  </span>

                  <span>
                    {frontArt.size <=
                    10
                      ? 'Incluído'
                      : `+ ${formatPrice(
                          calculatePrimaryPrintExtra(
                            frontArt.size,
                          ),
                        )}`}
                  </span>
                </div>
              )}

              {/* COSTAS */}

              {hasBackArt && (
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span className="text-muted">
                    Costas —{' '}
                    {backArt.size} cm
                  </span>

                  <span>
                    {hasFrontArt
                      ? `+ ${formatPrice(
                          calculateSecondPrintExtra(
                            backArt.size,
                          ),
                        )}`
                      : backArt.size <=
                          10
                        ? 'Incluído'
                        : `+ ${formatPrice(
                            calculatePrimaryPrintExtra(
                              backArt.size,
                            ),
                          )}`}
                  </span>
                </div>
              )}

              {/* MENSAGEM */}

              {message.trim() && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Mensagem
                  </p>

                  <p className="mt-2 break-words text-sm leading-relaxed text-foreground">
                    {message}
                  </p>
                </div>
              )}

              {/* TOTAL */}

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">
                    Total
                  </span>

                  <span className="text-lg font-semibold">
                    {formatPrice(
                      totalPrice,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* AVISO */}

            <div className="rounded-xl bg-card p-4 text-xs leading-relaxed text-muted">
              A posição mostrada no
              personalizador representa
              a intenção do projeto.
              Antes da produção, a
              GHOSTLINE poderá conferir
              as observações, tamanho e
              posicionamento enviados.
            </div>

            {/* CARRINHO */}

            <Button
              className="w-full"
              disabled={
                !hasAnyArt ||
                !shirtSize
              }
            >
              Adicionar ao carrinho
            </Button>

            {!shirtSize && (
              <p className="text-center text-xs text-muted">
                Selecione o tamanho da
                camiseta.
              </p>
            )}

            {shirtSize &&
              !hasAnyArt && (
                <p className="text-center text-xs text-muted">
                  Envie pelo menos uma
                  arte para continuar.
                </p>
              )}
          </div>
        </div>
      </div>
    </Container>
  );
}