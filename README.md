# 🔬 NUCLEA V0 - The Fair Evaluation Core

**NUCLEA** ist ein Datenanalyse-System, das akademische Arbeiten objektiv bewertet und ein Profil von Stärken, Wachstumsbereichen und Lernmustern erstellt — ohne subjektive Verzerrung.

## 🎯 Ziel (V0)

**Input:** Akademische Arbeit (Text, PDF, DOCX)  
**Output:** Profil-Karte mit:
- **Core Strengths** (3 Punkte, leistungsbasiert)
- **Growth Focus** (3 Punkte, handlungsorientiert)
- **1-Week Plan** (5 kurze tägliche Aufgaben)
- **Wellbeing Signals** (optional, standard: AUS)

## 🚀 Schnellstart

### Lokale Entwicklung

#### 1. Installation

```bash
# Python 3.8+ erforderlich
pip install -r requirements.txt
```

#### 2. API-Key einrichten

Erstelle eine `.env` Datei im Projektordner:

```bash
# .env Datei erstellen
touch .env
```

Füge deinen API-Key hinzu (wähle eine Option):

**Option 1: OpenAI (empfohlen)**
```
OPENAI_API_KEY=dein_openai_api_key_hier
```

**Option 2: Anthropic (Claude)**
```
ANTHROPIC_API_KEY=dein_anthropic_api_key_hier
```

**WICHTIG:** Füge `.env` zu `.gitignore` hinzu (nicht committen!)

#### 3. App starten

```bash
streamlit run app.py
```

Die App öffnet sich automatisch im Browser (meist `http://localhost:8501`).

### 🌐 Deployment auf Streamlit Community Cloud

#### 1. GitHub Repository vorbereiten

Stelle sicher, dass dein Repository folgende Dateien enthält:
- `app.py`
- `analysis.py`
- `requirements.txt`
- `.gitignore` (mit `.env`)

**WICHTIG:** Keine API-Keys im Code committen!

#### 2. Repository auf GitHub pushen

```bash
git init
git add app.py analysis.py requirements.txt .gitignore README.md
git commit -m "Initial commit: NUCLEA V0.1"
git branch -M main
git remote add origin https://github.com/dein-username/dein-repo.git
git push -u origin main
```

#### 3. Streamlit Community Cloud Deployment

1. Gehe zu [share.streamlit.io](https://share.streamlit.io)
2. Melde dich mit GitHub an
3. Klicke auf "New app"
4. Wähle dein Repository und Branch
5. Setze **Main file path** auf: `app.py`
6. Klicke auf "Deploy"

#### 4. Secrets konfigurieren

Nach dem Deployment:

1. Gehe zu deiner App auf Streamlit Cloud
2. Klicke auf "⚙️ Settings" → "Secrets"
3. Füge deine API-Keys hinzu:

```toml
OPENAI_API_KEY = "dein_openai_api_key_hier"
# ODER
ANTHROPIC_API_KEY = "dein_anthropic_api_key_hier"
```

4. Speichere und die App wird automatisch neu deployed

**Hinweis:** Die App unterstützt sowohl Streamlit Secrets (für Cloud) als auch `.env` (für lokale Entwicklung).

## 📁 Projektstruktur

```
Nuclea V0/
├── app.py              # Streamlit UI (Benutzeroberfläche)
├── analysis.py         # Kernlogik (Analyse-Funktionen)
├── requirements.txt    # Python-Pakete
├── .env                # API-Keys (nicht committen!)
└── README.md           # Diese Datei
```

## 🔧 Wie es funktioniert

### 1. **Text-Eingabe**
- Text direkt einfügen ODER
- Datei hochladen (.txt, .pdf, .docx)

### 2. **Analyse-Prozess**
1. **Rubric-Bewertung**: Objektive Scores (0-5) in 5 Dimensionen
   - Structure (Struktur)
   - Clarity (Klarheit)
   - Evidence (Belege)
   - Originality (Originalität)
   - Coherence (Kohärenz)

2. **Profil-Generierung**: Individuelles Lernprofil
   - Stärken identifizieren
   - Wachstumsbereiche definieren
   - Wochenplan erstellen
   - Kognitiven Stil erkennen

3. **Wellbeing-Signale** (optional): Vorsichtige Prüfung auf mögliche Signale
   - Level: none/mild/flag
   - Hinweis + nächster Schritt
   - **Disclaimer:** Indicative, not diagnostic

### 3. **Ergebnis-Anzeige**
- **Student Profile**: Stärken, Wachstum, Plan
- **Objective Summary**: Scores mit Begründungen
- **Wellbeing Signals**: Nur wenn aktiviert

### 4. **Export**
- Report als Markdown herunterladen

## ⚙️ Technische Details

### LLM-Integration

Die App nutzt Language Models (OpenAI GPT-4o-mini oder Claude Haiku) für:
- Objektive Bewertung (Rubric-Scores)
- Profil-Generierung (Stärken, Wachstum, Plan)
- Wellbeing-Signale (optional, mit Sicherheitsvorkehrungen)

**Fallback:** Wenn kein API-Key vorhanden ist, werden Demo-Daten verwendet.

### Sicherheitsvorkehrungen

- **Wellbeing:** Keine Diagnose, nur Hinweise
- **Disclaimer:** "Indicative, not diagnostic. Decisions by humans."
- **Opt-in:** Wellbeing standardmäßig AUS
- **Keine Speicherung:** Keine Datenbank, keine Persistenz

## 🐛 Fehlerbehebung

### "Kein API-Key gefunden"
- Prüfe, ob `.env` Datei existiert
- Prüfe, ob API-Key korrekt eingetragen ist
- **Hinweis:** App funktioniert mit Demo-Daten, aber echte Analyse erfordert API-Key

### "Text zu kurz"
- Mindestens 50 Zeichen erforderlich
- Prüfe, ob Datei korrekt hochgeladen wurde

### "Fehler beim Lesen der PDF"
- Prüfe, ob PDF nicht verschlüsselt ist
- Prüfe, ob PDF Text enthält (nicht nur Bilder)

## 📝 TODO für echte API-Keys

1. **OpenAI API-Key erhalten:**
   - Gehe zu https://platform.openai.com/api-keys
   - Erstelle neuen API-Key
   - Kopiere in `.env` Datei

2. **ODER Anthropic API-Key erhalten:**
   - Gehe zu https://console.anthropic.com/
   - Erstelle neuen API-Key
   - Kopiere in `.env` Datei

3. **Paket installieren (falls Anthropic):**
   ```bash
   pip install anthropic
   ```

## 🎓 Verwendung

1. **App starten:** `streamlit run app.py`
2. **Text eingeben** oder **Datei hochladen**
3. **Wellbeing aktivieren** (optional, Sidebar)
4. **"Analysieren" klicken**
5. **Ergebnisse ansehen**
6. **Report herunterladen** (optional)

## ⚠️ Wichtige Hinweise

- **Keine Speicherung:** Alle Daten werden nur im Browser gespeichert (Session)
- **Keine Diagnose:** Wellbeing-Signale sind nur Hinweise, keine medizinische Einschätzung
- **Menschliche Entscheidung:** Alle Entscheidungen müssen von Menschen getroffen werden
- **API-Kosten:** Jede Analyse verursacht API-Kosten (abhängig vom Anbieter)

## 📄 Lizenz

Dieses Projekt ist Teil von NUCLEA V0 - The Fair Evaluation Core.

---

**Erstellt für:** Objektive, faire Bewertung akademischer Arbeiten  
**Ziel:** Talent früh sichtbar machen, datenbasierte Entwicklungsentscheidungen ermöglichen


