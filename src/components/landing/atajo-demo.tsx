"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LINKS } from "@/lib/landing/config";

/**
 * Hace honesto el <Kbd>D</Kbd> del hero: apretar "D" (cuando no estás tipeando en
 * un campo) te lleva a la demo. No renderiza nada.
 */
export function AtajoDemo() {
  const router = useRouter();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;
      e.preventDefault();
      router.push(LINKS.demo);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
