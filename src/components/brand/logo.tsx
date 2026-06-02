import Image from "next/image";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Logo real de juridicOS (wordmark 1080×360, negro sobre transparente).
 * El PNG es negro: en superficies oscuras se invierte a blanco.
 * - default: `dark:invert` (negro en claro, blanco en oscuro).
 * - `forceWhite`: siempre blanco (para paneles oscuros en cualquier tema).
 */
export function Logo({
  className,
  forceWhite = false,
  priority = false,
}: {
  className?: string;
  forceWhite?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/juridicos-logo.png"
      alt="juridicOS"
      width={1080}
      height={360}
      priority={priority}
      sizes="180px"
      className={cn(
        "h-7 w-auto select-none object-contain",
        forceWhite ? "invert" : "dark:invert",
        className,
      )}
    />
  );
}

/** Glyph compacto (cuadrado) para favicons / íconos de app. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-foreground text-background",
        className,
      )}
    >
      <Scale className="size-[56%]" strokeWidth={2.25} />
    </div>
  );
}
