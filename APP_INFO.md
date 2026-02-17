# Visionary PX Studio

**Visionary PX Studio** ist eine hochmoderne, webbasierte KI-Content-Creation-Suite. Sie vereint leistungsstarke generative KI-Modelle von Google (Gemini & Veo) in einer einheitlichen, futuristischen Glassmorphism-Benutzeroberfläche mit vollständiger Supabase-Integration für Authentifizierung und Datenpersistenz.

Diese Anwendung ermöglicht Kreativen, Bilder, Videos, Texte, Geschichten und YouTube-Thumbnails in professioneller Qualität zu erstellen und wird durch einen intelligenten Chat-Assistenten unterstützt.

---

## 🚀 Features & Möglichkeiten

### 1. 🏠 Dashboard
Zentrale Übersicht aller generierten Inhalte.
*   **Funktionen:** Masonry-Grid-Layout mit allen Generierungen (Bilder, Videos, Thumbnails)
*   **Navigation:** Klickbare Karten navigieren direkt zum entsprechenden Tool mit vorgeladenem Content
*   **Echtzeit:** Automatisches Laden der neuesten Generierungen aus der Datenbank

### 2. 🎨 Image Gen (Bildgenerator)
Erstellen Sie beeindruckende Bilder aus Textbeschreibungen oder bearbeiten Sie bestehende Bilder.
*   **Modelle:** Nutzt `gemini-2.0-flash-exp`.
*   **Modi:** Text-to-Image, Image-to-Image (Referenzbild), Inpainting/Edit.
*   **Funktionen:** Wählbare Seitenverhältnisse (1:1, 16:9, 9:16), Datenbank-History mit Ein-Klick-Wiederherstellung, Preview & Download.
*   **Persistenz:** Alle Generierungen werden in Supabase gespeichert.

### 3. 🎥 Video Studio
Generieren Sie kurze Videoclips in High-Definition.
*   **Modelle:** Powered by **Veo 3.1** (Fast & High Quality).
*   **Modi:** Text-to-Video und Image-to-Video (Animation statischer Bilder).
*   **Kontrolle:** Kamerabewegungen (Pan, Zoom, Tilt, Roll, Orbit), Dauer (2s, 4s, 8s) und Seitenverhältnis.
*   **Vorschau:** Integrierter Player für generierte MP4-Dateien mit Preview & Download.
*   **Persistenz:** Videos werden mit Thumbnails in Supabase gespeichert.

### 4. 📝 Text Engine
Ein intelligenter Schreibassistent für verschiedene Plattformen.
*   **Modelle:** `gemini-2.0-flash-exp`.
*   **Plattformen:** YouTube, Instagram, TikTok, Twitter - jeweils mit optimiertem Format.
*   **Features:** 
    - Kontext-Awareness (schreibt basierend auf vorherigem Text weiter)
    - Multi-Platform-Generierung (alle Plattformen gleichzeitig)
    - Google Trends Integration für aktuelle Themen
    - Copy-to-Clipboard mit visuellem Feedback
*   **Persistenz:** Texte werden mit Plattform-Info gespeichert.

### 5. 🖼️ Thumbnail Engine
Ein spezialisiertes Tool zum Komponieren von YouTube-Thumbnails.
*   **Workflow:** Schrittweise Komposition aus Hintergrund, Hauptelementen und Text-Overlay.
*   **KI-Hilfe:** Generiert auf Wunsch Ideen für Bildbeschreibungen oder catchy Titel-Texte basierend auf dem Video-Thema.
*   **Layering:** Die KI fügt Hintergrund, Vordergrund und Typografie zu einem kohärenten Bild zusammen.
*   **Features:** Preview & Download, History mit Restore-Funktion.

### 6. 📖 Story Studio
Vollständiger Story-to-Video Workflow mit KI-Unterstützung.
*   **Phasen:**
    1. **Setup:** Genre, Stil, Dauer, Charaktere definieren
    2. **Story:** KI generiert vollständige Geschichte basierend auf Setup
    3. **Storyboard:** Automatische Aufteilung in Shots mit Bildern
    4. **Review:** Vorschau und Export
