-- =====================================================================
-- DROP SNEAKERS · Script completo y seguro (se puede ejecutar varias veces)
-- Admin autorizado: mykestiven5@gmail.com
-- =====================================================================

-- ============ TABLAS ============
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  precio numeric(12,2) not null,
  tallas_disponibles text[] not null default '{}',
  imagen_url text,
  disponible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.configuracion (
  clave text primary key,
  valor text not null
);
insert into public.configuracion (clave, valor)
values ('whatsapp', '573000000000') on conflict do nothing;

-- ============ VALIDACIONES ============
alter table public.productos drop constraint if exists precio_valido;
alter table public.productos drop constraint if exists nombre_valido;
alter table public.productos drop constraint if exists tallas_validas;
alter table public.productos add constraint precio_valido check (precio >= 0 and precio < 100000000);
alter table public.productos add constraint nombre_valido check (char_length(nombre) between 1 and 120);
alter table public.productos add constraint tallas_validas check (cardinality(tallas_disponibles) <= 30);

alter table public.configuracion drop constraint if exists whatsapp_valido;
alter table public.configuracion add constraint whatsapp_valido
  check (clave <> 'whatsapp' or valor ~ '^[0-9]{8,15}$');

-- ============ RLS ============
alter table public.productos enable row level security;
alter table public.configuracion enable row level security;

drop policy if exists "Lectura publica productos" on public.productos;
drop policy if exists "Admin inserta productos" on public.productos;
drop policy if exists "Admin actualiza productos" on public.productos;
drop policy if exists "Admin elimina productos" on public.productos;
drop policy if exists "Lectura publica config" on public.configuracion;
drop policy if exists "Admin inserta config" on public.configuracion;
drop policy if exists "Admin actualiza config" on public.configuracion;

-- Lectura pública
create policy "Lectura publica productos" on public.productos for select using (true);
create policy "Lectura publica config" on public.configuracion for select using (true);

-- Escritura: SOLO el correo del administrador
create policy "Admin inserta productos" on public.productos for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
create policy "Admin actualiza productos" on public.productos for update to authenticated
  using ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
create policy "Admin elimina productos" on public.productos for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');

create policy "Admin inserta config" on public.configuracion for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
create policy "Admin actualiza config" on public.configuracion for update to authenticated
  using ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');

-- ============ STORAGE (fotos) ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tenis', 'tenis', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set file_size_limit = 3145728,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Fotos publicas" on storage.objects;
drop policy if exists "Admin sube fotos" on storage.objects;
drop policy if exists "Admin edita fotos" on storage.objects;
drop policy if exists "Admin borra fotos" on storage.objects;

create policy "Fotos publicas" on storage.objects for select using (bucket_id = 'tenis');
create policy "Admin sube fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'tenis' and (auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
create policy "Admin edita fotos" on storage.objects for update to authenticated
  using (bucket_id = 'tenis' and (auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
create policy "Admin borra fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'tenis' and (auth.jwt() ->> 'email') = 'mykestiven5@gmail.com');
