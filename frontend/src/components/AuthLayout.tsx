import type { ReactNode } from 'react';

function PortalArt() {
  const rings = [70, 100, 130, 160, 190];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.35)_0%,_rgba(16,185,129,0.10)_38%,_transparent_70%)]" />
      <svg
        className="absolute h-[460px] w-[460px] opacity-70"
        viewBox="0 0 400 400"
        fill="none"
      >
        {rings.map((r) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            stroke="rgb(16 185 129 / 0.28)"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className="absolute h-24 w-24 rounded-full bg-emerald-500/80 blur-2xl" />
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden border-r border-neutral-900 bg-neutral-950 lg:flex">
        <PortalArt />
        <div className="relative z-10 max-w-sm px-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">PedBox</h2>
          <p className="mt-3 text-neutral-400">
            Explorá personajes, ubicaciones y episodios de todo el multiverso
            de Rick and Morty.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
