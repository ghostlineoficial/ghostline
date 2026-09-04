'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Container } from '@/components/ui/Container';
import { useUIStore } from '@/store/ui';
import { overlayFade, slideDown } from '@/lib/motion';

const SUGGESTED_TERMS = ['Moletons', 'Drop atual', 'Anime', 'Ghost Studio'];

/**
 * SearchOverlay — UI completa, sem conexão ao banco (features/search
 * fica responsável pela busca real depois). Por enquanto mostra termos
 * sugeridos estáticos e um EmptyState quando há texto digitado.
 */
export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
        >
          <motion.div variants={slideDown} initial="hidden" animate="visible" exit="exit">
            <Container size="md">
              <div className="flex items-center gap-4 pt-8">
                <div className="flex-1">
                  <SearchInput
                    autoFocus
                    placeholder="Buscar produtos, drops, coleções..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClear={() => setQuery('')}
                    onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                  />
                </div>
                <IconButton icon={<X className="h-5 w-5" />} label="Fechar busca" onClick={closeSearch} />
              </div>

              <div className="mt-12">
                {query ? (
                  <EmptyState
                    icon={<SearchIcon className="h-8 w-8" />}
                    title={`Nada encontrado para "${query}"`}
                    description="Busca ainda não conectada ao catálogo — isso chega numa próxima fase."
                  />
                ) : (
                  <div>
                    <p className="text-caption uppercase text-muted">Sugestões</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {SUGGESTED_TERMS.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-border px-4 py-2 text-body-sm text-foreground hover:border-foreground/30"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
