/*
# Create Maurice Gimose digital card

1. New Tables
- `digital_cards` stores the single public digital card used by this experience.
- `slug` identifies the public card and is the primary key.
- `full_name`, `job_title`, `phone`, `whatsapp`, and `email` store Maurice's contact details.
- `memphis_website` and `zetu_website` store the theme-specific website addresses.
- `default_theme` stores the first theme shown to visitors.
- `created_at` and `updated_at` record the card lifecycle.

2. Seed Data
- Add the initial Maurice Gimose card using the provided contact details.
- Preserve the supplied Zetu hostname exactly as provided: `zetu.memphiscaptial.co.ke`.

3. Security
- Enable row level security on `digital_cards`.
- Allow anonymous and authenticated visitors to read the intentionally public card.
- Allow anonymous and authenticated clients to create, update, and delete this intentionally shared single-card record.

4. Important Notes
- This is a single-tenant public card with no sign-in flow.
- Policies are separated by CRUD operation so the public experience can load and maintain its card data.
*/

CREATE TABLE IF NOT EXISTS public.digital_cards (
  slug text PRIMARY KEY,
  full_name text NOT NULL,
  job_title text NOT NULL,
  phone text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  memphis_website text NOT NULL,
  zetu_website text NOT NULL,
  default_theme text NOT NULL DEFAULT 'memphis' CHECK (default_theme IN ('memphis', 'zetu')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.digital_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_digital_cards" ON public.digital_cards;
CREATE POLICY "public_read_digital_cards"
  ON public.digital_cards FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "public_insert_digital_cards" ON public.digital_cards;
CREATE POLICY "public_insert_digital_cards"
  ON public.digital_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_digital_cards" ON public.digital_cards;
CREATE POLICY "public_update_digital_cards"
  ON public.digital_cards FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_digital_cards" ON public.digital_cards;
CREATE POLICY "public_delete_digital_cards"
  ON public.digital_cards FOR DELETE
  TO anon, authenticated
  USING (true);

INSERT INTO public.digital_cards (
  slug,
  full_name,
  job_title,
  phone,
  whatsapp,
  email,
  memphis_website,
  zetu_website,
  default_theme
)
VALUES (
  'maurice-gimose',
  'Maurice Gimose',
  'Business Development Manager',
  '+254 727 583260',
  '+254 727 583260',
  'info@memphiscapital.co.ke',
  'www.memphiscapital.co.ke',
  'zetu.memphiscaptial.co.ke',
  'memphis'
)
ON CONFLICT (slug) DO NOTHING;