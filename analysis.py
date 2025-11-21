"""
NUCLEA V0 - Core Analysis Module

Dieses Modul enthält die gesamte Logik zur Analyse von akademischen Arbeiten:
1. Text-Extraktion aus verschiedenen Dateiformaten
2. LLM-basierte Bewertung (Rubric-Scores)
3. Profil-Generierung (Stärken, Wachstumsbereiche, Wochenplan)
4. Optional: Wellbeing-Signale (mit Sicherheitsvorkehrungen)
"""

import os
import json
import re
from typing import Dict, Optional, List

# Try to load Streamlit secrets (for Streamlit Cloud), fallback to .env (for local dev)
try:
    import streamlit as st
    # Streamlit secrets available (running on Streamlit Cloud)
    HAS_STREAMLIT = True
except ImportError:
    # Running outside Streamlit (e.g., local dev or testing)
    HAS_STREAMLIT = False

# Always try to load .env for local development (even if Streamlit is available)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, skip (shouldn't happen with requirements.txt)

# ============================================================================
# TEIL 1: TEXT-EXTRAKTION
# ============================================================================
# Warum: Wir müssen Text aus verschiedenen Formaten (PDF, DOCX, TXT) extrahieren
# bevor wir ihn analysieren können.

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extrahiert Text aus hochgeladenen Dateien.
    
    Args:
        file_content: Der Dateiinhalt als Bytes
        filename: Der Dateiname (zur Format-Erkennung)
    
    Returns:
        Extrahierter Text als String
    """
    file_extension = filename.split('.')[-1].lower()
    
    if file_extension == 'txt':
        return file_content.decode('utf-8')
    
    elif file_extension == 'pdf':
        try:
            import PyPDF2
            from io import BytesIO
            pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
            text = ""
            # Limit to first 50 pages for V0 performance (can be extended later)
            max_pages = min(50, len(pdf_reader.pages))
            for i, page in enumerate(pdf_reader.pages[:max_pages]):
                text += page.extract_text() + "\n"
            if len(pdf_reader.pages) > max_pages:
                text += f"\n[Note: Document truncated to first {max_pages} pages for V0 performance]"
            return text
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")
    
    elif file_extension in ['docx', 'doc']:
        try:
            from docx import Document
            from io import BytesIO
            doc = Document(BytesIO(file_content))
            # Optimize: use list comprehension and join once
            paragraphs = [paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip()]
            text = "\n".join(paragraphs)
            return text
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")
    
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")


# ============================================================================
# TEIL 2: WELLBEING KEYWORD-CHECK
# ============================================================================
# Warum: Bevor wir teure LLM-Calls machen, prüfen wir einfache Keywords.
# Das spart Zeit und Kosten. Wenn keine Keywords gefunden werden,
# können wir "none" zurückgeben ohne LLM-Call.

def check_wellbeing_keywords(text: str) -> List[str]:
    """
    Prüft Text auf mögliche Wellbeing-Signale (einfache Keyword-Erkennung).
    
    Args:
        text: Der zu prüfende Text
    
    Returns:
        Liste gefundener Keywords (leer = keine Signale)
    """
    # Vorsichtige Keywords (nur als Hinweis, nicht als Diagnose!)
    mild_keywords = [
        'stress', 'überfordert', 'erschöpft', 'müde', 'schlaf',
        'sorgen', 'angst', 'zweifel', 'unsicher', 'schwierig'
    ]
    
    flag_keywords = [
        'hoffnungslos', 'hilflos', 'selbstverletzung', 'suizid',
        'nicht mehr weiter', 'keinen sinn', 'aufgeben'
    ]
    
    text_lower = text.lower()
    found = []
    
    for keyword in flag_keywords:
        if keyword in text_lower:
            found.append(keyword)
    
    for keyword in mild_keywords:
        if keyword in text_lower:
            found.append(keyword)
    
    return found


# ============================================================================
# TEIL 3: LLM-FUNKTIONEN
# ============================================================================
# Warum: Wir nutzen ein Language Model (OpenAI/Claude) um:
# 1. Objektive Scores zu vergeben (0-5 in 5 Dimensionen)
# 2. Ein Profil zu erstellen (Stärken, Wachstum, Plan)
# 3. Wellbeing-Signale zu erkennen (wenn aktiviert)

def call_llm(prompt: str, system_prompt: str = None) -> str:
    """
    Ruft das LLM (OpenAI oder Claude) auf.
    
    TODO: Hier musst du deinen API-Key eintragen!
    - Öffne .env Datei
    - Füge hinzu: OPENAI_API_KEY=dein_key_hier
    - Oder: ANTHROPIC_API_KEY=dein_key_hier
    
    Args:
        prompt: Die Frage/Anweisung an das LLM
        system_prompt: Optionale System-Anweisung (für Kontext)
    
    Returns:
        Die Antwort des LLMs als String
    """
    # Try Streamlit secrets first (for Streamlit Cloud), then .env (for local dev)
    if HAS_STREAMLIT:
        try:
            openai_key = st.secrets.get("OPENAI_API_KEY", None)
            anthropic_key = st.secrets.get("ANTHROPIC_API_KEY", None)
        except (AttributeError, KeyError, FileNotFoundError):
            # Secrets not configured, fallback to .env
            openai_key = os.getenv("OPENAI_API_KEY")
            anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    else:
        openai_key = os.getenv("OPENAI_API_KEY")
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    
    api_key = openai_key or anthropic_key
    
    if not api_key:
        # Fallback für Demo: Gibt strukturierte Dummy-Daten zurück
        print("⚠️ WARNING: No API key found. Using demo data.")
        return get_demo_response(prompt)
    
    # OpenAI API Call
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # Günstig und schnell
                messages=messages,
                temperature=0.3  # Niedrig für konsistente Ergebnisse
            )
            return response.choices[0].message.content
        
        except Exception as e:
            print(f"⚠️ OpenAI API error: {str(e)}")
            return get_demo_response(prompt)
    
    # Anthropic (Claude) API Call
    elif anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            
            messages = [{"role": "user", "content": prompt}]
            
            response = client.messages.create(
                model="claude-3-haiku-20240307",  # Günstig und schnell
                max_tokens=2000,
                temperature=0.3,
                system=system_prompt or "",
                messages=messages
            )
            return response.content[0].text
        
        except Exception as e:
            print(f"⚠️ Anthropic API error: {str(e)}")
            return get_demo_response(prompt)
    
    return get_demo_response(prompt)


def get_demo_response(prompt: str) -> str:
    """Gibt Demo-Daten zurück wenn kein API-Key vorhanden ist."""
    is_elementary = "elementary" in prompt.lower()
    
    if "rubric" in prompt.lower():
        if is_elementary:
            return json.dumps({
                "scores": {"structure": 3, "clarity": 3, "evidence": 2, "originality": 4, "coherence": 3},
                "justifications": {
                    "structure": "Simple topic-based organization with personal statements. Example: 'My favorite pet' shows basic structure.",
                    "clarity": "Clear, age-appropriate language with simple sentences. Example: 'I am nine years old' demonstrates readable prose.",
                    "evidence": "Personal experiences used as examples. Example: 'I like pizza' shows personal evidence.",
                    "originality": "Personal expression with unique interests visible. Example: 'My favorite sport is Leichtathletik' shows individual perspective.",
                    "coherence": "Logical flow between personal statements. Example: 'I am in 4th grade' connects to context."
                }
            })
        else:
            return json.dumps({
                "scores": {"structure": 4, "clarity": 3, "evidence": 4, "originality": 3, "coherence": 4},
                "justifications": {
                    "structure": "Clear introduction-body-conclusion sequencing with logical transitions. Example: 'political instability' shows structured sectioning.",
                    "clarity": "Consistent wording throughout; a few sentences could be tighter. Example: 'Rome faced an almost constant cycle' demonstrates readable prose.",
                    "evidence": "Sources and quantitative data embedded throughout the argument. Example: 'Between 235 and 284 AD' shows historical data integration.",
                    "originality": "Independent reasoning appears but can deepen with more unique framing. Example: 'combination of political instability' shows some original synthesis.",
                    "coherence": "Argument threads remain aligned end to end with consistent logic. Example: 'economic decline further accelerated' demonstrates causal linking."
                }
            })
    elif "profile" in prompt.lower():
        if is_elementary:
            return json.dumps({
                "strengths": [
                    "Narrative thinking + 'My favorite pet'",
                    "Topic organization + 'I like pizza'",
                    "Personal expression + 'My hobby is sport'"
                ],
                "growth_areas": [
                    "Limited sentence variety + 'I am nine'",
                    "Basic vocabulary expansion + 'I like'",
                    "Simple transitions missing + 'My favorite'"
                ],
                "cognitive_pattern": "Descriptive reasoning with personal experience-based organization. Operates at concrete, personal level. Uses direct, topic-based approach.",
                "development_plan": [
                    "Day 1: Read English texts about football to improve vocabulary",
                    "Day 2: Write a short presentation about favorite football club to practice sentence variety",
                    "Day 3: Learn history of favorite football club to connect interests with learning"
                ]
            })
        else:
            return json.dumps({
                "strengths": [
                    "Pattern Recognition + 'data shows patterns'",
                    "Deductive Structuring + 'logical sequence'",
                    "Causal Linking + 'direct relationship'"
                ],
                "growth_areas": [
                    "Low evidence density + 'few citations'",
                    "Weak causal linking + 'unclear connections'",
                    "Unclear thesis definition + 'vague argument'"
                ],
                "cognitive_pattern": "Analytical reasoning with structured information organization. Operates at moderate abstraction level. Uses deductive problem-solving approach.",
                "development_plan": [
                    "Day 1: Practice evidence integration with primary sources",
                    "Day 2: Strengthen causal linking through comparative analysis",
                    "Day 3: Refine thesis definition with structured argumentation"
                ]
            })
    elif "wellbeing" in prompt.lower():
        return json.dumps({
            "level": "none",
            "note": "No special signals detected.",
            "next_step": "Continue standard monitoring."
        })
    elif "talent" in prompt.lower() or "indicator" in prompt.lower() or "matching" in prompt.lower() or "learning" in prompt.lower():
        if is_elementary:
            return json.dumps({
                "talent_indicators": [
                    "Sports-themed narrative thinking",
                    "Personal experience-based reasoning",
                    "Interest-driven organization"
                ],
                "learning_recommendations": [
                    "Math with football context: Calculate goals, player statistics, field dimensions",
                    "English texts about football: Read stories about favorite teams, write about matches",
                    "History project about favorite football club: Research club history, connect to historical events"
                ]
            })
        else:
            return json.dumps({
                "talent_indicators": [
                    "Pattern Recognition + Causal Linking",
                    "Systems thinking",
                    "Comparative analysis"
                ],
                "matching_domains": [
                    "Political Science",
                    "Data Science",
                    "Research"
                ],
                "talent_development_focus": [
                    {
                        "talent": "Pattern Recognition + Causal Linking",
                        "rationale": "Strong foundation for research and analytical work, visible in text structure.",
                        "next_steps": ["Engage in structured debate forums focusing on evidence-based argumentation", "Conduct evidence-based research projects using primary sources"]
                    }
                ]
            })
    return "{}"


def llm_rubric_prompt(text: str, is_elementary: bool = False) -> str:
    """
    Erstellt den Prompt für die Rubric-Bewertung (0-5 Scores in 5 Dimensionen).
    
    Warum: Wir wollen objektive, vergleichbare Scores - keine subjektiven Noten.
    """
    if is_elementary:
        prompt = f"""Analyze this elementary school work and assign scores (0-5) across five age-appropriate criteria:

