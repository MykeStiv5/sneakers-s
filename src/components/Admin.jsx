import { useState } from 'react';
import { supabase, money } from '../lib/supabase';
import ProductForm from './ProductForm';

export default function Admin({ productos, whatsapp, recargar }) {
  const [editando, setEditando] = useState(null); // null | 'nuevo' | producto
  const [wa, setWa] = useState(whatsapp);
  const [msg, setMsg] = useState('');

  const guardarWa = async () => {
    const limpio = wa.replace(/\D/g, '');
    const { error } = await supabase.from('configuracion').upsert({ clave: 'whatsapp', valor: limpio });
    setMsg(error ? 'Error al guardar' : 'Número actualizado ✔');
    setWa(limpio); recargar();
  };

  const toggle = async (p) => {
    await supabase.from('productos').update({ disponible: !p.disponible }).eq('id', p.id);
    recargar();
  };

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await supabase.from('productos').delete().eq('id', p.id);
    recargar();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-2 font-black">WhatsApp de contacto</h2>
        <p className="mb-2 text-xs text-neutral-500">Con código de país, sin + ni espacios (ej. 573001234567).</p>
        <div className="flex gap-2">
          <input className="input" value={wa} onChange={(e) => setWa(e.target.value)} />
          <button className="btn-primary" onClick={guardarWa}>Guardar</button>
        </div>
        {msg && <p className="mt-2 text-xs text-neon">{msg}</p>}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-black">Productos ({productos.length})</h2>
          <button className="btn-primary" onClick={() => setEditando('nuevo')}>+ Nuevo par</button>
        </div>

        {editando && (
          <ProductForm
            producto={editando === 'nuevo' ? null : editando}
            onClose={() => setEditando(null)}
            onSaved={() => { setEditando(null); recargar(); }}
          />
        )}

        <ul className="space-y-3">
          {productos.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3 sm:flex-nowrap">
              <img src={p.imagen_url} alt="" className="h-16 w-16 rounded-lg bg-neutral-800 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.nombre}</p>
                <p className="text-xs text-neutral-400">{money(p.precio)} · Tallas: {p.tallas_disponibles.join(', ')}</p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                <button onClick={() => toggle(p)}
                  className={`btn ${p.disponible ? 'bg-neutral-800' : 'bg-red-600'}`}>
                  {p.disponible ? 'Marcar agotado' : 'Agotado ✕'}
                </button>
                <button onClick={() => setEditando(p)} className="btn-ghost">Editar</button>
                <button onClick={() => eliminar(p)} className="btn-ghost !text-red-400">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
