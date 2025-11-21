"""
NUCLEA V0 - Streamlit User Interface

Dies ist die Benutzeroberfläche - was der Nutzer sieht und bedient.
Streamlit ist ein Framework, das Python-Code in eine Web-App verwandelt.
"""

import streamlit as st
from analysis import analyze_text, extract_text_from_file
import json
import time
from datetime import datetime

# ============================================================================
# KONFIGURATION
# ============================================================================
# Warum: Diese Einstellungen bestimmen, wie die App aussieht und sich verhält.

st.set_page_config(
    page_title="NUCLEA V0",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for professional styling
st.markdown("""
    <style>
    .nuclea-header {
        font-size: 24px;
        font-weight: 300;
        color: #8A8A8A;
        margin: 0;
        padding: 0;
        line-height: 1.2;
        letter-spacing: 1px;
        display: inline-block;
    }
    .v0-tag {
        font-size: 16px;
        color: #8A8A8A;
        font-weight: 300;
        letter-spacing: 0.5px;
        margin: 0;
        padding: 0;
        line-height: 24px;
        vertical-align: baseline;
    }
    .header-container {
        display: flex;
        align-items: baseline;
        gap: 8px;
    }
    .section-spacing {
        margin-top: 3rem;
        margin-bottom: 2rem;
    }
    .subsection-spacing {
        margin-top: 2rem;
        margin-bottom: 1.5rem;
    }
    </style>
""", unsafe_allow_html=True)

# ============================================================================
# HAUPTLAYOUT
# ============================================================================

def main():
    """
    Hauptfunktion der App - wird beim Start ausgeführt.
    """
    # Professional Header - NUCLEA and V0 in one row
    st.markdown('<div class="header-container"><span class="nuclea-header">NUCLEA</span><span class="v0-tag">V0</span></div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    st.caption("Objective evaluation → Profile & growth plan. No storage.")
    
    # Persist study level in session state
    if "study_level" not in st.session_state:
        st.session_state["study_level"] = "Default Mode"
    if "study_level_toggle" not in st.session_state:
        st.session_state["study_level_toggle"] = False  # Default Mode on first load
    
    # Study Level Toggle with explanation (between caption and Input)
    toggle_col, expl_col = st.columns([1, 1])
    with toggle_col:
        toggle_value = st.toggle(
            "Elementary Mode",
            key="study_level_toggle",
            label_visibility="visible",
            help="Switch on for elementary-school texts (age 6-12). Switch off for high school & university work."
        )
    st.session_state["study_level"] = "Elementary Mode" if toggle_value else "Default Mode"
    study_level = st.session_state["study_level"]
    
    with expl_col:
        if study_level == "Elementary Mode":
            st.caption("Elementary Mode active (Age 6-12)")
        else:
            st.caption("Default Mode active (High school & University)")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Sidebar für Einstellungen (optional, hier für Wellbeing-Toggle)
    with st.sidebar:
        st.markdown("### Settings")
        wellbeing_enabled = st.checkbox(
            "Enable Wellbeing Signals (opt-in)",
            value=False,
            help="Enable this option to check for potential wellbeing signals. Default: OFF."
        )
    
    # ========================================================================
    # EINGABE-BEREICH
    # ========================================================================
    # Warum: Hier kann der Nutzer Text eingeben oder eine Datei hochladen.
    
    st.markdown('<div class="section-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Input")
    
    # Option 1: Text direkt einfügen
    text_input = st.text_area(
        "Enter text:",
        height=200,
        placeholder="Paste the academic work text here...",
        help="Minimum 20 characters required (short inputs may reduce analysis quality)."
    )
    
    # Option 2: Datei hochladen
    st.markdown("**OR** upload a file:")
    uploaded_file = st.file_uploader(
        "Choose a file (.txt, .pdf, .docx)",
        type=['txt', 'pdf', 'docx'],
        help="Supported formats: TXT, PDF, DOCX"
    )
    
    # Text aus Datei extrahieren (falls hochgeladen)
    if uploaded_file is not None:
        try:
            with st.spinner("Extracting text from file..."):
                file_content = uploaded_file.read()
                extracted_text = extract_text_from_file(file_content, uploaded_file.name)
                text_input = extracted_text
            st.success(f"File '{uploaded_file.name}' loaded successfully ({len(extracted_text)} characters)")
        except Exception as e:
            st.error(f"Error loading file: {str(e)}")
            text_input = ""
    
    # ========================================================================
    # ANALYSE-BUTTON
    # ========================================================================
    # Warum: Der Nutzer klickt hier, um die Analyse zu starten.
    
    st.markdown("<br>", unsafe_allow_html=True)
    analyze_button = st.button(
        "Analyze",
        type="primary",
        use_container_width=True
    )
    st.markdown("<br>", unsafe_allow_html=True)
    
    # ========================================================================
    # ANALYSE-LOGIK
    # ========================================================================
    # Warum: Wenn der Button geklickt wird, starten wir die Analyse
    # und zeigen die Ergebnisse an.
    
    if analyze_button:
        min_chars = 20
        short_threshold = 80
        if not text_input or len(text_input.strip()) < min_chars:
            st.warning("Please enter at least 20 characters of text or upload a file.")
        else:
            if len(text_input.strip()) < short_threshold:
                st.warning("Input is very short. Results may be limited; longer work produces richer analysis.")
            
            # Progress-Balken mit Prozentanzeige (nur während Analyse)
            progress_container = st.empty()
            status_text = st.empty()
            
            try:
                # Progress-Balken erstellen wenn Analyse startet
                with progress_container.container():
                    col1, col2 = st.columns([4, 1])
                    with col1:
                        progress_bar = st.progress(0)
                    with col2:
                        percent_text = st.empty()
                
                # Progress-Callback für synchronisierte Updates
                def update_progress(percent: int, message: str):
                    progress_bar.progress(percent / 100.0)
                    percent_text.markdown(f"**{percent}%**")
                    status_text.text(message)
                
                # Analyse starten mit synchronisierter Prozentanzeige
                update_progress(0, "Starting analysis...")
                result = analyze_text(text_input, wellbeing=wellbeing_enabled, study_level=study_level, progress_callback=update_progress)
                
                # Final: 100%
                update_progress(100, "Analysis complete.")
                
                # Ergebnisse anzeigen
                display_results(result, wellbeing_enabled, study_level)
                
                # Download-Button und Create Profile Button (Beta)
                st.markdown("<br><br>", unsafe_allow_html=True)
                report_markdown = generate_report_markdown(result, wellbeing_enabled, study_level)
                
                col1, col2 = st.columns(2)
                with col1:
                    st.download_button(
                        label="Download Report (Markdown)",
                        data=report_markdown,
                        file_name=f"nuclea_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md",
                        mime="text/markdown",
                        use_container_width=True
                    )
                with col2:
                    st.button(
                        label="Create Profile (Beta)",
                        disabled=True,
                        use_container_width=True,
                        help="Available in Beta - Save profiles for talent development"
                    )
                
            except Exception as e:
                st.error(f"Analysis error: {str(e)}")
                st.info("Tip: Ensure your API key is set in the .env file.")
            
            finally:
                progress_bar.empty()
                status_text.empty()


# ============================================================================
# ERGEBNIS-ANZEIGE
# ============================================================================
# Warum: Diese Funktion zeigt die Analyse-Ergebnisse schön formatiert an.

def display_results(result: dict, wellbeing_enabled: bool, study_level: str = "Default Mode"):
    """
    Displays analysis results in V0.1 structure (compact, VC-tester friendly).
    
    Args:
        result: The result dictionary from analyze_text()
        wellbeing_enabled: Whether to show wellbeing signals
    """
    # Mode indicator
    if study_level == "Elementary Mode":
        st.info(f"**Mode:** {study_level} - Age-appropriate analysis for elementary school work")
    
    # ========================================================================
    # A. RUBRIC SCORES
    # ========================================================================
    st.markdown('<div class="section-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Evaluation Rubric")
    st.markdown("Structure | Clarity | Evidence | Originality | Coherence")
    st.markdown("<br>", unsafe_allow_html=True)
    
    rubric = result.get("rubric", {})
    scores = rubric.get("scores", {})
    justifications = rubric.get("justifications", {})
    
    # Rubric Scores in clean format
    col1, col2, col3, col4, col5 = st.columns(5)
    dimensions = ["structure", "clarity", "evidence", "originality", "coherence"]
    cols = [col1, col2, col3, col4, col5]
    
    for dim, col in zip(dimensions, cols):
        with col:
            score = scores.get(dim, 0)
            st.markdown(f"**{dim.capitalize()}**")
            st.markdown(f"### {score}/5")
            st.progress(score / 5.0)
            justification = justifications.get(dim, "")
            if justification:
                st.caption(justification)
    
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # ========================================================================
    # B. STRENGTHS
    # ========================================================================
    st.markdown('<div class="section-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Strengths")
    strengths = result.get("strengths", [])
    if strengths:
        for i, strength in enumerate(strengths, 1):
            st.markdown(f"{i}. {strength}")
    else:
        st.info("No strengths found.")
    
    # ========================================================================
    # C. GROWTH AREAS
    # ========================================================================
    st.markdown('<div class="subsection-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Growth Areas")
    growth_areas = result.get("growth_areas", [])
    if growth_areas:
        for i, area in enumerate(growth_areas, 1):
            st.markdown(f"{i}. {area}")
    else:
        st.info("No growth areas found.")
    
    # ========================================================================
    # D. COGNITIVE PATTERN SUMMARY
    # ========================================================================
    st.markdown('<div class="subsection-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Cognitive Pattern")
    cognitive_pattern = result.get("cognitive_pattern", "")
    if cognitive_pattern:
        st.markdown(cognitive_pattern)
    else:
        st.info("No cognitive pattern available.")
    
    # ========================================================================
    # E. DEVELOPMENT PLAN
    # ========================================================================
    st.markdown('<div class="subsection-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### 3-Day Development Plan")
    development_plan = result.get("development_plan", [])
    if development_plan:
        for day_plan in development_plan:
            st.markdown(f"- {day_plan}")
    else:
        st.info("No development plan available.")
    
    # ========================================================================
    # F. TALENT INDICATORS
    # ========================================================================
    st.markdown('<div class="section-spacing"></div>', unsafe_allow_html=True)
    st.markdown("### Talent Indicators")
    talent_indicators = result.get("talent_indicators", [])
    if talent_indicators:
        for i, indicator in enumerate(talent_indicators, 1):
            st.markdown(f"{i}. {indicator}")
    else:
        st.info("No talent indicators identified.")
    
    # ========================================================================
    # F.1. TALENT DEVELOPMENT FOCUS (Default Mode only)
    # ========================================================================
    if study_level == "Default Mode":
        talent_development_focus = result.get("talent_development_focus", [])
        if talent_development_focus:
            st.markdown('<div class="subsection-spacing"></div>', unsafe_allow_html=True)
            st.markdown("### Talent Development Focus")
            for i, focus_item in enumerate(talent_development_focus, 1):
                if isinstance(focus_item, dict):
                    talent = focus_item.get("talent", "")
                    rationale = focus_item.get("rationale", "")
                    next_steps = focus_item.get("next_steps", [])
                    st.markdown(f"**{i}. {talent}**")
                    if rationale:
                        st.markdown(f"   *{rationale}*")
                    if next_steps:
                        for step in next_steps:
                            st.markdown(f"   - {step}")
                else:
                    st.markdown(f"{i}. {focus_item}")
    
    # ========================================================================
    # G. MATCHING DOMAINS / LEARNING RECOMMENDATIONS
    # ========================================================================
    st.markdown('<div class="subsection-spacing"></div>', unsafe_allow_html=True)
    matching_domains = result.get("matching_domains", [])
    learning_recommendations = result.get("learning_recommendations", [])
    
    if study_level == "Elementary Mode":
        st.markdown("### Learning Recommendations")
        if learning_recommendations:
            for i, rec in enumerate(learning_recommendations, 1):
                st.markdown(f"{i}. {rec}")
        elif matching_domains:
            # Fallback: use matching_domains if learning_recommendations not available
            for i, domain in enumerate(matching_domains, 1):
                st.markdown(f"{i}. {domain}")
        else:
            st.info("No learning recommendations found.")
    else:
        st.markdown("### Matching Domains")
        if matching_domains:
            for i, domain in enumerate(matching_domains, 1):
                st.markdown(f"{i}. {domain}")
        else:
            st.info("No matching domains found.")
    
    # ========================================================================
    # WELLBEING SIGNALS (optional)
    # ========================================================================
    if wellbeing_enabled:
        st.markdown('<div class="section-spacing"></div>', unsafe_allow_html=True)
        st.markdown("### Wellbeing Signals (opt-in)")
        
        wellbeing = result.get("wellbeing")
        if wellbeing:
            level = wellbeing.get("level", "none")
            note = wellbeing.get("note", "")
            next_step = wellbeing.get("next_step", "")
            
            if level == "none":
                st.success(f"**Level:** {level.upper()}")
            elif level == "mild":
                st.warning(f"**Level:** {level.upper()}")
            elif level == "flag":
                st.error(f"**Level:** {level.upper()}")
            else:
                st.info(f"**Level:** {level}")
            
            st.markdown(f"**Note:** {note}")
            st.markdown(f"**Next Step:** {next_step}")
            st.markdown("<br>", unsafe_allow_html=True)
            st.caption("**Disclaimer:** Indicative, not diagnostic. Decisions by humans.")
        else:
            st.info("No wellbeing data available.")


# ============================================================================
# REPORT-GENERIERUNG
# ============================================================================
# Warum: Der Nutzer kann den Report als Markdown-Datei herunterladen.

def generate_report_markdown(result: dict, wellbeing_enabled: bool, study_level: str = "Default Mode") -> str:
    """
    Erstellt einen Markdown-Report aus den Analyse-Ergebnissen.
    
    Args:
        result: Das Ergebnis-Dictionary
        wellbeing_enabled: Ob Wellbeing-Signale enthalten sein sollen
    
    Returns:
        Markdown-String
    """
    report = f"""# NUCLEA V0.1 - Analysis Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

## A. Evaluation Rubric

"""
    
    rubric = result.get("rubric", {})
    scores = rubric.get("scores", {})
    justifications = rubric.get("justifications", {})
    
    for dimension, score in scores.items():
        report += f"### {dimension.capitalize()}: {score}/5\n"
        report += f"{justifications.get(dimension, '')}\n\n"
    
    report += "---\n\n## B. Strengths\n\n"
    strengths = result.get("strengths", [])
    for i, strength in enumerate(strengths, 1):
        report += f"{i}. {strength}\n"
    
    report += "\n---\n\n## C. Growth Areas\n\n"
    growth_areas = result.get("growth_areas", [])
    for i, area in enumerate(growth_areas, 1):
        report += f"{i}. {area}\n"
    
    report += "\n---\n\n## D. Cognitive Pattern\n\n"
    cognitive_pattern = result.get("cognitive_pattern", "")
    report += f"{cognitive_pattern}\n"
    
    report += "\n---\n\n## E. 3-Day Development Plan\n\n"
    development_plan = result.get("development_plan", [])
    for day_plan in development_plan:
        report += f"- {day_plan}\n"
    
    report += "\n---\n\n## F. Talent Indicators\n\n"
    talent_indicators = result.get("talent_indicators", [])
    for i, indicator in enumerate(talent_indicators, 1):
        report += f"{i}. {indicator}\n"
    
    # Talent Development Focus (Default Mode only)
    if study_level == "Default Mode":
        talent_development_focus = result.get("talent_development_focus", [])
        if talent_development_focus:
            report += "\n---\n\n## F.1. Talent Development Focus\n\n"
            for i, focus_item in enumerate(talent_development_focus, 1):
                if isinstance(focus_item, dict):
                    talent = focus_item.get("talent", "")
                    rationale = focus_item.get("rationale", "")
                    next_steps = focus_item.get("next_steps", [])
                    report += f"**{i}. {talent}**\n"
                    if rationale:
                        report += f"   *{rationale}*\n"
                    if next_steps:
                        for step in next_steps:
                            report += f"   - {step}\n"
                    report += "\n"
                else:
                    report += f"{i}. {focus_item}\n"
    
    matching_domains = result.get("matching_domains", [])
    learning_recommendations = result.get("learning_recommendations", [])
    
    if study_level == "Elementary Mode":
        report += "\n---\n\n## G. Learning Recommendations\n\n"
        if learning_recommendations:
            for i, rec in enumerate(learning_recommendations, 1):
                report += f"{i}. {rec}\n"
        elif matching_domains:
            for i, domain in enumerate(matching_domains, 1):
                report += f"{i}. {domain}\n"
    else:
        report += "\n---\n\n## G. Matching Domains\n\n"
        for i, domain in enumerate(matching_domains, 1):
            report += f"{i}. {domain}\n"
    
    if wellbeing_enabled:
        wellbeing = result.get("wellbeing")
        if wellbeing:
            report += "\n---\n\n## Wellbeing Signals\n\n"
            report += f"**Level:** {wellbeing.get('level', 'none')}\n\n"
            report += f"**Note:** {wellbeing.get('note', '')}\n\n"
            report += f"**Next Step:** {wellbeing.get('next_step', '')}\n\n"
            report += "**Disclaimer:** Indicative, not diagnostic. Decisions by humans.\n"
    
    return report


# ============================================================================
# APP-START
# ============================================================================
# Warum: Wenn die Datei direkt ausgeführt wird (nicht importiert),
# startet Streamlit die App.

if __name__ == "__main__":
    main()

