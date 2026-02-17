# CLAUDE.md – Projekt-Kontext fuer Claude Code Sessions

> Diese Datei dient als persistenter Kontext zwischen Claude Code Sessions.
> Sie ist NICHT Teil der Software und wird via .gitignore ausgeschlossen.

---

## Projekt: NUCLEA

**Beschreibung:** Objektives Bewertungssystem fuer akademische Arbeiten mit Talent-Profil-Erstellung und Entwicklungsplaenen.

**Zielgruppe:** Lehrer, Schulleiter, Admins

**Version:** MVP (V0.1)

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Sprache:** TypeScript
- **UI:** Tailwind CSS v4, Radix UI, Lucide Icons, Recharts
- **LLM:** Anthropic SDK (Claude), alternativ OpenAI
- **Themes:** next-themes (Dark/Light Mode)
- **Legacy:** Streamlit-Version unter `/legacy/`

---

## Projektstruktur

```
nuclea/
├── CLAUDE.md                  ← Diese Datei (Kontext fuer Claude)
├── src/
│   ├── app/
│   │   ├── (dashboard)/       ← Hauptseiten (Dashboard, Analyze, Classes, Students, Settings, Mental-Monitoring, Talent-Matching)
│   │   ├── api/analyze/       ← API Route fuer Analyse
│   │   ├── layout.tsx         ← Root Layout
│   │   └── page.tsx           ← Startseite (Redirect)
│   ├── components/
│   │   ├── analysis/          ← Analyse-Ergebnis-Ansicht, Rubric-Chart, Score-Cards, Talent-Matrix, Mental-Monitoring-Overview
│   │   ├── layout/            ← Sidebar (Hexagon-Logo), Header, Theme-Provider, Theme-Toggle
│   │   └── ui/                ← Wiederverwendbare UI-Komponenten (Button, Card, Badge, etc.)
│   └── lib/
│       ├── analysis/          ← Pipeline, Prompts, Mental-Monitoring-Keywords
│       ├── demo-data.ts       ← Demo-Daten fuer Entwicklung
│       ├── types.ts           ← Alle TypeScript-Typen
│       └── utils.ts           ← Hilfsfunktionen
├── legacy/                    ← Alte Streamlit-Version (app.py, analysis.py)
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

---

## Kernfeatures (implementiert)

1. **Dashboard** – Uebersicht mit Stats (Schueler, Analysen, Klassen, Durchschnitt)
2. **Analyse-Seite** – Text einfuegen/hochladen → LLM-basierte Bewertung
3. **Rubrik-Bewertung** – 5 Dimensionen (Struktur, Klarheit, Evidenz, Originalitaet, Kohaerenz), je 0-5
4. **Kognitives Profil** – Staerken, Wachstumsbereiche, kognitives Muster
5. **Talent-Identifikation** – Indikatoren, passende Domaenen, Entwicklungsfokus
6. **Mental Monitoring** – Optional, Keyword-basiert + LLM (umbenannt von Wellbeing)
7. **Klassen-Verwaltung** – Klassen anlegen und verwalten
8. **Schueler-Profile** – Detail-Ansicht mit Analyse-Historie
9. **Einstellungen** – API-Key, Modell, Modus
10. **Dark/Light Mode** – Theme-Toggle

---

## Datenmodelle (src/lib/types.ts)

- `School`, `UserProfile` (admin/principal/teacher)
- `ClassData`, `Student`, `Work`, `Analysis`
- `AnalysisResult` mit `RubricResult`, `TalentFocus`, `WellbeingResult`
- `DashboardStats`, `RecentAnalysis`

---

## Wichtige Regeln fuer Claude

1. **IMMER nach jedem groesseren Feature committen UND pushen** – nie warten bis Session-Ende
2. **Zwischen-Commits** nach ca. 15-20 Minuten Arbeit oder nach jedem abgeschlossenen Feature
3. **Diese Datei aktualisieren** wenn sich der Projektstatus aendert
4. **Deutsche Sprache** in der Kommunikation mit dem User
5. **Code-Kommentare** auf Englisch
6. **Session-Log Pflicht:** Bei jedem Session-Eintrag IMMER Datum UND Uhrzeit (UTC) angeben
7. **Letzter Stand:** Am Ende jeder Session Datum+Uhrzeit des letzten Commits aktualisieren

---

## Session-Log

### Session 1 (Datum unbekannt)
- Kompletter Umbau von Streamlit → Next.js
- Dashboard, Analyse, Klassen, Schueler, Einstellungen angelegt
- UI-Komponenten erstellt (Sidebar, Header, Cards, etc.)
- Analyse-Pipeline mit Prompts implementiert
- Demo-Daten angelegt

### Session 2 (2026-02-17, Uhrzeit unbekannt)
- Code von Branch `claude/review-project-repo-O1MzI` gerettet
- Auf `claude/resume-session-ArKCr` gemergt und gepusht
- CLAUDE.md angelegt fuer persistenten Kontext

### Session 3 (2026-02-17, Uhrzeit unbekannt)
- **Deployment:** Live auf Vercel unter nuclea-eight.vercel.app
- **Dark Mode Fix:** ThemeToggle Hydration-Bug behoben (mounted state check), Dark-Mode CSS-Variablen verbessert (mehr Kontrast, tiefere Hintergruende)
- **Logo Redesign:** Neues geometrisches Hexagon-Logo im Palantir-Stil (SVG) mit "NUCLEA Intelligence" Branding
- **Score Breakdown Fix:** Zahlen-Overlap behoben — von 5-Spalten-Grid auf vertikale Liste umgestellt mit inline Progress-Bars
- **Talent Matrix NEU:** Eigene Career Domain Fit Matrix Komponente (`talent-matrix.tsx`) — berechnet Karriere-Passung (Tech, Sciences, Humanities, Arts, Business, Law) basierend auf Rubric-Scores mit gewichteten Dimensionen, visuellen Balken und Score-Beitrag
- **Wellbeing Assessment NEU:** Eigene Wellbeing-Overview Komponente (`wellbeing-overview.tsx`) — Signal-Level-Gauge, Assessment-Note, Empfohlene Aktionen, Disclaimer
- **File Upload:** Drag & Drop Zone auf der Analyze-Seite implementiert — unterstuetzt TXT (direkt gelesen), PDF/DOCX/Images (vorbereitet fuer spaetere Text-Extraktion)
- **Analyse-Result-View:** Talent-Tab komplett ueberarbeitet mit neuer Matrix + Development Roadmap

### Session 4 (2026-02-17, ~19:00–20:24 UTC)
- **Next.js Upgrade:** 15.1 → 16.1.6 (Vercel Security-Block behoben)
- **tsconfig.json:** Fuer Next.js 16 Kompatibilitaet angepasst
- **Wellbeing → Mental Monitoring:** Komplettes Renaming durchgefuehrt (Komponenten, Keywords, Prompts, Types, Sidebar)
- **3-Level Analysis Mode:** Analyse-Tiefe konfigurierbar (Quick/Standard/Deep) auf der Analyze-Seite
- **Neue Beta-Seiten:** Mental Monitoring (`/mental-monitoring`) und Talent Matching (`/talent-matching`) als eigenstaendige Seiten in der Sidebar
- **Dark Mode:** Weitere Verbesserungen an CSS-Variablen und Kontrast
- **Pull Request:** PR erstellt zum Merge von `claude/resume-session-ArKCr` → `main`
- **Letzte Commits:** df3ccfb → bcfdbf5 (5 Commits in dieser Session)

---

## Naechste Schritte / Offene TODOs

- [ ] Datenbank-Anbindung (Supabase?)
- [ ] Authentifizierung
- [ ] Echte API-Integration (statt Demo-Daten)
- [x] File-Upload (Drag & Drop) im Frontend — MVP fertig, Text-Extraktion fuer PDF/DOCX/Images noch offen
- [ ] PDF/DOCX Text-Extraktion (Server-seitig)
- [ ] Image OCR Integration
- [ ] Email-Eingang (school@nuclea.com → automatischer Import)
- [ ] Schueler-Profil Erstellung ("Create Profile" Button)
- [ ] Fortschritts-Tracking ueber Zeit
- [x] Deployment-Setup (Vercel) — Live!
- [ ] Custom Domain fuer Vercel
- [ ] ANTHROPIC_API_KEY in Vercel Environment Variables setzen

---

## Produkt-Vision / Ideen

- **Email-Upload:** Schueler schicken Arbeiten an school@nuclea.com → automatisch entpackt und verarbeitet
- **Talent-Matrix:** Laengerfristig ueber mehrere Arbeiten hinweg aggregieren, nicht nur einzelne Analyse
- **Fortschritts-Grafiken:** Zeitliche Entwicklung der Scores pro Schueler visualisieren
- **Export:** PDF-Reports pro Schueler/Klasse generieren

---

## Hinweise

- `.env.example` zeigt benoetigte Umgebungsvariablen
- DevContainer ist konfiguriert (Port 3000)
- Legacy-Code (Streamlit) liegt unter `/legacy/` als Referenz
- **Deployment:** Vercel, Branch `claude/resume-session-ArKCr`
- **Pull Request:** PR offen zum Merge nach `main` — nach Merge ist `main` der aktive Branch
- **Letzter Stand (2026-02-17, 20:24 UTC):** Next.js 16.1.6, alle Features funktional, 22 Dateien geaendert seit main
