# CLAUDE.md – Projekt-Kontext fuer Claude Code Sessions

> Diese Datei dient als persistenter Kontext zwischen Claude Code Sessions.
> Sie ist NICHT Teil der Software und wird via .gitignore ausgeschlossen.

---

## Projekt: NUCLEA

**Beschreibung:** NUCLEA ist ein KI-gestuetztes, objektives Bewertungssystem fuer akademische Arbeiten. Es analysiert Schueler-Texte (Essays, Pruefungen, Hausaufgaben, Projekte) mithilfe von LLMs und erstellt daraus:
- **Rubrik-Bewertungen** in 5 Dimensionen (0-5 Punkte)
- **Kognitive Profile** (Staerken, Wachstumsbereiche, Muster)
- **Talent-Identifikation** mit Karriere-Domaenen-Passung
- **Mental Monitoring** (optionale Erkennung von Wellbeing-Signalen)
- **Individuelle Entwicklungsplaene**

**Kernidee:** Lehrer laden Schueler-Arbeiten hoch → NUCLEA analysiert automatisch → objektive, datengetriebene Einblicke in Faehigkeiten und Potenzial jedes Schuelers.

**Zielgruppe:** Lehrer, Schulleiter, Admins

**Version:** MVP (V0.1)

**Live:** nuclea-eight.vercel.app

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Sprache:** TypeScript
- **UI:** Tailwind CSS v4, Radix UI (Dialog, Select, Switch, Tabs, Tooltip, Separator), Lucide Icons, Recharts
- **LLM:** Anthropic SDK (Claude), alternativ OpenAI
- **Datenbank:** Supabase (vorbereitet, Dual-Mode: Demo-Daten oder Live)
- **Auth:** Supabase Auth (vorbereitet, Login-Seite vorhanden)
- **Themes:** next-themes (Dark/Light Mode, Default: Dark)
- **Design-Sprache:** Palantir-inspiriert (geometrisches Hexagon-Logo, blau-violette Primaerfarbe, tiefe Dark-Mode-Hintergruende, subtile Animationen)
- **Legacy:** Streamlit-Version unter `/legacy/`

---

## Projektstruktur

