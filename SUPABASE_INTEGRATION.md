# Supabase Integration - Complete Guide

## 🚀 Quick Start

Visionary PX Studio ist vollständig mit Supabase integriert — sowohl für den KI-Studio-Bereich als auch für das integrierte PX Inventar Modul.

### First Time Setup

1. **App starten:**

   ```bash
   npm run dev
   ```

2. **Konto erstellen:**
   - `http://localhost:3000` öffnen
   - "Sign Up" klicken, Name, E-Mail und Passwort eingeben
   - Automatischer Login danach

3. **Loslegen:**
   - KI-Studio: Alle Generierungen werden automatisch in Supabase gespeichert
   - PX Inventar: Über Dashboard → "PX Inventar" Karte erreichbar

---

## ✅ Fully Implemented Features

### 🔐 Authentication

- ✅ **Login/Signup** — Email & Password
- ✅ **Session Persistence** — Bleibt über Page-Refreshes eingeloggt
- ✅ **Password Reset** — Sicheres E-Mail-basiertes Passwort-Recovery
- ✅ **Logout** — Saubere Session-Termination
- ✅ **Role System** — `profiles.role` = `'user'` | `'admin'`

### 👤 Profile Management

- ✅ **User Profiles** — Name, Avatar, Rolle
- ✅ **Avatar Upload** — In Supabase Storage gespeichert
- ✅ **Real-time Updates** — Änderungen sofort in der gesamten App sichtbar

### 💾 KI Studio — Content Persistence

Alle Generatoren speichern automatisch in Supabase:

#### 🎨 Image Gen

```typescript
await saveImage({
  prompt: "Your prompt",
  model: "gemini-2.0-flash-exp",
  image_url: generatedUrl,
  config: { aspectRatio, mode },
});
```

#### 🎥 Video Studio

```typescript
await saveVideo({
  prompt: "Your prompt",
  model: "veo-3.1-fast-generate-preview",
  video_url: generatedUrl,
  config: { aspectRatio, duration, cameraMotion },
});
```

#### 🖼️ Thumbnail Engine

```typescript
await saveThumbnail({
  topic: "Video topic",
  background_prompt,
  element_prompt,
  text_content,
  thumbnail_url: generatedUrl,
  config: { aspectRatio, textStyle },
});
```

#### ✏️ Sketch Studio

```typescript
await saveSketch({
  sketch_data: sketchBase64,
  generated_image_url: generatedUrl,
  context: "HUMAN",
  style: "CINEMATIC",
  edit_history: [],
});
```

---

## 📊 Database Schema

### KI Studio Tables

#### `profiles`

```sql
id          uuid  references auth.users (PK)
email       text
full_name   text
avatar_url  text
role        text  default 'user'  -- 'user' | 'admin'
created_at  timestamptz
updated_at  timestamptz
```

#### `generated_images`

```sql
id        uuid (PK)
user_id   uuid references profiles
prompt    text
model     text
image_url text
config    jsonb
created_at timestamptz
```

#### `generated_videos`

```sql
id            uuid (PK)
user_id       uuid references profiles
prompt        text
model         text
video_url     text
thumbnail_url text
config        jsonb
created_at    timestamptz
```

#### `generated_thumbnails`, `generated_texts`, `generated_sketches`, `stories`

Siehe vollständiges Schema in `.sql/schema.sql`.

#### `onboarding_embeddings` (RAG-Vektordatenbank)

Speichert Abschnitte aus dem "Need To Know" Onboarding-Dokument als 768-dim Vektoren für den RAG-Chatbot.

```sql
id         uuid (PK, default gen_random_uuid())
heading    text            -- Abschnittsüberschrift
content    text            -- Abschnittstext
tokens     int             -- Geschätzte Tokenanzahl
embedding  vector(768)     -- gemini-embedding-001, 768 Dimensionen
created_at timestamptz
```

**Seeding:** Einmalig via `node scripts/seed-onboarding.mjs` — liest das `.docx`, chunked nach Überschriften, embeddet via Gemini und schreibt in diese Tabelle.

**Supabase RPC:** Für Similarity Search muss folgende SQL-Funktion einmalig im SQL Editor ausgeführt werden:

```sql
create or replace function match_onboarding_docs(
  query_embedding vector(768),
  match_count int default 5
)
returns table (id uuid, heading text, content text, similarity float)
language sql stable as $$
  select id, heading, content,
    1 - (embedding <=> query_embedding) as similarity
  from onboarding_embeddings
  where embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

---

### PX INTERN Tables

#### `inventar_items`

```sql
id                 uuid (PK)
px_nummer          text
geraet             text   -- Gerätetyp (z.B. MacBook, iPhone)
modell             text
seriennummer       text
status             text   -- 'Vorhanden' | 'Ausgeliehen' | 'Fehlt' | 'Defekt'
ort                text
department         text
os                 text
ip_office          text
handy_nr           text
assigned_to_name   text
assigned_to_id     uuid references profiles
px_eigentum        boolean
is_verleihartikel  boolean
anschaffungsdatum  date
anschaffungspreis  numeric
bild_url           text
notes              text
created_at / updated_at
```

#### `inventar_verleihscheine`

```sql
id              uuid (PK)
borrower_type   text   -- 'team' | 'extern'
profile_id      uuid references profiles
extern_name     text
extern_firma    text
extern_email    text
abholzeit       timestamptz
rueckgabezeit   timestamptz
prozentsatz     numeric
gesamtkosten    numeric
zweck           text
notizen         text
status          text   -- 'aktiv' | 'erledigt'
created_by      uuid references profiles
created_at / updated_at
```

#### `inventar_verleihschein_items`

```sql
id                 uuid (PK)
verleihschein_id   uuid references inventar_verleihscheine
item_id            uuid references inventar_items
anschaffungspreis  numeric
tagespreis         numeric
gesamtpreis        numeric
```

#### `inventar_loans` (einfache Ausleihen)

```sql
id         uuid (PK)
item_id    uuid references inventar_items
user_id    uuid references profiles
due_date   date
notes      text
returned_at timestamptz
created_at timestamptz
```

#### `inventar_logins`

```sql
id          uuid (PK)
dienst      text   -- z.B. Adobe, GitHub
benutzername text
passwort    text   -- verschlüsselt empfohlen!
url         text
notizen     text
kategorie   text
created_at / updated_at
```

#### `inventar_handyvertraege`

```sql
id            uuid (PK)
anbieter      text
rufnummer     text
assigned_to   text
vertragsbeginn date
vertragsende  date
monatlich     numeric
notizen       text
created_at / updated_at
```

#### `inventar_kreditkarten`

```sql
id            uuid (PK)
bank          text
karteninhaber text
kartennummer  text  -- nur letzte 4 Ziffern empfohlen
gueltig_bis   text
limit_eur     numeric
notizen       text
created_at / updated_at
```

#### `inventar_firmendaten`

```sql
id          uuid (PK)
kategorie   text  -- 'Bankverbindung' | 'Handelsregister'
bezeichner  text
wert        text
anmerkung   text
datei_name  text
sort_order  integer
created_at / updated_at
```

#### `inventar_links`

```sql
id           uuid (PK)
titel        text
url          text
beschreibung text
kategorie    text   -- z.B. 'Sharepoint', 'Rechtliches', 'Tools'
sort_order   integer default 0
created_at / updated_at
```

#### `inventar_dashboard_config` (NEU)

Per-User Dashboard-Konfiguration. Jeder User kann Widgets, Link-Kategorien und angeheftete Logins individuell einstellen.

```sql
id         uuid (PK, default gen_random_uuid())
user_id    uuid references auth.users(id) on delete cascade
config     jsonb not null default '{}'
created_at timestamptz
updated_at timestamptz
CONSTRAINT inventar_dashboard_config_user_id_key UNIQUE (user_id)
```

**Config JSON Shape:**

```json
{
  "show_links": true,
  "link_categories": null,
  "show_calendar": true,
  "show_loans": true,
  "show_inventory_stats": true,
  "pinned_login_ids": []
}
```

---

## 🔒 Security

### Row Level Security (RLS)

Alle Tabellen haben RLS enabled.

#### KI Studio — User-scoped

```sql
-- Jeder User sieht nur eigene Generierungen
CREATE POLICY "Users can view own content"
  ON generated_images FOR SELECT
  USING (auth.uid() = user_id);
```

#### PX Inventar — Team-scoped + Admin-only

```sql
-- Alle eingeloggten User können lesen
CREATE POLICY "Team kann Inventar sehen"
  ON inventar_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- Nur Admins können schreiben
CREATE POLICY "Admins verwalten Inventar"
  ON inventar_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Interne Links: alle lesen, Admins schreiben
CREATE POLICY "Alle sehen Links" ON inventar_links
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins können Links verwalten" ON inventar_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Dashboard-Config: User-scoped (jeder liest/schreibt nur eigene)
create policy "user owns config"
  on inventar_dashboard_config
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Storage Security

```sql
-- Avatare: authentifizierter Upload, öffentliches Lesen
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Inventar-Bilder: Admin-Upload
CREATE POLICY "Admins upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'inventar-images' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 🔧 Environment Variables

Required in `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google AI Configuration
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🎯 Rollen-System

Admins werden in Supabase direkt in der `profiles` Tabelle gesetzt:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'deine@email.de';
```

Admins sehen im Inventar zusätzlich:

- Bearbeiten/Löschen-Buttons (hover-sichtbar)
- Admin-only Module: Handyverträge, Kreditkarten, Firmendaten
- "Link hinzufügen" Button auf der Internen Links Seite

---

## ✨ What's Working

**Alles!** Die App ist vollständig funktional:

**KI Studio:**

- ✅ Kompletter Auth-Flow
- ✅ Alle Generatoren speichern in Supabase
- ✅ Dashboard zeigt alle Inhalte
- ✅ Navigation zwischen Tools mit Content-Wiederherstellung
- ✅ Profilverwaltung mit Avatar-Upload
- ✅ Passwort-Reset

**PX INTERN:**

- ✅ Geräteverwaltung mit Fotos & CSV-Export
- ✅ Verleih-System mit PDF-Erstellung
- ✅ Kalenderansicht
- ✅ Logins, Handyverträge, Kreditkarten, Firmendaten
- ✅ Interne Links mit Kategorien & Favicon-Vorschau
- ✅ Rollen-basierte Zugangskontrolle
- ✅ **Konfigurierbares Dashboard pro User** (Widgets, Link-Kategorien, angeheftete Logins)
- ✅ **Video & Sketch** werden zu `generated_assets` Supabase Storage hochgeladen (permanente URLs)

---

## 📚 Weitere Ressourcen

- [APP_INFO.md](./APP_INFO.md) — Vollständige Feature-Dokumentation
- [README.md](./README.md) — Quick Start Guide
- [Supabase Docs](https://supabase.com/docs) — Offizielle Dokumentation
