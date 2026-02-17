// ============================================================================
// NUCLEA Analysis Prompts — Ported from legacy/analysis.py
// ============================================================================
// IMPORTANT: These prompts are carefully tuned. Do not modify wording without
// verifying output quality. Evidence-based language is critical.

import type { RubricScores } from "@/lib/types";

export function buildRubricPrompt(text: string, isElementary: boolean): string {
  const maxLen = isElementary ? 500 : 2000;
  const excerpt = text.slice(0, maxLen);

  if (isElementary) {
    return `Analyze this elementary school work and assign scores (0-5) across five age-appropriate criteria:

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
${excerpt}

**Respond ONLY with JSON using this schema:**
{
  "scores": {
    "structure": 0-5,
    "clarity": 0-5,
    "evidence": 0-5,
    "originality": 0-5,
    "coherence": 0-5
  },
  "justifications": {
    "structure": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "clarity": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "evidence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "originality": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "coherence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence."
  }
}`;
  }

  return `Analyze the following academic work and assign scores (0-5) across five fixed criteria based on observable text behavior:

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
${excerpt}

**Respond ONLY with JSON using this schema:**
{
  "scores": {
    "structure": 0-5,
    "clarity": 0-5,
    "evidence": 0-5,
    "originality": 0-5,
    "coherence": 0-5
  },
  "justifications": {
    "structure": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "clarity": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "evidence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "originality": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence.",
    "coherence": "1-2 sentences describing observable behavior. Include direct quote (≤6 words) as evidence."
  }
}`;
}

export function buildProfilePrompt(
  scores: RubricScores,
  text: string,
  isElementary: boolean
): string {
  const maxLen = isElementary ? 500 : 1500;
  const excerpt = text.slice(0, maxLen);
  const scoresJson = JSON.stringify(scores, null, 2);

  if (isElementary) {
    return `Analyze this elementary school work and produce a structured profile:

**Scores:**
${scoresJson}

**Text (excerpt):**
${excerpt}

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
{
  "strengths": ["Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)"],
  "growth_areas": ["Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)"],
  "cognitive_pattern": "2 sentences: reasoning type, information organization, abstraction level, problem-solving approach",
  "development_plan": ["Day 1: Activity related to student interest to improve skill", "Day 2: Activity related to student interest to improve skill", "Day 3: Activity related to student interest to improve skill"]
}`;
  }

  return `Analyze the academic work and produce a structured cognitive profile:

**Scores:**
${scoresJson}

**Text (excerpt):**
${excerpt}

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
{
  "strengths": ["Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)", "Cognitive skill name + cited excerpt (≤6 words)"],
  "growth_areas": ["Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)", "Concrete skill gap + cited excerpt (≤6 words)"],
  "cognitive_pattern": "2-3 sentences: reasoning type, information organization, abstraction level, problem-solving approach",
  "development_plan": ["Day 1: Targeted exercise linked to growth areas", "Day 2: Targeted exercise linked to growth areas", "Day 3: Targeted exercise linked to growth areas"]
}`;
}

export function buildTalentPrompt(
  profileData: { strengths: string[]; cognitive_pattern: string },
  scores: RubricScores,
  text: string,
  isElementary: boolean
): string {
  const scoresJson = JSON.stringify(scores, null, 2);
  const strengthsJson = JSON.stringify(profileData.strengths, null, 2);

  if (isElementary) {
    return `Based on this elementary school work, identify talent indicators and matching domains:

**Strengths:**
${strengthsJson}

**Cognitive Pattern:**
${profileData.cognitive_pattern}

**Scores:**
${scoresJson}

**Full Text (read carefully to extract ALL specific interests mentioned - favorite sports, hobbies, subjects, colors, foods, etc.):**
${text}

**Deliver:**

E. **Talent Indicators (3-5 items)**: Early indicators of natural strengths, expressed as:
   - skill clusters appropriate for elementary level (e.g., "Narrative thinking + Topic organization", "Sports-themed narrative thinking")
   - ways of thinking (e.g., "Descriptive thinking", "Personal experience-based reasoning")
   - interest-based patterns visible in text (e.g., "Sports-oriented", "Creative expression")

F. **Learning Recommendations (3-5 items)**: Concrete, practical recommendations on how to best teach and learn based on EXACT interests extracted from the text.

**CRITICAL REQUIREMENTS:**
1. Extract SPECIFIC interests from the text (e.g., if text says "I like football" -> use "football", if text says "My favorite sport is Leichtathletik" -> use "Leichtathletik", if text says "I like pizza" -> use "pizza/cooking")
2. Each recommendation MUST reference the specific interest mentioned in the text
3. Format: "Subject + specific task with interest: Detailed description"
4. Be VERY specific and detailed - not generic like "English with personal interests" but concrete like "English texts about football: Read stories about FC Bayern Munich, write a short report about your favorite match, learn vocabulary about football positions and rules"

**ABSOLUTE RESTRICTIONS:**
- Use precise, neutral, skill-based language
- NO personality, emotion, or character descriptions
- NO psychological diagnosis
- NO moral judgement
- Focus ONLY on observable cognitive operations and interests mentioned in text
- Each recommendation must be specific and actionable

**Respond ONLY with JSON:**
{
  "talent_indicators": ["Skill cluster or thinking style", "Skill cluster or thinking style", "Skill cluster or thinking style"],
  "learning_recommendations": ["Subject + specific interest-based example", "Subject + specific interest-based example", "Subject + specific interest-based example"]
}`;
  }

  return `Based on the analysis, identify early talent indicators and matching domains:

**Strengths:**
${strengthsJson}

**Cognitive Pattern:**
${profileData.cognitive_pattern}

**Scores:**
${scoresJson}

**Text (excerpt):**
${text.slice(0, 1200)}

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
{
  "talent_indicators": ["Skill cluster or thinking style", "Skill cluster or thinking style", "Skill cluster or thinking style"],
  "matching_domains": ["Academic field or career area", "Academic field or career area", "Academic field or career area"],
  "talent_development_focus": [
    {
      "talent": "Talent name from indicators",
      "rationale": "1 sentence: why prioritize this talent",
      "next_steps": ["Concrete action 1", "Concrete action 2"]
    }
  ]
}`;
}

export function buildWellbeingPrompt(text: string, keywords: string[]): string {
  const keywordInfo = keywords.length > 0
    ? `Detected keywords: ${keywords.join(", ")}`
    : "No flagged keywords detected";

  return `Review the following text for potential wellbeing signals (NOT a diagnosis):

**Text:**
${text.slice(0, 2000)}

**Keyword context:**
${keywordInfo}

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
{
  "level": "none|mild|flag",
  "note": "One sentence rationale (cautious wording)",
  "next_step": "One sentence, human action suggestion (e.g., 'Offer a check-in conversation')"
}`;
}