1. **Structure**: Basic organization, sentence flow, simple transitions
2. **Clarity**: Word choice, sentence clarity, age-appropriate language
3. **Evidence**: Use of examples, personal experiences, simple facts
4. **Originality**: Personal expression, creative ideas, unique perspectives
5. **Coherence**: Logical flow, topic consistency, simple connections

**REQUIREMENTS (EVIDENCE-BASED LANGUAGE):**
- Describe only observable text behavior (structure, reasoning, support)
- No personality, motivation, emotion, or identity references
- No adjectives targeting the person (e.g., "creative", "lazy")
- No speculation about psychology or intention
- Short, declarative sentences
- Tie each justification to concrete textual behavior
- Each justification: 1-2 sentences describing observable behavior + direct quote (≤6 words) as evidence

**Text:**
{text[:2000] if not is_elementary else text[:500]}

**Respond ONLY with JSON using this schema:**
{{
  "scores": {{
    "structure": 0-5,
    "clarity": 0-5,
    "evidence": 0-5,
    "originality": 0-5,
    "coherence": 0-5
  }},
  "justifications": {{
    "structure": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "clarity": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "evidence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "originality": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "coherence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence."
  }}
}}"""
    else:
        prompt = f"""Analyze the following academic work and assign scores (0-5) across five fixed criteria based on observable text behavior:

