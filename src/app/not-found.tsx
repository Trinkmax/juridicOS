import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div>
        <p className="text-6xl font-semibold tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-xl font-semibold">No encontramos esta página</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que el enlace esté roto o que la página se haya movido.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Volver al panel</Link>
      </Button>
    </div>
  );
}
