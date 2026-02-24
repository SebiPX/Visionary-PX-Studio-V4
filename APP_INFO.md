# Visionary PX Studio

**Visionary PX Studio** ist eine hochmoderne, webbasierte KI-Content-Creation-Suite mit integriertem Inventar-Managementsystem. Sie vereint leistungsstarke generative KI-Modelle von Google (Gemini & Veo) in einer einheitlichen, futuristischen Glassmorphism-Benutzeroberfläche mit vollständiger Supabase-Integration.

---

## 🚀 Features & Möglichkeiten

### 1. 🏠 Dashboard

Zentrale Übersicht aller generierten Inhalte und Schnellzugang zu internen Tools.

- **Funktionen:** Masonry-Grid-Layout mit allen Generierungen (Bilder, Videos, Thumbnails)
- **Tools & Apps:** Eigener Bereich mit direktem Zugang zu PX Inventar
- **Navigation:** Klickbare Karten navigieren direkt zum entsprechenden Tool mit vorgeladenem Content
- **Echtzeit:** Automatisches Laden der neuesten Generierungen aus der Datenbank

### 2. 🎨 Image Gen (Bildgenerator)

Erstellen Sie beeindruckende Bilder aus Textbeschreibungen oder bearbeiten Sie bestehende Bilder.

- **Modelle:** Nutzt `gemini-2.0-flash-exp`.
- **Modi:** Text-to-Image, Image-to-Image (Referenzbild), Inpainting/Edit.
- **Funktionen:** Wählbare Seitenverhältnisse (1:1, 16:9, 9:16), Datenbank-History mit Ein-Klick-Wiederherstellung, Preview & Download.
- **Persistenz:** Alle Generierungen werden in Supabase gespeichert.

### 3. 🎥 Video Studio

Generieren Sie kurze Videoclips in High-Definition.

- **Modelle:** Powered by **Veo 3.1** (Fast & High Quality).
- **Modi:** Text-to-Video und Image-to-Video (Animation statischer Bilder).
- **Kontrolle:** Kamerabewegungen (Pan, Zoom, Tilt, Roll, Orbit), Dauer (2s, 4s, 8s) und Seitenverhältnis.
- **Vorschau:** Integrierter Player für generierte MP4-Dateien mit Preview & Download.
- **Persistenz:** Videos werden mit Thumbnails in Supabase gespeichert.

### 4. 📝 Text Engine

Ein intelligenter Schreibassistent für verschiedene Plattformen.

- **Modelle:** `gemini-2.0-flash-exp`.
- **Plattformen:** YouTube, Instagram, TikTok, Twitter - jeweils mit optimiertem Format.
- **Features:** Kontext-Awareness, Multi-Platform-Generierung, Google Trends Integration, Copy-to-Clipboard.

### 5. 🖼️ Thumbnail Engine

Ein spezialisiertes Tool zum Komponieren von YouTube-Thumbnails.

- **Workflow:** Schrittweise Komposition aus Hintergrund, Hauptelementen und Text-Overlay.
- **KI-Hilfe:** Generiert Ideen für Bildbeschreibungen und catchy Titel-Texte.
- **Features:** Preview & Download, History mit Restore-Funktion.

### 6. 📖 Story Studio

Vollständiger Story-to-Video Workflow mit KI-Unterstützung.

- **Phasen:** Setup → Story → Storyboard → Review
- **Features:** Shot-by-Shot Regenerierung, Bild-Regenerierung, vollständige Story-Persistenz, Export.

### 7. ✏️ Sketch Studio

Verwandeln Sie einfache Skizzen in fotorealistische Bilder mit KI.

- **Features:** Interaktives Canvas, Undo/Redo, Context/Stil-Auswahl, Aspect Ratio, Bild-Editing mit Text, Fullscreen-Preview
- **Modell:** `gemini-2.5-flash-image`
- **Persistenz:** Generiertes Bild wird zu Supabase Storage (`generated_assets/sketches/`) hochgeladen; nur die permanente öffentliche URL wird in `generated_sketches` gespeichert (verhindert Payload-Limits durch base64 in DB)

### 8. 💬 Chat Bot