1. **Structure**: Visible organization, sectioning, transitions
2. **Clarity**: Precise wording, sentence control, readability
3. **Evidence**: Use of data, citations, source integration
4. **Originality**: Unique framing, synthesis, novel angles
5. **Coherence**: Logical flow, consistent argument linkage

**REQUIREMENTS (EVIDENCE-BASED LANGUAGE):**
- Describe only observable text behavior (structure, reasoning, support)
- No personality, motivation, emotion, or identity references
- No adjectives targeting the person (e.g., "creative", "lazy")
- No speculation about psychology or intention
- Short, declarative sentences
- Tie each justification to concrete textual behavior
- Each justification: 1-2 sentences describing observable behavior + direct quote (≤6 words) as evidence

**Text:**
{text[:2000]}

**Respond ONLY with JSON using this schema:**
{{
  "scores": {{
    "structure": 0-5,
    "clarity": 0-5,
    "evidence": 0-5,
    "originality": 0-5,
    "coherence": 0-5
  }},
  "justifications": {{
    "structure": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "clarity": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "evidence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "originality": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "coherence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence."
  }}
}}"""
    return prompt


def llm_profile_prompt(scores_json: Dict, text: str, is_elementary: bool = False) -> str:
    """
    Erstellt den Prompt für die Profil-Generierung (V0.1).
    """
    if is_elementary:
        prompt = f"""Analyze this elementary school work and produce a structured profile:

