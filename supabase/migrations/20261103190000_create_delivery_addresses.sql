create table if not exists public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  recipient_name text not null,
  phone text,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  reference text,
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.delivery_addresses enable row level security;

create policy "Customers can view their delivery addresses"
  on public.delivery_addresses for select
  using ((select auth.uid()) = customer_id);

create policy "Customers can create their delivery addresses"
  on public.delivery_addresses for insert
  with check ((select auth.uid()) = customer_id);

create policy "Customers can update their delivery addresses"
  on public.delivery_addresses for update
  using ((select auth.uid()) = customer_id)
  with check ((select auth.uid()) = customer_id);
