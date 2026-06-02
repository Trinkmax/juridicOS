import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16: "proxy" reemplaza la antigua convención "middleware".
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto:
     * - _next/static, _next/image (assets de build)
     * - favicon, logo e imágenes
     */
    "/((?!_next/static|_next/image|favicon.ico|juridicos-logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
