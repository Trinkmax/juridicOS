import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/** Public route prefixes that never require an authenticated session. */
const PUBLIC_PREFIXES = [
  "/login",
  "/registro",
  "/auth",
  "/recuperar",
  "/api/calendar", // feed ICS de suscripción (autenticado por token en la URL)
];

/**
 * Refresh the Supabase session on every request and gate the app.
 * Critical: returns the SAME response object so refreshed auth cookies persist.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isLanding = pathname === "/";

  // Unauthenticated → bounce to login (except public + landing).
  if (!user && !isPublic && !isLanding) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting auth pages → send into the app.
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/registro"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
