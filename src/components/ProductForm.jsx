import { useState } from 'react';
import { supabase, BUCKET } from '../lib/supabase';

export default function ProductForm({ producto, onClose, onSaved }) {
  const [f, setF] = useState({
    nombre: producto?.nombre || '',
    precio: producto?.precio || '',
    tallas: producto?.tallas_disponibles.join(', ') || '',
    imagen_url: producto?.imagen_url || '',
    disponible: producto?.disponible ?? true,
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      let imagen_url = f.imagen_url;
      if (file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Solo JPG, PNG o WEBP.');
        if (file.size > 3 * 1024 * 1024) throw new Error('La imagen supera 3 MB.');
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
        if (upErr) throw upErr;
        imagen_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
      if (imagen_url && !/^https:\/\//i.test(imagen_url)) throw new Error('La URL de la imagen debe empezar con https://');
      const payload = {
        nombre: f.nombre.trim(),
        precio: Number(f.precio),
        tallas_disponibles: f.tallas.split(',').map((t) => t.trim()).filter(Boolean),
        imagen_url,
        disponible: f.disponible,
      };
      const { error: dbErr } = producto
        ? await supabase.from('productos').update(payload).eq('id', producto.id)
        : await supabase.from('productos').insert(payload);
      if (dbErr) throw dbErr;
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={guardar} className="mb-6 grid gap-3 rounded-2xl border border-neon/40 bg-neutral-900 p-4 sm:grid-cols-2">
      <input className="input" placeholder="Nombre / Modelo" required value={f.nombre} onChange={set('nombre')} />
      <input className="input" type="number" min="0" step="any" placeholder="Precio" required value={f.precio} onChange={set('precio')} />
      <input className="input sm:col-span-2" placeholder="Tallas separadas por comas: 40, 41, 42" required value={f.tallas} onChange={set('tallas')} />
      <input className="input" placeholder="URL de imagen (opcional si subes archivo)" value={f.imagen_url} onChange={set('imagen_url')} />
      <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.disponible} onChange={set('disponible')} /> Disponible
      </label>
      {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button className="btn-primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
