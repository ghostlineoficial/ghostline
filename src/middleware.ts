import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import {
  NextResponse,
  type NextRequest,
} from 'next/server';

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

const PROTECTED_PREFIXES = [
  '/profile',
  '/admin',
];

const ADMIN_PREFIX = '/admin';

export async function middleware(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Permite visualizar o projeto localmente
  // antes da configuração do Supabase.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(
          cookiesToSet: CookieToSet[],
        ) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value,
              );
            },
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path =
    request.nextUrl.pathname;

  const isProtected =
    PROTECTED_PREFIXES.some(
      (prefix) =>
        path.startsWith(prefix),
    );

  if (isProtected && !user) {
    const redirectUrl = new URL(
      '/login',
      request.url,
    );

    redirectUrl.searchParams.set(
      'redirectTo',
      path,
    );

    return NextResponse.redirect(
      redirectUrl,
    );
  }

  if (
    path.startsWith(ADMIN_PREFIX) &&
    user
  ) {
    const { data: profile } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/', request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
  ],
};