// Transición suave en cada navegación entre páginas de la app (CSS puro).
// El template se re-monta en cada navegación, disparando la animación fade-up.
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-in-up">{children}</div>;
}