**Scores:**
{json.dumps(scores_json, indent=2)}

**Text (excerpt):**
{text[:500]}

**Produce:**

A. **3 Strengths**: Each must be a cognitive skill appropriate for elementary level (e.g., "Narrative thinking", "Topic organization", "Personal expression") supported by a cited text excerpt (quote ≤6 words).

B. **3 Growth Areas**: Each must be a concrete skill gap appropriate for elementary level (e.g., "Limited sentence variety", "Basic vocabulary expansion needed", "Simple transitions missing") supported by a cited text excerpt (quote ≤6 words).

C. **Cognitive Pattern Summary**: 2 sentences explaining how the student processes information:
   - reasoning type (simple/narrative/descriptive)
   - information organization (topical/chronological/personal)
   - abstraction level (concrete/personal experiences)
   - problem-solving approach (direct/exploratory)

D. **3-Day Development Plan**: Three consecutive daily actions (Day 1–Day 3). Each day = 1 targeted exercise linked to growth areas AND student interests mentioned in text. Format: "Day X: [Activity] related to [interest from text] to improve [skill]". Example: "Day 1: Read English texts about football to improve vocabulary" if student mentioned football.

**ABSOLUTE RESTRICTIONS:**
- Use precise, neutral, skill-based language
- NO personality, emotion, or character descriptions
- Focus ONLY on observable cognitive operations
- NO vague feedback
- Short, crisp sentences
- NO emojis, NO psychological diagnosis, NO moral judgement

