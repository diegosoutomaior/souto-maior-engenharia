create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text,
  telefone text not null,
  empresa text,
  origem text not null default 'outros'
    check (origem in ('indicacao','site','instagram','telefone','evento','outros')),
  status text not null default 'novo'
    check (status in ('novo','contatado','qualificado','proposta_enviada','fechado_ganho','fechado_perdido')),
  valor_estimado numeric(12,2),
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Acesso autenticado aos leads"
  on public.leads
  for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on public.leads
  for each row
  execute function public.update_updated_at();