```
nuclea/
├── CLAUDE.md                  ← Diese Datei (Kontext fuer Claude)
├── src/
│   ├── app/
│   │   ├── (dashboard)/       ← Hauptseiten
│   │   │   ├── dashboard/     ← Stats-Uebersicht
│   │   │   ├── analyze/       ← Text hochladen → LLM-Analyse
│   │   │   ├── classes/       ← Klassen-Grid + Add Class Modal
│   │   │   ├── students/      ← Schueler-Liste + Add Student Modal
│   │   │   ├── settings/      ← API-Key, Modell, Modus
│   │   │   ├── mental-monitoring/    ← Beta-Seite
│   │   │   ├── talent-matching/      ← Beta-Seite
│   │   │   ├── individual-development/ ← Beta-Seite
│   │   │   └── layout.tsx     ← Dashboard Layout (Sidebar + Main)
│   │   ├── api/
│   │   │   ├── analyze/       ← POST: LLM-Analyse ausfuehren
│   │   │   ├── classes/       ← GET: Liste, POST: Erstellen
│   │   │   ├── students/      ← GET: Liste, POST: Erstellen
│   │   │   ├── dashboard/     ← GET: Stats
│   │   │   ├── works/         ← GET: Arbeiten eines Schuelers
│   │   │   └── auth/          ← Login, Logout, Register
│   │   ├── login/             ← Login-Seite
│   │   ├── layout.tsx         ← Root Layout (ThemeProvider)
│   │   ├── page.tsx           ← Startseite (Redirect → /dashboard)
│   │   └── globals.css        ← Theme-Tokens (Light + Dark)
│   ├── components/
│   │   ├── analysis/          ← Analyse-Ergebnis-Ansicht, Rubric-Chart, Score-Cards, Talent-Matrix, Mental-Monitoring-Overview
│   │   ├── layout/            ← Sidebar (Hexagon-Logo), Header, Theme-Provider, Theme-Toggle
│   │   └── ui/                ← Wiederverwendbare UI-Komponenten:
│   │       ├── button.tsx     ← CVA-Varianten (default, outline, ghost, etc.)
│   │       ├── card.tsx       ← Card, CardHeader, CardTitle, CardContent, CardDescription
│   │       ├── badge.tsx      ← default, secondary, destructive, success, warning
│   │       ├── dialog.tsx     ← Radix Dialog mit Overlay, Close-Button, Header/Footer
│   │       ├── input.tsx      ← Standard-Input mit Focus-Ring
│   │       ├── select.tsx     ← Radix Select mit Trigger, Content, Items
│   │       ├── skeleton.tsx   ← Palantir-Stil Skeleton-Loader (Dashboard, Students, Classes)
│   │       ├── progress.tsx   ← Fortschrittsbalken
│   │       ├── switch.tsx     ← Toggle
│   │       ├── tabs.tsx       ← Tab-Navigation
│   │       ├── tooltip.tsx    ← Hover-Tooltips
│   │       └── separator.tsx  ← Trennlinie
│   └── lib/
│       ├── analysis/          ← Pipeline, Prompts, Mental-Monitoring-Keywords
│       ├── data/index.ts      ← Data Access Layer (Dual-Mode: Demo oder Supabase)
│       ├── supabase/          ← Supabase Client (Server + Client)
│       ├── demo-data.ts       ← Demo-Daten (8 Schueler, 3 Klassen, Analysen)
│       ├── types.ts           ← Alle TypeScript-Typen
│       └── utils.ts           ← cn() Hilfsfunktion (clsx + twMerge)
├── legacy/                    ← Alte Streamlit-Version (app.py, analysis.py)
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

---

## Kernfeatures (implementiert)

1. **Dashboard** – Uebersicht mit Stats (Schueler, Analysen, Klassen, Durchschnitt), Recent Analyses, Classes-Uebersicht
2. **Analyse-Seite** – Text einfuegen oder Datei hochladen (Drag & Drop) → LLM-basierte Bewertung mit konfigurierbarer Tiefe (Quick/Standard/Deep)
3. **Rubrik-Bewertung** – 5 Dimensionen (Structure, Clarity, Evidence, Originality, Coherence), je 0-5
4. **Kognitives Profil** – Staerken, Wachstumsbereiche, kognitives Muster
5. **Talent-Identifikation** – Career Domain Fit Matrix (Tech, Sciences, Humanities, Arts, Business, Law), gewichtete Berechnung aus Rubric-Scores
6. **Mental Monitoring** – Optional, Keyword-basiert + LLM, Signal-Level-Gauge (none/mild/flag)
7. **Klassen-Verwaltung** – Grid-Ansicht + "Add Class" Modal mit Formular
8. **Schueler-Verwaltung** – Liste mit Suche + "Add Student" Modal mit Klassen-Auswahl
9. **Schueler-Profile** – Detail-Ansicht mit Analyse-Historie
10. **Einstellungen** – API-Key, Modell, Modus
11. **Dark/Light Mode** – Theme-Toggle (Default: Dark)
12. **Skeleton-Loader** – Palantir-Stil Loading-Animationen fuer Dashboard, Students, Classes
13. **Login-Seite** – Demo-Credentials (admin@nuclea.app / demo123)

---

## Design-System (Palantir-Stil)

### Farben
- **Primary:** Blau-Violett — `oklch(0.45 0.18 264)` (Light) / `oklch(0.62 0.22 264)` (Dark)
- **Background Dark:** Tiefes Blau-Schwarz — `oklch(0.10 0.005 264)`
- **Cards Dark:** Leicht heller — `oklch(0.14 0.008 264)`
- **Success:** Gruen, **Destructive:** Rot, **Warning:** Gelb-Orange
- **Border-Radius:** 0.625rem (10px)

### Logo
- Geometrisches Hexagon im Palantir-Stil (SVG in sidebar.tsx)
- Aeusseres Hexagon + innere Raute + Strahlenlinien + Zentrum-Punkt
- Text: "NUCLEA" (tracking-widest) + "Intelligence" (tracking-wider)

### Komponenten-Stil
- Rounded corners (10px), subtile Schatten (shadow-sm)
- Hover: Border/Text wechselt zu Primary
- Focus: Ring in Primary-Farbe
- Score-Farben: Gruen (>=4), Gelb (>=3), Rot (<3)
- Skeletons: bg-primary/5 (Light) / bg-primary/10 (Dark) mit pulse-Animation

### Font
- Inter, system-ui, -apple-system, sans-serif

---

## Datenmodelle (src/lib/types.ts)

### Core
- `School` — id, name, slug
- `UserProfile` — id, email, full_name, role (admin/principal/teacher), school_id
- `ClassData` — id, school_id, teacher_id, name, grade_level, academic_year, student_count
- `Student` — id, class_id, first_name, last_name, student_code, date_of_birth, notes, class_name, works_count, last_analysis_at, avg_scores
- `Work` — id, student_id, title, work_type (essay/exam/homework/project/other), original_text, file_name
- `Analysis` — id, work_id, mode, score_[structure/clarity/evidence/originality/coherence], result_json, mental_monitoring_enabled/level, talent_json

### Analysis Result
- `RubricScores` — structure, clarity, evidence, originality, coherence (je 0-5)
- `RubricResult` — scores + justifications
- `TalentFocus` — talent, rationale, next_steps[]
- `MentalMonitoringResult` — level (none/mild/flag), note, next_step
- `AnalysisResult` — rubric, strengths[], growth_areas[], cognitive_pattern, development_plan[], talent_indicators[], matching_domains[], learning_recommendations[], talent_development_focus[], mental_monitoring

### API Requests
- `AnalyzeRequest` — student_id, work_title, work_type, text, analysis_mode, mental_monitoring_enabled
- `CreateStudentRequest` — class_id, first_name, last_name, student_code?, date_of_birth?, notes?

---

## Dual-Mode Data Layer (src/lib/data/index.ts)

NUCLEA laeuft in zwei Modi:
- **Demo-Mode** (Standard): Nutzt vordefinierte Demo-Daten aus `demo-data.ts` — kein Supabase noetig
- **Live-Mode**: Wenn `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` gesetzt sind → echte DB-Zugriffe

`isLiveMode()` prueft ob Supabase konfiguriert ist. Alle CRUD-Operationen (createStudent, createClass, etc.) funktionieren nur im Live-Mode. Im Demo-Mode werden POST-Requests mit Fehler abgelehnt.

---

## API Routen

| Route | Method | Funktion |
|---|---|---|
| `/api/dashboard` | GET | Dashboard-Stats + Recent Analyses |
| `/api/classes` | GET | Alle Klassen |
| `/api/classes` | POST | Neue Klasse erstellen (Live-Mode) |
| `/api/students` | GET | Alle Schueler (optional ?class_id=) |
| `/api/students` | POST | Neuen Schueler erstellen (Live-Mode) |
| `/api/works` | GET | Arbeiten eines Schuelers (?student_id=) |
| `/api/analyze` | POST | LLM-Analyse ausfuehren |
| `/api/auth/login` | POST | Login |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/register` | POST | Registrierung |