**Respond ONLY with JSON:**
{{
  "strengths": ["Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)"],
  "growth_areas": ["Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)"],
  "cognitive_pattern": "2 sentences: reasoning type, information organization, abstraction level, problem-solving approach",
  "development_plan": ["Day 1: Activity related to student interest to improve skill", "Day 2: Activity related to student interest to improve skill", "Day 3: Activity related to student interest to improve skill"]
}}"""
    else:
        prompt = f"""Analyze the academic work and produce a structured cognitive profile:

**Scores:**
{json.dumps(scores_json, indent=2)}

**Text (excerpt):**
{text[:1500]}

**Produce:**

A. **3 Strengths**: Each must be a cognitive skill (e.g., "Pattern Recognition", "Deductive Structuring", "Comparative Reasoning") supported by a cited text excerpt (quote ≤6 words).

B. **3 Growth Areas**: Each must be a concrete skill gap (e.g., "Low evidence density", "Weak causal linking") supported by a cited text excerpt (quote ≤6 words).

C. **Cognitive Pattern Summary**: 2-3 sentences explaining how the student processes information:
   - reasoning type
   - information organization
   - abstraction level
   - problem-solving approach

D. **3-Day Development Plan**: Three consecutive daily actions (Day 1–Day 3). Each day = 1 targeted exercise linked to the growth areas.

**ABSOLUTE RESTRICTIONS:**
- Use precise, neutral, skill-based language
- NO personality, emotion, or character descriptions
- Focus ONLY on observable cognitive operations
- NO vague feedback
- Short, crisp sentences
- NO emojis, NO psychological diagnosis, NO moral judgement

**Respond ONLY with JSON:**
{{
  "strengths": ["Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)"],
  "growth_areas": ["Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)"],
  "cognitive_pattern": "2-3 sentences: reasoning type, information organization, abstraction level, problem-solving approach",
  "development_plan": ["Day 1: Targeted exercise linked to growth areas", "Day 2: Targeted exercise linked to growth areas", "Day 3: Targeted exercise linked to growth areas"]
}}"""
    return prompt


def llm_talent_prompt(profile_data: Dict, scores_json: Dict, text: str, is_elementary: bool = False) -> str:
    """
    Erstellt den Prompt für Talent-Identifikation (V0.1).
    """
    strengths = profile_data.get("strengths", [])
    cognitive_pattern = profile_data.get("cognitive_pattern", "")
    
    if is_elementary:
        prompt = f"""Based on this elementary school work, identify talent indicators and matching domains:

**Strengths:**
{json.dumps(strengths, indent=2)}

**Cognitive Pattern:**
{cognitive_pattern}

**Scores:**
{json.dumps(scores_json, indent=2)}

**Full Text (read carefully to extract ALL specific interests mentioned - favorite sports, hobbies, subjects, colors, foods, etc.):**
{text}

**Deliver:**

E. **Talent Indicators (3-5 items)**: Early indicators of natural strengths, expressed as:
   - skill clusters appropriate for elementary level (e.g., "Narrative thinking + Topic organization", "Sports-themed narrative thinking")
   - ways of thinking (e.g., "Descriptive thinking", "Personal experience-based reasoning")
   - interest-based patterns visible in text (e.g., "Sports-oriented", "Creative expression")

F. **Learning Recommendations (3-5 items)**: Concrete, practical recommendations on how to best teach and learn based on EXACT interests extracted from the text. 

**CRITICAL REQUIREMENTS:**
1. Extract SPECIFIC interests from the text (e.g., if text says "I like football" → use "football", if text says "My favorite sport is Leichtathletik" → use "Leichtathletik", if text says "I like pizza" → use "pizza/cooking")
2. Each recommendation MUST reference the specific interest mentioned in the text
3. Format: "Subject + specific task with interest: Detailed description"
4. Be VERY specific and detailed - not generic like "English with personal interests" but concrete like "English texts about football: Read stories about FC Bayern Munich, write a short report about your favorite match, learn vocabulary about football positions and rules"

