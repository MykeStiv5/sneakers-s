# DROP SNEAKERS · Catálogo de ventas efímeras

## 1. Supabase
1. Crea un proyecto gratis en supabase.com.
2. SQL Editor → pega y ejecuta `supabase.sql` (tablas, RLS y bucket `tenis`).
3. Authentication → Users → "Add user" con mykestiven5@gmail.com y tu contraseña (marca "Auto Confirm User"). La contraseña NUNCA va en el código.
4. Authentication → Sign In / Providers → **desactiva "Allow new users to sign up"** (si no, cualquiera podría registrarse y editar).
5. Project Settings → API: copia `Project URL` y `anon public key`.

## 2. Local
    cp .env.example .env   # pega tus claves
    npm install
    npm run dev

## 3. Vercel
Sube a GitHub → Import en Vercel (detecta Vite) → agrega las variables
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` → Deploy.
Desde el panel Admin cambia el número de WhatsApp.
