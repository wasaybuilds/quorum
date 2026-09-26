import postgres from "postgres";

// Server-only. One pooled client per process (kept on globalThis so dev reloads don't leak connections).

const globalForDb = globalThis as unknown as { __sql?: postgres.Sql; __schema?: Promise<void> };

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function client() {
  if (!globalForDb.__sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    // Railway's private network (*.railway.internal) is plain TCP; the public proxy wants TLS.
    const ssl = url.includes(".railway.internal") || url.includes("localhost") ? false : "require";
    globalForDb.__sql = postgres(url, { ssl, max: 5, idle_timeout: 20, connect_timeout: 10 });
  }
  return globalForDb.__sql;
}

const SCHEMA = `
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  google_sub text unique not null,
  email text not null,
  name text,
  picture text,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists google_tokens (
  user_id uuid primary key references users(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz not null,
  scope text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists recording_prefs (
  user_id uuid primary key references users(id) on delete cascade,
  record_external boolean not null default true,
  record_internal boolean not null default false,
  share_with_attendees boolean not null default false,
  overrides jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists action_item_status (
  user_id uuid not null references users(id) on delete cascade,
  item_key text not null,
  status text not null check (status in ('pending', 'completed')),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_key)
);
`;

/** The shared client, after making sure the schema exists (idempotent, runs once per process). */
export async function db() {
  const sql = client();
  globalForDb.__schema ??= sql.unsafe(SCHEMA).then(() => undefined).catch((err) => {
    globalForDb.__schema = undefined; // retry on the next request
    throw err;
  });
  await globalForDb.__schema;
  return sql;
}