**Examples based on text content:**
- If text mentions "football" or "soccer": "Math with football context: Calculate goals scored per game, player statistics (goals, assists), field dimensions (length × width), time calculations for match duration"
- If text mentions "football": "English texts about football: Read short stories about favorite teams (e.g., FC Bayern), write 3 sentences about a match you watched, learn vocabulary: goal, player, team, match"
- If text mentions "football": "History project about favorite football club: Research when your favorite club was founded, find out what historical events happened in that year, create a timeline connecting club history to world history"
- If text mentions "sports": "Science experiments related to sports: Measure how far you can throw a ball, learn about muscles used in running, observe heart rate during exercise"
- If text mentions specific hobby: Use that EXACT hobby in the recommendation

**IMPORTANT**: You MUST extract the exact interests from the text and use them in every recommendation. Do NOT use generic terms like "personal interests" or "hobbies" - use the SPECIFIC interest mentioned (e.g., "football", "pizza", "Leichtathletik", "red color", etc.)

**ABSOLUTE RESTRICTIONS:**
- Use precise, neutral, skill-based language
- NO personality, emotion, or character descriptions
- NO psychological diagnosis
- NO moral judgement
- Focus ONLY on observable cognitive operations and interests mentioned in text
- Each recommendation must be specific and actionable

**Respond ONLY with JSON:**
{{
  "talent_indicators": ["Skill cluster or thinking style (e.g., 'Sports-themed narrative thinking')", "Skill cluster or thinking style", "Skill cluster or thinking style"],
  "learning_recommendations": ["Subject + specific interest-based example (e.g., 'Math with football context: Calculate goals and statistics')", "Subject + specific interest-based example", "Subject + specific interest-based example"]
}}"""
    else:
        prompt = f"""Based on the analysis, identify early talent indicators and matching domains:

**Strengths:**
{json.dumps(strengths, indent=2)}

**Cognitive Pattern:**
{cognitive_pattern}

**Scores:**
{json.dumps(scores_json, indent=2)}

**Text (excerpt):**
{text[:1200]}

**Deliver:**

E. **Talent Indicators (3-5 items)**: Early indicators of natural strengths, expressed as:
   - skill clusters (e.g., "Pattern Recognition + Causal Linking")
   - ways of thinking (e.g., "Systems thinking", "Comparative analysis")
   - potential academic/professional domains (e.g., "Research methodology", "Data analysis")

F. **Matching Domains (3-5 items)**: University-level or early-career areas the student may thrive in, based on cognitive patterns:
   - Specific academic fields (e.g., "Political Science", "Data Science")
   - Professional domains (e.g., "Research", "Technical Writing")
   - Career tracks (e.g., "Data Analyst", "Research Assistant")

G. **Talent Development Focus (1-2 items)**: Prioritized talents for focused development. Each item includes:
   - Talent name (from talent indicators)
   - Brief rationale (1 sentence: why this talent should be prioritized)
   - 1-2 concrete next steps (specific, actionable exercises)

**CRITICAL DISTINCTION:**
- **Talent Indicators**: What cognitive skills/patterns are visible (skill clusters, thinking styles)
- **Matching Domains**: Where these skills can be applied (academic fields, career areas)
- **Talent Development Focus**: Which talents to prioritize and how to develop them

**ABSOLUTE RESTRICTIONS:**
- Use precise, neutral, skill-based language
- NO personality, emotion, or character descriptions
- NO psychological diagnosis
- NO moral judgement
- NO political or demographic inference
- Focus ONLY on observable cognitive operations
- Keep Talent Development Focus compact: 1-2 talents max, 1-2 steps per talent

