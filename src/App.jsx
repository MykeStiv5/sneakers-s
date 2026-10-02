import { useCallback, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Catalog from './components/Catalog';
import Login from './components/Login';
import Admin from './components/Admin';

export default function App() {
  const [view, setView] = useState('public'); // public | login | admin
  const [session, setSession] = useState(null);
  const [productos, setProductos] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from('productos').select('*').order('created_at', { ascending: false }),
      supabase.from('configuracion').select('valor').eq('clave', 'whatsapp').maybeSingle(),
    ]);
    setProductos(p.data || []);
    setWhatsapp(c.data?.valor || '');
    setLoading(false);
  }, []);

  useEffect(() => {
    cargar();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) setView((v) => (v === 'admin' ? 'public' : v));
    });
    return () => sub.subscription.unsubscribe();
  }, [cargar]);

  const goAdmin = () => setView(session ? 'admin' : 'login');
  const salir = async () => { await supabase.auth.signOut(); setView('public'); };

  return (
    <div className="min-h-screen">
      <Header view={view} logged={!!session} onAdmin={goAdmin} onHome={() => setView('public')} onLogout={salir} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {view === 'public' && <Catalog productos={productos} whatsapp={whatsapp} loading={loading} />}
        {view === 'login' && !session && <Login onDone={() => setView('admin')} />}
        {view === 'admin' && session && (
          <Admin productos={productos} whatsapp={whatsapp} recargar={cargar} />
        )}
      </main>
    </div>
  );
}