Ein vielseitiger KI-Assistent mit verschiedenen Persönlichkeiten und RAG-Wissensdatenbank.

- **Personas:** Medien-Analyst, DevX Assistant, Content Stratege, Marketing & SEO Pro, Gemini General, **Onboarding Support**
- **Onboarding Support (RAG):** Nutzt `gemini-embedding-001` um Fragen zu vektorisieren, durchsucht die `onboarding_embeddings` Tabelle via `match_onboarding_docs` RPC und liefert kontextgenaue Antworten aus dem internen Firmenwissen (NTK-Dokument)
- **Seeding:** `scripts/seed-onboarding.mjs` vectorisiert beliebige `.docx`-Dokumente in 768-dim Embeddings
- **Markdown-Rendering:** Alle Bot-Antworten werden als formatiertes Markdown gerendert (Überschriften, Listen, Bold, Inline-Code, Links)
- **History:** Chat-Sessions werden in Supabase gespeichert und können wiederhergestellt werden

### 9. ⚙️ Benutzereinstellungen

- Profil, Avatar (Supabase Storage), Passwort-Reset, Echtzeit-Synchronisation.

---

## 📦 PX INTERN (Integriertes Modul)

Vollständiges internes Teamportal. Zugänglich über das Dashboard → "PX INTERN". Das Modul läuft als eigenständige React-App mit isoliertem Routing (MemoryRouter), teilt sich aber Authentication und Supabase-Client mit dem Studio.

### Module & Seiten

| Seite                | Beschreibung                                                                                                                                                                      | Rollen                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Dashboard**        | **Konfigurierbar pro User** — Interne Links, kommende Ausleihen (14 Tage), aktive Ausleihen, Inventar-Stats, angeheftete Logins. ⚙ "Anpassen"-Button öffnet Konfigurationsdrawer. | Alle                   |
| **Inventar**         | Gerätliste mit Filtern, Suche, Status, Fotos, CSV-Export                                                                                                                          | Alle / Admin: CRUD     |
| **Verleih**          | Aktive & archivierte Ausleihen mit Rückgabe-Funktion                                                                                                                              | Alle / Admin: Aktionen |
| **Verleih-Formular** | Neuen Verleihschein erstellen, Kostenberechnung, PDF                                                                                                                              | Alle                   |
| **Kalender**         | Monatsansicht aller aktiven Ausleihen                                                                                                                                             | Alle                   |
| **Logins**           | Zugangsdaten (z.B. Software-Accounts); einzelne Logins können im Dashboard angeheftet werden                                                                                      | Alle / Admin: CRUD     |
| **Handyverträge**    | Mobilfunkvertrag-Übersicht                                                                                                                                                        | Admin only             |
| **Kreditkarten**     | Kreditkarten-Verwaltung                                                                                                                                                           | Admin only             |
| **Firmendaten**      | Bankverbindung & Handelsregisterdaten                                                                                                                                             | Admin only             |
| **Interne Links**    | Team-Links mit Kategorien, Google Favicon CDN & Buchstaben-Avatar Fallback                                                                                                        | Alle / Admin: CRUD     |

### Dashboard-Konfiguration (pro User)

Jeder User kann über den ⚙ **"Anpassen"** Button sein Dashboard individuell einstellen:

- **Widgets ein-/ausschalten:** Interne Links, Kommende Ausleihen, Aktive Ausleihen, Inventar-Stats
- **Link-Kategorien filtern:** Nur bestimmte Kategorien auf dem Dashboard anzeigen
- **Logins anpinnen:** Ausgewählte Logins erscheinen als "Meine Logins" Widget ganz oben
- **Persistenz:** Konfiguration wird in `inventar_dashboard_config` (Supabase, user-scoped RLS) gespeichert

### Rollen-System

- **user** — Standard-Lesezugriff, eigene Aktionen, eigene Dashboard-Konfiguration
- **admin** — Vollzugriff auf alle Module (definiert via `profiles.role`)

### Navigation

- Zugang über **Dashboard → "PX INTERN"** Karte
- **"Zurück zum Studio"** Button jederzeit sichtbar (oben rechts)
- Eigene Sidebar-Navigation innerhalb des Moduls

---

## 🔐 Authentifizierung & Datenpersistenz