**Respond ONLY with JSON:**
{{
  "talent_indicators": ["Skill cluster or thinking style (e.g., 'Pattern Recognition + Causal Linking')", "Skill cluster or thinking style", "Skill cluster or thinking style"],
  "matching_domains": ["Academic field or career area (e.g., 'Political Science')", "Academic field or career area", "Academic field or career area"],
  "talent_development_focus": [
    {{
      "talent": "Talent name from indicators",
      "rationale": "1 sentence: why prioritize this talent",
      "next_steps": ["Concrete action 1", "Concrete action 2"]
    }}
  ]
}}"""
    return prompt


def llm_wellbeing_prompt(text: str, keywords: List[str]) -> str:
    """
    Erstellt den Prompt für Wellbeing-Signale (mit Sicherheitsvorkehrungen).
    
    Warum: Wir erkennen mögliche Signale, aber stellen klar:
    - Keine Diagnose
    - Nur Hinweise
    - Menschliche Entscheidung erforderlich
    """
    keyword_info = f"Detected keywords: {', '.join(keywords)}" if keywords else "No flagged keywords detected"
    
    prompt = f"""Review the following text for potential wellbeing signals (NOT a diagnosis):

**Text:**
{text[:2000]}

**Keyword context:**
{keyword_info}

**SAFETY REQUIREMENTS:**
- Do NOT deliver a diagnosis.
- Treat the output as an indicator only, not medical guidance.
- Emphasize that a human must review and decide next steps.
- Use cautious, supportive wording.

**Evaluate the level:**
- "none": No notable wellbeing signals.
- "mild": Light indicators (e.g., stress, uncertainty).
- "flag": Stronger signals requiring attention.

