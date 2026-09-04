import {
  Instagram,
  Youtube,
  Twitter,
  ArrowUpRight,
} from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Newsletter } from '@/components/shared/Newsletter';
import { IconButton } from '@/components/ui/IconButton';

const COLUMNS = [
  {
    title: 'SHOP',
    links: [
      { href: '/shop', label: 'Todos os Produtos' },
      { href: '/drops', label: 'Drops' },
      { href: '/ghost-studio', label: 'Ghost Studio' },
    ],
  },
  {
    title: 'EMPRESA',
    links: [
      { href: '/about', label: 'Sobre a Ghostline' },
      { href: '/ghost-society', label: 'Ghost Society' },
      { href: '/community', label: 'Community' },
    ],
  },
  {
    title: 'SUPORTE',
    links: [
      { href: '/support', label: 'Central de Ajuda' },
      { href: '/profile/orders', label: 'Meus Pedidos' },
      { href: '/contact', label: 'Contato' },
    ],
  },
];

const SOCIALS = [
  {
    icon: Instagram,
    href: 'https://instagram.com/ghostline',
    label: 'Instagram',
  },
  {
    icon: Youtube,
    href: 'https://youtube.com',
    label: 'Youtube',
  },
  {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">

      <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[170px]" />

      <Container>

        <div className="py-20">
          <Newsletter />
        </div>

        <div className="grid gap-14 border-t border-white/10 py-20 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          <div>

            <h2 className="font-display text-4xl tracking-[6px] text-white">
              GHOSTLINE
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-zinc-400">
              Moda criada para quem transforma disciplina em identidade.
              Streetwear premium inspirado na cultura contemporânea,
              academia e evolução constante.
            </p>

            <div className="mt-8 flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconButton
                    icon={<social.icon className="h-5 w-5" />}
                    label={social.label}
                    variant="outline"
                  />
                </a>
              ))}
            </div>

          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>

              <h3 className="mb-6 text-sm font-bold tracking-[4px] text-white">
                {column.title}
              </h3>

              <ul className="space-y-4">

                {column.links.map((link) => (

                  <li key={link.href}>

                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-zinc-400 transition hover:text-white"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={15}
                        className="opacity-0 transition group-hover:opacity-100"
                      />

                    </a>

                  </li>

                ))}

              </ul>

            </div>
          ))}

        </div>

      </Container>

      <div className="border-t border-white/10">

        <Container>

          <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">

            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} GHOSTLINE.
              Todos os direitos reservados.
            </p>

            <p className="text-xs uppercase tracking-[5px] text-zinc-600">
              BEYOND THE LIMITS
            </p>

          </div>

        </Container>

      </div>

    </footer>
  );
}