*   **Features:**
    - Shot-by-Shot Regenerierung
    - Bild-Regenerierung für einzelne Shots
    - Vollständige Story-Persistenz
    - Export-Funktionen

### 7. ✏️ Sketch Studio
Verwandeln Sie einfache Skizzen in fotorealistische Bilder mit KI.
*   **Workflow:** Zeichnen → Generieren → Verfeinern
*   **Features:**
    - Interaktives Canvas mit Stift/Radierer-Tools
    - Undo/Redo-Funktionalität
    - Context-Auswahl (Human, Animal, Object, Landscape, Architecture)
    - Stil-Optionen (Cinematic, Photorealistic, Artistic, Sketch, Cartoon)
    - Aspect Ratio Auswahl (1:1, 16:9, 9:16)
    - Bild-Editing mit Textanweisungen
    - Fullscreen-Preview mit Download
*   **Modell:** `gemini-2.5-flash-image` für optimale Sketch-to-Image Transformation
*   **Persistenz:** Sketches und generierte Bilder werden in Supabase gespeichert
*   **History:** Sidebar mit allen generierten Sketches, Ein-Klick-Wiederherstellung

### 8. 💬 Chat Bot
Ein vielseitiger KI-Assistent mit verschiedenen Persönlichkeiten.
*   **Personas:**
    *   *Creative Partner:* Für Brainstorming und Art Direction.
    *   *Tech Expert:* Für Code und technische Fragen.
    *   *Marketing Guru:* Für Strategie und Social Media Wachstum.
    *   *Visionary AI:* Allgemeiner Assistent.
*   **Funktion:** Behält den Kontext innerhalb der Sitzung bei.

### 9. ⚙️ Benutzereinstellungen
*   **Profil:** Ändern Sie Ihren Namen und E-Mail.
*   **Avatar:** Wählen Sie aus futuristischen Presets oder laden Sie ein eigenes Bild hoch (Supabase Storage).
*   **Passwort:** Sicheres Passwort-Reset-System mit E-Mail-Verifizierung.
*   **Global State:** Änderungen werden sofort in der gesamten App reflektiert.

---

## 🔐 Authentifizierung & Datenpersistenz

### Supabase Integration
*   **Authentifizierung:** Vollständiges Auth-System (Login, Signup, Logout, Password Reset)
*   **Datenbank:** PostgreSQL mit Row Level Security (RLS)
*   **Storage:** Avatar-Upload mit sicherer Speicherung
*   **Echtzeit:** Automatische Synchronisation aller Generierungen

### Datenbankstruktur
*   `profiles` - Benutzerprofile mit Namen und Avatar
*   `generated_images` - Alle Bildgenerierungen
*   `generated_videos` - Alle Videogenerierungen
*   `generated_thumbnails` - Alle Thumbnail-Generierungen
*   `generated_texts` - Alle Textgenerierungen
*   `stories` - Story Studio Projekte

---

## 🛠️ Technische Voraussetzungen

Um diese App auszuführen, benötigen Sie:

