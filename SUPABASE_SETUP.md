# Supabase setup

## 1) Create tables
Run this in the Supabase SQL editor.

```sql
create extension if not exists "pgcrypto";

create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  ledger text not null default 'dad',
  amount numeric not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  ledger text not null default 'dad',
  description text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz not null default now()
);

alter table deposits add column if not exists ledger text not null default 'dad';
alter table expenses add column if not exists ledger text not null default 'dad';

alter table deposits enable row level security;
alter table expenses enable row level security;

create policy "Public read deposits" on deposits for select using (true);
create policy "Public insert deposits" on deposits for insert with check (true);
create policy "Public delete deposits" on deposits for delete using (true);

create policy "Public read expenses" on expenses for select using (true);
create policy "Public insert expenses" on expenses for insert with check (true);
create policy "Public delete expenses" on expenses for delete using (true);
```

## 2) Seed sample data (optional)

```sql
insert into deposits (ledger, amount, date)
values
  ('dad', 50000, '2026-01-04');

insert into expenses (ledger, description, amount, date)
values
  ('dad', 'Rani Mami Electricity', 2500, '2026-01-14'),
  ('dad', 'Rani Mami Water Bill', 2500, '2026-01-14'),
  ('dad', 'Azwer Mama Beef Money', 2500, '2026-01-13'),
  ('dad', 'Kolonnawa Withdrawal', 10000, '2026-01-16'),
  ('dad', 'Auto Petrol', 700, '2026-01-22'),
  ('dad', 'Kolonnawa Withdrawal', 2500, '2026-01-19'),
  ('dad', 'People''s Bank Transfer', 10000, '2026-01-20'),
  ('dad', 'Rent Home Electricity', 1060, '2026-01-21'),
  ('dad', 'Rent Home Water', 1040, '2026-01-21'),
  ('dad', 'Wellampitiya Home Water', 500, '2026-01-21');
```

## 3) Environment variables
Create a `.env.local` file locally or add to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Note on security
The policies above allow anyone with the URL to read/write. For tighter control, add authentication or a private admin key on server routes.
