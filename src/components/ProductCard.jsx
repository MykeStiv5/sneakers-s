import { useState } from 'react';
import { money } from '../lib/supabase';

export default function ProductCard({ p, whatsapp }) {
  const [talla, setTalla] = useState('');
  const [error, setError] = useState(false);

  const comprar = () => {
    if (!talla) return setError(true);
    const msg = `¡Hola! 👋 Vi los ${p.nombre} en talla ${talla} en la página y quiero saber si están disponibles para entrega inmediata.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="relative aspect-square bg-neutral-800">
        {p.imagen_url && (
          <img src={p.imagen_url} alt={p.nombre} loading="lazy"
            className={`h-full w-full object-cover ${!p.disponible ? 'grayscale opacity-60' : ''}`} />
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
          p.disponible ? 'bg-neon text-black' : 'bg-red-600 text-white'}`}>
          {p.disponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight">{p.nombre}</h3>
          <span className="whitespace-nowrap font-black text-neon">{money(p.precio)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {p.tallas_disponibles.map((t) => (
            <button key={t} disabled={!p.disponible}
              onClick={() => { setTalla(t); setError(false); }}
              className={`min-w-10 rounded-md border px-2 py-1 text-xs font-semibold disabled:opacity-40 ${
                talla === t ? 'border-neon bg-neon text-black' : 'border-neutral-700 hover:border-neon'}`}>
              {t}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-400">Selecciona una talla primero.</p>}
        <button onClick={comprar} disabled={!p.disponible || !whatsapp} className="btn-primary w-full">
          {p.disponible ? 'Asesórame / Comprar por WhatsApp' : 'Agotado'}
        </button>
      </div>
    </article>
  );
}
