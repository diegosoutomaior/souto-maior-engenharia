create table if not exists public.obras (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  cliente text not null,
  endereco text not null,
  status text not null default 'planejamento'
    check (status in ('planejamento','em_andamento','pausada','concluida','cancelada')),
  prioridade text not null default 'normal'
    check (prioridade in ('critico','atencao','normal')),
  responsavel text not null,
  data_inicio date not null,
  data_previsao date not null,
  data_conclusao date,
  orcamento numeric(14,2) not null default 0,
  custo_atual numeric(14,2) not null default 0,
  progresso integer not null default 0
    check (progresso >= 0 and progresso <= 100),
  descricao text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.obras enable row level security;

create policy "Acesso autenticado às obras"
  on public.obras
  for all
  to authenticated
  using (true)
  with check (true);

create trigger obras_updated_at
  before update on public.obras
  for each row
  execute function public.update_updated_at();