---

## Wichtige Regeln fuer Claude

1. **IMMER nach jedem groesseren Feature committen UND pushen** – nie warten bis Session-Ende
2. **Zwischen-Commits** nach ca. 15-20 Minuten Arbeit oder nach jedem abgeschlossenen Feature
3. **Diese Datei aktualisieren** wenn sich der Projektstatus aendert
4. **Deutsche Sprache** in der Kommunikation mit dem User
5. **Code-Kommentare** auf Englisch
6. **Session-Log Pflicht:** Bei jedem Session-Eintrag IMMER Datum UND Uhrzeit (UTC) angeben
7. **Letzter Stand:** Am Ende jeder Session Datum+Uhrzeit des letzten Commits aktualisieren
8. **Palantir-Design-Stil beibehalten:** Blau-violette Primary, tiefe Dark-Mode-Toene, geometrische Aesthetik
9. **Bestehende UI-Komponenten nutzen:** Immer zuerst in src/components/ui/ schauen bevor neue erstellt werden
10. **Dual-Mode beachten:** Demo-Mode muss immer funktionieren, Live-Mode ist optional

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
- **Dark Mode Fix:** ThemeToggle Hydration-Bug behoben (mounted state check), Dark-Mode CSS-Variablen verbessert
- **Logo Redesign:** Neues geometrisches Hexagon-Logo im Palantir-Stil (SVG)
- **Score Breakdown Fix:** Zahlen-Overlap behoben — vertikale Liste mit Progress-Bars
- **Talent Matrix NEU:** Career Domain Fit Matrix (`talent-matrix.tsx`)
- **Wellbeing Assessment NEU:** Wellbeing-Overview Komponente (`wellbeing-overview.tsx`)
- **File Upload:** Drag & Drop Zone auf der Analyze-Seite (TXT direkt, PDF/DOCX/Images vorbereitet)
- **Analyse-Result-View:** Talent-Tab komplett ueberarbeitet

