create table if not exists public.lancamentos (
  id uuid default gen_random_uuid() primary key,
  obra_id uuid not null references public.obras(id) on delete cascade,
  tipo text not null
    check (tipo in ('receita','despesa')),
  categoria text not null
    check (categoria in ('material','mao_de_obra','equipamento','servico_terceiro','imposto','medicao','adiantamento','outros')),
  descricao text not null,
  valor numeric(14,2) not null,
  data_vencimento date not null,
  data_pagamento date,
  status text not null default 'pendente'
    check (status in ('pendente','pago','atrasado','cancelado')),
  nota_fiscal text,
  observacao text,
  created_at timestamptz default now()
);

alter table public.lancamentos enable row level security;

create policy "Acesso autenticado aos lancamentos"
  on public.lancamentos
  for all
  to authenticated
  using (true)
  with check (true);