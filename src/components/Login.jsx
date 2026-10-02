import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError('Credenciales incorrectas.'); else onDone();
  };

  return (
    <form onSubmit={entrar} className="mx-auto mt-12 max-w-sm space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-lg font-black">Acceso administrador</h2>
      <input className="input" type="email" placeholder="Correo" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