### Session 4 (2026-02-17, ~19:00–20:24 UTC)
- **Next.js Upgrade:** 15.1 → 16.1.6
- **Wellbeing → Mental Monitoring:** Komplettes Renaming
- **3-Level Analysis Mode:** Quick/Standard/Deep
- **Neue Beta-Seiten:** Mental Monitoring, Talent Matching
- **Dark Mode:** Weitere Verbesserungen

### Session 5 (2026-02-25, ~UTC)
- **Skeleton-Loader:** Palantir-Stil Loading-Animationen statt Spinner — `skeleton.tsx` mit SkeletonDashboard, SkeletonStudentsList, SkeletonClassesGrid
- **Dialog-Komponente:** Radix-basiertes Modal-System (`dialog.tsx`) mit Overlay, Animationen, Close-Button
- **Input-Komponente:** Standard-Input (`input.tsx`) mit Focus-Ring
- **Add Student Modal:** Funktionaler Dialog auf Students-Seite — First Name, Last Name, Class (Select), Student Code — POST an /api/students
- **Add Class Modal:** Funktionaler Dialog auf Classes-Seite — Name, Grade Level, Academic Year — POST an /api/classes
- **CLAUDE.md komplett ueberarbeitet:** Vollstaendige Produktbeschreibung, Design-System-Doku, API-Routen, Datenmodelle, Dual-Mode Erklaerung
- **Branch:** `claude/nuclear-project-review-WZ42W`
- **Commit:** 2646542

---

## Naechste Schritte / Offene TODOs

- [x] Datenbank-Anbindung (Supabase) — Dual-Mode Data Layer implementiert
- [ ] Supabase konfigurieren (URL + Key in .env setzen)
- [ ] Authentifizierung aktiv schalten (Login-Flow testen)
- [x] File-Upload (Drag & Drop) — MVP fertig
- [ ] PDF/DOCX Text-Extraktion (Server-seitig)
- [ ] Image OCR Integration
- [ ] Email-Eingang (school@nuclea.com → automatischer Import)
- [x] Schueler-Profil Erstellung ("Add Student" Modal) — fertig
- [x] Klassen-Erstellung ("Add Class" Modal) — fertig
- [x] Loading-Animationen (Skeleton-Loader) — fertig
- [ ] Fortschritts-Tracking ueber Zeit
- [x] Deployment-Setup (Vercel) — Live!
- [ ] Custom Domain fuer Vercel
- [ ] ANTHROPIC_API_KEY in Vercel Environment Variables setzen
- [ ] Mental Monitoring Beta-Seite mit echtem Inhalt fuellen
- [ ] Talent Matching Beta-Seite mit echtem Inhalt fuellen
- [ ] Individual Development Beta-Seite mit echtem Inhalt fuellen

---

## Produkt-Vision / Ideen

- **Email-Upload:** Schueler schicken Arbeiten an school@nuclea.com → automatisch entpackt und verarbeitet
- **Talent-Matrix Aggregation:** Ueber mehrere Arbeiten hinweg aggregieren, nicht nur einzelne Analyse
- **Fortschritts-Grafiken:** Zeitliche Entwicklung der Scores pro Schueler visualisieren
- **Export:** PDF-Reports pro Schueler/Klasse generieren
- **Klassenvergleich:** Dashboard mit Klassen-uebergreifenden Statistiken
- **Batch-Analyse:** Mehrere Arbeiten gleichzeitig analysieren

---

## Hinweise

- `.env.example` zeigt benoetigte Umgebungsvariablen
- DevContainer ist konfiguriert (Port 3000)
- Legacy-Code (Streamlit) liegt unter `/legacy/` als Referenz
- **Deployment:** Vercel, aktuell nuclea-eight.vercel.app
- **Letzter Stand (2026-02-25):** Skeleton-Loader, Add Student/Class Modals, CLAUDE.md komplett ueberarbeitet
