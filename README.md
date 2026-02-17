# Visionary PX Studio

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**Eine hochmoderne KI-Content-Creation-Suite mit Supabase-Integration**

Visionary PX Studio vereint Google's leistungsstärkste KI-Modelle (Gemini & Veo) in einer futuristischen Glassmorphism-Benutzeroberfläche. Erstellen Sie Bilder, Videos, Texte, Geschichten und Thumbnails - alles mit vollständiger Authentifizierung und Datenpersistenz.

---

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+
- Supabase Account (kostenlos)
- Google Gemini API Key

### Installation

1. **Repository klonen:**
   ```bash
   git clone <your-repo-url>
   cd visionary-px-studio
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren:**
   
   Erstellen Sie `.env.local` im Hauptverzeichnis:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

5. **App öffnen:**
   Navigieren Sie zu `http://localhost:3000`

---

## ✨ Features

### 🏠 **Dashboard**
- Masonry-Grid mit allen Generierungen
- Klickbare Karten für direkte Navigation
- Echtzeit-Updates aus Supabase

### 🎨 **Image Gen**
- Text-to-Image, Image-to-Image, Inpainting
- Gemini 2.0 Flash Exp
- Mehrere Seitenverhältnisse
- Preview & Download

### 🎥 **Video Studio**
- Veo 3.1 Fast & High Quality
- Text-to-Video & Image-to-Video
- Kamerabewegungen, Dauer-Kontrolle
- Video-Player mit Preview

### 📝 **Text Engine**
- Multi-Platform (YouTube, Instagram, TikTok, Twitter)
- Google Trends Integration
- Batch-Generierung
- Copy-to-Clipboard

### 🖼️ **Thumbnail Engine**
- 3-Schritt Workflow (Background, Elements, Text)
- KI-Ideen-Generator
- Layer-Komposition
- Preview & Download

### 📖 **Story Studio**
- 4-Phasen Workflow (Setup, Story, Storyboard, Review)
- KI-Story-Generierung
- Shot-by-Shot Bilder
- Regenerierungs-Optionen

### ✏️ **Sketch Studio**
- Sketch-to-Image Transformation
- Interaktives Drawing Canvas
- Context & Style Auswahl
- Aspect Ratio Kontrolle (1:1, 16:9, 9:16)
- Bild-Editing mit Textanweisungen
- History mit Wiederherstellung

### 💬 **Chat Bot**
- 4 Personas (Creative, Tech, Marketing, General)
- Kontext-Awareness
- Streaming-Antworten

### ⚙️ **Settings**
- Profilverwaltung
- Avatar-Upload (Supabase Storage)
- Passwort-Reset
- Echtzeit-Synchronisation

---

## 🔐 Authentifizierung

Vollständiges Auth-System powered by Supabase:
- ✅ Email/Password Login & Signup
- ✅ Passwort-Reset mit E-Mail-Verifizierung
- ✅ Session-Persistenz
- ✅ Row Level Security (RLS)

Siehe [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) für Details.

---

## 📊 Datenbank

Alle Generierungen werden in Supabase PostgreSQL gespeichert:
- `profiles` - Benutzerprofile
- `generated_images` - Bildgenerierungen
- `generated_videos` - Videogenerierungen
- `generated_thumbnails` - Thumbnails
- `generated_texts` - Texte
- `generated_sketches` - Sketch-to-Image Generierungen
- `stories` - Story Studio Projekte

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **AI:** Google Gemini 2.0, Veo 3.1
- **Icons:** Material Icons Rounded

---

## 📚 Dokumentation

- [APP_INFO.md](./APP_INFO.md) - Ausführliche Feature-Beschreibung
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Datenbank Setup Guide
- [Refactoring Analysis](file:///Users/px-admin/.gemini/antigravity/brain/b706ba97-4701-41b3-ba6f-2b81e7641657/refactoring_analysis.md) - Code-Architektur

---

## 🎨 Design

Cyberpunk / Futuristic Glassmorphism:
- Dunkle Hintergründe (#101622)
- Neon-Blau Primary (#135bec)
- Backdrop-Blur Effekte
- Smooth Animations
- Vollständig Responsive

---

## 📝 Lizenz

Dieses Projekt ist für Demonstrationszwecke erstellt.

---

**Visionary PX Studio** - Create the Future with AI 🚀
