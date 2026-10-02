export default function Header({ view, logged, onAdmin, onHome, onLogout }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={onHome} className="text-xl font-black italic tracking-tighter">
          DROP<span className="text-neon">SNEAKERS</span>
        </button>
        <div className="flex items-center gap-2">
          {logged && view === 'admin' && (
            <button onClick={onLogout} className="text-xs text-neutral-400 hover:text-white">Salir</button>
          )}
          <button onClick={onAdmin} className="text-xs text-neutral-600 hover:text-neon">Admin</button>
        </div>
      </div>
    </header>
  );
}