1.  **Google Gemini API Key:**
    *   Sie benötigen einen gültigen API Key von [Google AI Studio](https://aistudio.google.com/).
    *   **Wichtig:** Für die Videogenerierung (Veo) ist ein API Key aus einem Projekt mit **aktiviertem Billing** (GCP) erforderlich.

2.  **Supabase Projekt:**
    *   Kostenloses Supabase-Konto auf [supabase.com](https://supabase.com)
    *   Projekt-URL und Anon Key
    *   Siehe [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) für Details

3.  **Node.js & npm:**
    *   Node.js 18+ für lokale Entwicklung
    *   npm für Paketmanagement

---

## 💻 Installation & Start

### Schnellstart

1. **Repository klonen und Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Umgebungsvariablen konfigurieren:**
   Erstellen Sie `.env.local` mit:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

4. **App öffnen:**
   Navigieren Sie zu `http://localhost:3000`

### Erste Schritte
1. Erstellen Sie ein Konto über "Sign Up"
2. Loggen Sie sich ein
3. Beginnen Sie mit der Content-Erstellung!

---

## 📂 Projektstruktur

```text
/
├── index.html              # Einstiegspunkt
├── index.tsx               # React Bootstrapping
├── App.tsx                 # Hauptlayout & Routing
├── .env.local              # Umgebungsvariablen (nicht im Repo)
├── package.json            # Dependencies
├── vite.config.ts          # Vite Konfiguration
├── README.md               # Schnellstart-Anleitung
├── APP_INFO.md             # Diese Dokumentation
├── SUPABASE_INTEGRATION.md # Supabase Setup Guide
│
├── components/             # UI Komponenten
│   ├── Navigation.tsx      # Sidebar Navigation
│   ├── Dashboard.tsx       # Startseite mit Content-Grid
│   ├── ImageGen.tsx        # Bildgenerator
│   │   ├── components/     # Sub-Komponenten (vorbereitet)
│   │   └── types.ts        # TypeScript Interfaces
│   ├── VideoStudio.tsx     # Video Editor
│   ├── TextEngine.tsx      # Text Generator
│   ├── ThumbnailEngine.tsx # Thumbnail Composer
│   │   ├── components/     # Extrahierte Tool-Komponenten
│   │   │   ├── BackgroundTool.tsx
│   │   │   ├── ElementsTool.tsx
│   │   │   └── TextTool.tsx
│   │   └── types.ts        # Shared Interfaces
│   ├── StoryStudio.tsx     # Story-to-Video Workflow
│   │   └── phases/         # Workflow-Phasen
│   │       ├── SetupPhase.tsx
│   │       ├── StoryPhase.tsx
│   │       ├── StoryboardPhase.tsx
│   │       └── ReviewPhase.tsx
│   ├── ChatBot.tsx         # Chat Interface
│   ├── Settings.tsx        # Benutzereinstellungen
│   └── auth/               # Authentifizierung
│       ├── AuthPage.tsx    # Auth Container
│       ├── Login.tsx       # Login Form
│       ├── Signup.tsx      # Signup Form
│       └── ResetPassword.tsx # Password Reset
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.tsx         # Authentifizierung Hook
│   └── useGeneratedContent.tsx # Content Persistenz Hook
│
├── lib/                    # Utilities & Config
│   ├── supabaseClient.ts   # Supabase Client Setup
│   └── database.types.ts   # Datenbank TypeScript Types
│
└── .sql/                   # SQL Migrations
    ├── schema.sql          # Datenbank Schema
    └── storage_policies.sql # Storage RLS Policies
```

---

## 🎨 Design & UX

Die App nutzt **Tailwind CSS** für das Styling. Das Design-Thema ist "Cyberpunk / Futuristic Glassmorphism":
*   **Farben:** Dunkle Hintergründe (`#101622`), leuchtendes Blau (`#135bec`) als Primärfarbe.
*   **Effekte:** Backdrop-Blur (Glass), Neon-Glow Schatten, sanfte Animationen.
*   **Responsivität:** Die App passt sich nahtlos an Desktop- und mobile Bildschirme an.
*   **Icons:** Material Icons Rounded für konsistente Iconographie.

---

## 🏗️ Code-Organisation

Die Codebase folgt modernen Best Practices:
*   **Klare Struktur:** Komponenten sind in logische Sections unterteilt (State, Handlers, Effects)
*   **Modularer Aufbau:** Große Komponenten werden schrittweise in kleinere Module aufgeteilt
*   **TypeScript:** Vollständige Type-Safety mit Interfaces
*   **Hooks:** Wiederverwendbare Logik in Custom Hooks
*   **Dokumentation:** Inline-Kommentare und separate Docs

---

## 📚 Weitere Dokumentation

- [README.md](./README.md) - Schnellstart & Deployment
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Datenbank Setup
- [Refactoring Analysis](file:///Users/px-admin/.gemini/antigravity/brain/b706ba97-4701-41b3-ba6f-2b81e7641657/refactoring_analysis.md) - Code-Verbesserungen
- [Code Organization Walkthrough](file:///Users/px-admin/.gemini/antigravity/brain/b706ba97-4701-41b3-ba6f-2b81e7641657/code_organization_walkthrough.md) - Aktuelle Verbesserungen

---

*Visionary PX Studio - Create the Future.*
