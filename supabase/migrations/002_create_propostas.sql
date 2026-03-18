create table if not exists public.propostas (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) on delete set null,
  titulo text not null,
  cliente text not null,
  descricao_servico text not null,
  valor numeric(14,2) not null,
  status text not null default 'rascunho'
    check (status in ('rascunho','enviada','em_negociacao','aprovada','rejeitada','expirada')),
  data_envio date,
  data_validade date not null,
  condicoes_pagamento text,
  observacao text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.propostas enable row level security;

create policy "Acesso autenticado às propostas"
  on public.propostas
  for all
  to authenticated
  using (true)
  with check (true);

create trigger propostas_updated_at
  before update on public.propostas
  for each row
  execute function public.update_updated_at();