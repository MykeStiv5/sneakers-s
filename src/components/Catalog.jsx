import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function Catalog({ productos, whatsapp, loading }) {
  const [q, setQ] = useState('');
  const [talla, setTalla] = useState('');

  const tallas = useMemo(
    () => [...new Set(productos.flatMap((p) => p.tallas_disponibles))]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [productos]
  );

  const lista = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q.toLowerCase()) &&
      (!talla || p.tallas_disponibles.includes(talla))
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="Buscar modelo…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input sm:w-48" value={talla} onChange={(e) => setTalla(e.target.value)}>
          <option value="">Todas las tallas</option>
          {tallas.map((t) => <option key={t} value={t}>Talla {t}</option>)}
        </select>
      </div>
      {loading ? (
        <p className="text-neutral-500">Cargando…</p>
      ) : lista.length === 0 ? (
        <p className="text-neutral-500">No hay tenis que coincidan.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => <ProductCard key={p.id} p={p} whatsapp={whatsapp} />)}
        </div>
      )}
    </>
  );
}