### Supabase Integration

- **Authentifizierung:** Vollständiges Auth-System (Login, Signup, Logout, Password Reset)
- **Datenbank:** PostgreSQL mit Row Level Security (RLS)
- **Storage:** Avatar-Upload & Gerätebild-Upload
- **Rollen:** `profiles.role` steuert Admin-Rechte im Inventar-Modul

### Datenbankstruktur

#### KI Studio

- `profiles` — Benutzerprofile mit Namen, Avatar und Rolle
- `generated_images` — Bildgenerierungen
- `generated_videos` — Videogenerierungen
- `generated_thumbnails` — Thumbnail-Generierungen
- `generated_texts` — Textgenerierungen
- `generated_sketches` — Sketch-to-Image (Bild in Storage, URL in DB)
- `stories` — Story Studio Projekte
- `onboarding_embeddings` — RAG-Vektordatenbank (pgvector 768-dim, `gemini-embedding-001`)

#### PX INTERN

- `inventar_dashboard_config` — Per-User Dashboard-Konfiguration (JSONB, RLS user-scoped)
- `inventar_items` — Geräte & Assets
- `inventar_loans` — Einfache Ausleihen
- `inventar_verleihscheine` — Verleihscheine (Header)
- `inventar_verleihschein_items` — Verleihschein-Positionen
- `inventar_logins` — Zugangsdaten
- `inventar_handyvertraege` — Mobilfunkverträge
- `inventar_kreditkarten` — Kreditkarten
- `inventar_firmendaten` — Firmendaten
- `inventar_links` — Interne Team-Links

---

## 🛠️ Technische Voraussetzungen

1.  **Google Gemini API Key** — [Google AI Studio](https://aistudio.google.com/) (Billing erforderlich für Veo)
2.  **Supabase Projekt** — Projekt-URL und Anon Key
3.  **Node.js 18+**

---

## 💻 Installation & Start

```bash
# Dependencies installieren
npm install

# .env.local anlegen
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

# Entwicklungsserver starten
npm run dev
```

App öffnen: `http://localhost:3000`

---

## 📂 Projektstruktur

```text
/
├── index.html
├── App.tsx                      # Hauptlayout & View-Switching
├── types.ts                     # AppView Enum
├── components/
│   ├── Navigation.tsx           # Sidebar Navigation
│   ├── Dashboard.tsx            # Startseite mit Content-Grid & Tools-Bereich
│   ├── InventarApp.tsx          # PX Inventar Wrapper (MemoryRouter)
│   ├── Inventar/                # PX Inventar Modul
│   │   ├── types/               # TypeScript Interfaces
│   │   ├── lib/                 # Supabase Client
│   │   ├── hooks/               # 9 Custom Hooks (useInventar, useLoans, useLinks…)
│   │   ├── components/          # UI Komponenten (Sidebar, Tables, Forms, Modal…)
│   │   └── pages/               # 10 Seiten (Dashboard, Inventar, Verleih, Links…)
│   ├── ImageGen/
│   ├── VideoStudio.tsx
│   ├── TextEngine.tsx
│   ├── ThumbnailEngine/
│   ├── StoryStudio/
│   ├── SketchStudio/
│   ├── ChatBot.tsx
│   ├── Settings.tsx
│   └── auth/
├── contexts/
│   └── AuthContext.tsx           # Auth State & Profile
├── hooks/
│   └── useGeneratedContent.tsx
├── lib/
│   ├── supabaseClient.ts
│   └── database.types.ts
└── .sql/
    ├── schema.sql
    └── storage_policies.sql
```

---

## 🎨 Design & UX

Das Design-Thema ist **Cyberpunk / Futuristic Glassmorphism**:

- **Farben:** Dunkle Hintergründe (`#101622`), leuchtendes Blau (`#135bec`) als Primärfarbe.
- **Effekte:** Backdrop-Blur (Glass), Neon-Glow Schatten, sanfte Animationen.
- **Icons:** Material Icons Rounded (Studio) & Lucide React (Inventar).

---

## 📚 Weitere Dokumentation

- [README.md](./README.md) — Schnellstart & Deployment
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) — Datenbank Setup

---

_Visionary PX Studio - Create the Future._
