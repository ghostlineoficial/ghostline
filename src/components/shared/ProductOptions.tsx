'use client';

import { useMemo, useState } from 'react';
import { Copy, ShoppingBag, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { SizeSelector } from './SizeSelector';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import { useToast } from '@/components/ui/Toast';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import {
  getAvailableColors,
  getDefaultColor,
} from '@/lib/product-media';
import type { Product } from '@/types/product';

interface ProductOptionsProps {
  product: Product;
  initialColor?: string;
  initialSize?: string;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}

interface PixData {
  orderId: string;
  status?: string;
  statusDetail?: string;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  externalReference?: string;
}

export function ProductOptions({
  product,
  initialColor,
  initialSize,
  selectedColor: selectedColorProp,
  onColorChange,
}: ProductOptionsProps) {
  const push = useToast((s) => s.push);
  const openCart = useUIStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);

  const colors = useMemo(
    () => getAvailableColors(product.variants),
    [product.variants],
  );

  const colorControlled =
    selectedColorProp !== undefined;

  const [internalColor, setInternalColor] =
    useState(() =>
      getDefaultColor(product, initialColor),
    );

  const selectedColor = colorControlled
    ? selectedColorProp
    : internalColor;

  const variantsForColor = useMemo(
    () =>
      product.variants.filter(
        (variant) =>
          variant.color === selectedColor,
      ),
    [product.variants, selectedColor],
  );

  const [selectedSize, setSelectedSize] =
    useState(() => {
      const fromUrl =
        variantsForColor.find(
          (variant) =>
            variant.size === initialSize &&
            variant.stock > 0,
        );

      return (
        fromUrl?.size ??
        variantsForColor.find(
          (variant) =>
            variant.stock > 0,
        )?.size ??
        null
      );
    });

  const [quantity, setQuantity] =
    useState(1);

  const [pixModalOpen, setPixModalOpen] =
    useState(false);

  const [payerEmail, setPayerEmail] =
    useState('');

  const [pixLoading, setPixLoading] =
    useState(false);

  const [pixData, setPixData] =
    useState<PixData | null>(null);

  const selectedVariant =
    variantsForColor.find(
      (variant) =>
        variant.size === selectedSize,
    ) ?? null;

  const maxQuantity =
    selectedVariant?.stock ?? 1;

  function syncUrl(
    color: string,
    size: string | null,
  ) {
    const params =
      new URLSearchParams();

    params.set('cor', color);

    if (size) {
      params.set('tamanho', size);
    }

    const query = params.toString();

    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState(
      null,
      '',
      newUrl,
    );
  }

  function handleColorChange(
    color: string,
  ) {
    if (!colorControlled) {
      setInternalColor(color);
    }

    onColorChange?.(color);

    const nextVariants =
      product.variants.filter(
        (variant) =>
          variant.color === color,
      );

    const nextSize =
      nextVariants.find(
        (variant) =>
          variant.stock > 0,
      )?.size ?? null;

    setSelectedSize(nextSize);
    setQuantity(1);

    syncUrl(color, nextSize);
  }

  function handleSizeChange(
    size: string,
  ) {
    setSelectedSize(size);
    setQuantity(1);

    syncUrl(selectedColor, size);
  }

  function handleAddToCart() {
    if (
      !selectedVariant ||
      !selectedSize
    ) {
      return;
    }

    const selectedImage =
      product.images.find(
        (image) =>
          image.color ===
            selectedColor &&
          image.isPrimary,
      ) ??
      product.images.find(
        (image) =>
          image.color ===
          selectedColor,
      ) ??
      product.images.find(
        (image) =>
          image.isPrimary,
      ) ??
      product.images[0];

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      image:
        selectedImage?.url ?? '',
      color: selectedColor,
      size: selectedSize,
      priceCents:
        product.priceCents,
      quantity,
      stock:
        selectedVariant.stock,
      sku: selectedVariant.sku,
    });

    push({
      tone: 'success',
      title:
        'Adicionado ao carrinho',
      description:
        `${product.name} — ${selectedColor}, ${selectedSize} × ${quantity}`,
    });

    openCart();
  }

  function handleBuyNow() {
    if (
      !selectedVariant ||
      !selectedSize
    ) {
      return;
    }

    setPixData(null);
    setPayerEmail('');
    setPixModalOpen(true);
  }

  function closePixModal() {
    if (pixLoading) {
      return;
    }

    setPixModalOpen(false);
    setPixData(null);
    setPayerEmail('');
  }

  async function handleCreatePix() {
    if (
      !selectedVariant ||
      !selectedSize
    ) {
      return;
    }

    const email =
      payerEmail.trim();

    if (
      !email ||
      !email.includes('@')
    ) {
      push({
        tone: 'danger',
        title: 'E-mail inválido',
        description:
          'Informe um e-mail válido para gerar o Pix.',
      });

      return;
    }

    try {
      setPixLoading(true);

      const response =
        await fetch(
          '/api/mercadopago/create-order',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              productId:
                product.id,

              variantId:
                selectedVariant.id,

              quantity,

              email,
            }),
          },
        );

      const responseText =
        await response.text();

      let data: any = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          'O servidor retornou uma resposta inválida.',
        );
      }

      if (!response.ok) {
        console.error(
          'Erro retornado pelo Mercado Pago:',
          data,
        );

        throw new Error(
          data?.error ??
            'Não foi possível gerar o Pix.',
        );
      }

      if (
        !data.qrCode &&
        !data.qrCodeBase64 &&
        !data.ticketUrl
      ) {
        console.error(
          'Pagamento criado sem dados do Pix:',
          data,
        );

        throw new Error(
          'O Mercado Pago não retornou os dados do Pix.',
        );
      }

      setPixData({
        orderId:
          data.internalOrderId ??
          data.orderId ??
          '',

        status:
          data.status,

        statusDetail:
          data.statusDetail,

        qrCode:
          data.qrCode ?? null,

        qrCodeBase64:
          data.qrCodeBase64 ??
          null,

        ticketUrl:
          data.ticketUrl ?? null,

        externalReference:
          data.externalReference,
      });
    } catch (error) {
      console.error(error);

      push({
        tone: 'danger',
        title:
          'Erro ao gerar Pix',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível gerar o pagamento Pix.',
      });
    } finally {
      setPixLoading(false);
    }
  }

  async function handleCopyPix() {
    if (!pixData?.qrCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        pixData.qrCode,
      );

      push({
        tone: 'success',
        title: 'Pix copiado',
        description:
          'O código Pix Copia e Cola foi copiado.',
      });
    } catch (error) {
      console.error(error);

      push({
        tone: 'danger',
        title:
          'Não foi possível copiar',
        description:
          'Selecione o código Pix manualmente.',
      });
    }
  }

  const outOfStock =
    !!selectedSize &&
    !selectedVariant;

  const soldOut =
    colors.every(
      (color) =>
        !color.available,
    );

  const totalPrice =
    (product.priceCents / 100) *
    quantity;

  const formattedTotal =
    totalPrice.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    );

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 text-caption text-muted">
          {selectedVariant && (
            <span className="font-mono">
              SKU{' '}
              {selectedVariant.sku}
            </span>
          )}

          <span
            className={
              outOfStock ||
              soldOut
                ? 'text-danger'
                : 'text-success'
            }
          >
            {outOfStock ||
            soldOut
              ? 'Esgotado'
              : 'Em estoque'}
          </span>
        </div>

        <div>
          <p className="mb-3 text-caption uppercase text-muted">
            Cor
            {selectedColor && (
              <span className="text-foreground">
                {' '}
                — {selectedColor}
              </span>
            )}
          </p>

          <div className="flex gap-3">
            {colors.map(
              ({
                color,
                available,
              }) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  active={
                    color ===
                    selectedColor
                  }
                  disabled={
                    !available
                  }
                  onClick={() =>
                    handleColorChange(
                      color,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-caption uppercase text-muted">
            Tamanho
          </p>

          <SizeSelector
            variants={
              variantsForColor
            }
            selectedSize={
              selectedSize
            }
            onSelect={
              handleSizeChange
            }
          />
        </div>

        <div>
          <p className="mb-3 text-caption uppercase text-muted">
            Quantidade
          </p>

          <QuantityStepper
            value={quantity}
            onChange={
              setQuantity
            }
            max={maxQuantity}
          />

          {selectedVariant &&
            selectedVariant.stock <=
              5 && (
              <p className="mt-2 text-caption text-warning">
                Só{' '}
                {
                  selectedVariant.stock
                }{' '}
                em estoque
              </p>
            )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            disabled={
              soldOut ||
              outOfStock
            }
            onClick={
              handleBuyNow
            }
            className="w-full"
          >
            <Zap className="h-4 w-4" />
            Comprar Agora
          </Button>

          <div className="flex gap-3">
            <Button
              size="lg"
              variant="secondary"
              disabled={
                soldOut ||
                outOfStock
              }
              onClick={
                handleAddToCart
              }
              className="flex-1"
            >
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao Carrinho
            </Button>

            <FavoriteButton
              productName={
                product.name
              }
            />

            <ShareButton
              title={product.name}
              url={
                typeof window !==
                'undefined'
                  ? window.location
                      .href
                  : ''
              }
            />
          </div>

          {soldOut && (
            <p className="text-body-sm text-danger">
              Produto esgotado em
              todas as cores.
            </p>
          )}
        </div>
      </div>

      {pixModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <button
              type="button"
              onClick={
                closePixModal
              }
              disabled={
                pixLoading
              }
              aria-label="Fechar pagamento Pix"
              className="absolute right-4 top-4 rounded-full border border-border p-2 text-muted transition hover:text-foreground disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                GHOSTLINE
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Pagamento via Pix
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                {product.name} —{' '}
                {selectedColor},{' '}
                {selectedSize} ×{' '}
                {quantity}
              </p>

              <p className="mt-3 text-xl font-semibold text-foreground">
                {formattedTotal}
              </p>
            </div>

            {!pixData ? (
              <div className="mt-6">
                <label
                  htmlFor="pix-email"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  E-mail
                </label>

                <input
                  id="pix-email"
                  type="email"
                  value={
                    payerEmail
                  }
                  onChange={(
                    event,
                  ) =>
                    setPayerEmail(
                      event.target
                        .value,
                    )
                  }
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
                />

                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Informe o e-mail
                  do comprador para
                  gerar o pagamento
                  Pix.
                </p>

                <Button
                  size="lg"
                  className="mt-5 w-full"
                  onClick={
                    handleCreatePix
                  }
                  disabled={
                    pixLoading
                  }
                >
                  <Zap className="h-4 w-4" />

                  {pixLoading
                    ? 'Gerando Pix...'
                    : 'Gerar Pix'}
                </Button>

                <p className="mt-4 text-center text-xs text-muted">
                  Pagamento processado
                  com segurança pelo
                  Mercado Pago.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                {pixData.qrCodeBase64 && (
                  <div className="mx-auto w-fit rounded-2xl bg-white p-4">
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code Pix"
                      className="h-56 w-56"
                    />
                  </div>
                )}

                <p className="mt-5 text-center text-sm font-medium text-foreground">
                  Escaneie o QR Code
                  ou use o Pix Copia
                  e Cola
                </p>

                {pixData.qrCode && (
                  <>
                    <div className="mt-4 max-h-28 overflow-y-auto break-all rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted">
                      {
                        pixData.qrCode
                      }
                    </div>

                    <Button
                      size="lg"
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={
                        handleCopyPix
                      }
                    >
                      <Copy className="h-4 w-4" />
                      Copiar código
                      Pix
                    </Button>
                  </>
                )}

                {pixData.ticketUrl && (
                  <a
                    href={
                      pixData.ticketUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition hover:border-foreground"
                  >
                    Abrir pagamento
                    Pix
                  </a>
                )}

                <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    Aguardando
                    pagamento
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}