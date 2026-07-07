# Environment Variables Template

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Go to your project settings and copy the URL and anon key
3. Create the `messages` table in your Supabase SQL editor:

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  preferred_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Add your credentials to `.env.local`
5. Restart your development server

## Server-only variables

These are read only by server-side code (route handlers) and must never be
given a `NEXT_PUBLIC_` prefix, which would expose them to the browser bundle.

```
# Server-only: used by lib/supabase/server.ts, never expose to the client
SUPABASE_URL=
# Server-only: service-role key, never expose to the client
SUPABASE_SERVICE_ROLE_KEY=
```