**Respond ONLY with JSON:**
{{
  "level": "none|mild|flag",
  "note": "One sentence rationale (cautious wording)",
  "next_step": "One sentence, human action suggestion (e.g., 'Offer a check-in conversation')"
}}"""
    return prompt


# ============================================================================
# TEIL 4: HAUPTFUNKTION
# ============================================================================
# Warum: Diese Funktion koordiniert alles - sie ist der Einstiegspunkt
# für die App. Sie ruft die LLM-Funktionen auf und strukturiert die Antwort.

def analyze_text(text: str, wellbeing: bool = False, study_level: str = "Default Mode", progress_callback=None) -> Dict:
    """
    Hauptfunktion: Analysiert einen Text und erstellt ein Profil.
    
    Args:
        text: Der zu analysierende Text
        wellbeing: Ob Wellbeing-Signale geprüft werden sollen
        study_level: "Default Mode" oder "Elementary Mode"
        progress_callback: Optional callback function(percent: int, message: str) für Progress-Updates
    
    Returns:
        Dictionary mit allen Analyse-Ergebnissen
    """
    if not text or len(text.strip()) < 20:
        raise ValueError("Input too short. Provide at least 20 characters for analysis.")
    
    # Schritt 1: Rubric-Bewertung (Scores 0-5)
    if progress_callback:
        progress_callback(20, "Evaluating rubric scores...")
    print("📊 Evaluating rubric scores...")
    is_elementary = (study_level == "Elementary Mode")
    rubric_prompt = llm_rubric_prompt(text, is_elementary)
    rubric_response = call_llm(rubric_prompt)
    
    try:
        rubric_data = json.loads(rubric_response)
        scores = rubric_data.get("scores", {})
        justifications = rubric_data.get("justifications", {})
    except json.JSONDecodeError:
        # Fallback falls JSON-Parsing fehlschlägt
        scores = {"structure": 3, "clarity": 3, "evidence": 3, "originality": 3, "coherence": 3}
        justifications = {k: "Automatische Bewertung nicht verfügbar." for k in scores}
    
    # Schritt 2: Profil-Generierung
    if progress_callback:
        progress_callback(50, "Building profile...")
    print("👤 Building profile...")
    profile_prompt = llm_profile_prompt(scores, text, is_elementary)
    profile_response = call_llm(profile_prompt)
    
    try:
        profile_data = json.loads(profile_response)
    except json.JSONDecodeError:
        # Fallback
        if is_elementary:
            profile_data = {
                "strengths": ["Narrative thinking + 'My favorite'", "Topic organization + 'I like'", "Personal expression + 'My hobby'"],
                "growth_areas": ["Limited sentence variety + 'I am'", "Basic vocabulary expansion + 'simple words'", "Simple transitions missing + 'My favorite'"],
                "cognitive_pattern": "Descriptive reasoning with personal experience-based organization. Operates at concrete, personal level.",
                "development_plan": ["Day 1: Read texts about interests to improve vocabulary", "Day 2: Write about favorite topic to practice sentence variety", "Day 3: Connect interests with learning subjects"]
            }
        else:
            profile_data = {
                "strengths": ["Pattern Recognition + 'data shows patterns'", "Deductive Structuring + 'logical sequence'", "Comparative Reasoning + 'contrasting approaches'"],
                "growth_areas": ["Low evidence density + 'few citations'", "Weak causal linking + 'unclear connections'", "Unclear thesis definition + 'vague argument'"],
                "cognitive_pattern": "Analytical reasoning with structured information organization. Operates at moderate abstraction level. Uses deductive problem-solving approach.",
                "development_plan": ["Day 1: Practice evidence integration with primary sources", "Day 2: Strengthen causal linking through comparative analysis", "Day 3: Refine thesis definition with structured argumentation"]
            }
    
    # Schritt 3: Talent-Identifikation
    if progress_callback:
        progress_callback(75, "Identifying talents...")
    print("⭐ Identifying talents...")
    talent_prompt = llm_talent_prompt(profile_data, scores, text, is_elementary)
    talent_response = call_llm(talent_prompt)
    
    try:
        talent_data = json.loads(talent_response)
    except json.JSONDecodeError:
        # Fallback
        if is_elementary:
            talent_data = {
                "talent_indicators": [
                    "Sports-themed narrative thinking",
                    "Personal experience-based reasoning",
                    "Interest-driven organization"
                ],
                "learning_recommendations": [
                    "Math with football context: Calculate goals, player statistics, field dimensions",
                    "English texts about football: Read stories about favorite teams, write about matches",
                    "History project about favorite football club: Research club history, connect to historical events"
                ]
            }
        else:
            talent_data = {
                "talent_indicators": ["Pattern Recognition + Causal Linking", "Systems thinking", "Comparative analysis"],
                "matching_domains": ["Political Science", "Data Science", "Research"],
                "talent_development_focus": [
                    {
                        "talent": "Pattern Recognition + Causal Linking",
                        "rationale": "Strong foundation for research and analytical work, visible in text structure.",
                        "next_steps": ["Engage in structured debate forums focusing on evidence-based argumentation", "Conduct evidence-based research projects using primary sources"]
                    }
                ]
            }
    
    # Schritt 4: Wellbeing (optional)
    wellbeing_data = None
    if wellbeing:
        if progress_callback:
            progress_callback(90, "Checking wellbeing signals...")
        print("💚 Checking wellbeing signals...")
        keywords = check_wellbeing_keywords(text)
        wellbeing_prompt = llm_wellbeing_prompt(text, keywords)
        wellbeing_response = call_llm(wellbeing_prompt)
        
        try:
            wellbeing_data = json.loads(wellbeing_response)
        except json.JSONDecodeError:
            wellbeing_data = {
                "level": "none",
                "note": "Assessment unavailable.",
                "next_step": "Continue standard monitoring."
            }
    
    # Final: 100%
    if progress_callback:
        progress_callback(100, "Finalizing results...")
    
    # V0.1 Structure: Combine into new format
    result = {
        "rubric": {
            "scores": scores,
            "justifications": justifications
        },
        "strengths": profile_data.get("strengths", []),
        "growth_areas": profile_data.get("growth_areas", []),
        "cognitive_pattern": profile_data.get("cognitive_pattern", ""),
        "development_plan": profile_data.get("development_plan", []),
        "talent_indicators": talent_data.get("talent_indicators", []),
        "matching_domains": talent_data.get("matching_domains", []),
        "learning_recommendations": talent_data.get("learning_recommendations", []),
        "talent_development_focus": talent_data.get("talent_development_focus", []),
        "wellbeing": wellbeing_data
    }
    
    return result

