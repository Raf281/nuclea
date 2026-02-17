// ============================================================================
// NUCLEA Analysis Pipeline — Core analysis orchestration
// Ported from legacy/analysis.py analyze_text()
// ============================================================================

import Anthropic from "@anthropic-ai/sdk";
import {
  buildRubricPrompt,
  buildProfilePrompt,
  buildTalentPrompt,
  buildMentalMonitoringPrompt,
} from "./prompts";
import { checkMentalMonitoringKeywords } from "./mental-monitoring-keywords";
import type { AnalysisResult, AnalysisMode, RubricScores, TalentFocus, MentalMonitoringResult } from "@/lib/types";

const DEFAULT_SCORES: RubricScores = {
  structure: 3, clarity: 3, evidence: 3, originality: 3, coherence: 3,
};

function getClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function callLLM(prompt: string): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (block.type === "text") return block.text;
  return "{}";
}

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleaned = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export async function analyzeText(
  text: string,
  options: {
    analysisMode?: AnalysisMode;
    mentalMonitoringEnabled?: boolean;
    onProgress?: (percent: number, message: string) => void;
  } = {}
): Promise<AnalysisResult> {
  const { analysisMode = "highschool", mentalMonitoringEnabled = false, onProgress } = options;
  const startTime = Date.now();

  if (!text || text.trim().length < 20) {
    throw new Error("Input too short. Provide at least 20 characters for analysis.");
  }

  // Step 1: Rubric Scores
  onProgress?.(20, "Evaluating rubric scores...");
  const rubricPrompt = buildRubricPrompt(text, analysisMode);
  const rubricRaw = await callLLM(rubricPrompt);
  const rubricData = parseJSON<{ scores?: RubricScores; justifications?: Record<string, string> }>(
    rubricRaw,
    { scores: DEFAULT_SCORES, justifications: {} }
  );
  const scores = rubricData.scores || DEFAULT_SCORES;
  const justifications = rubricData.justifications || {};

  // Step 2: Profile
  onProgress?.(50, "Building cognitive profile...");
  const profilePrompt = buildProfilePrompt(scores, text, analysisMode);
  const profileRaw = await callLLM(profilePrompt);
  const profileData = parseJSON<{
    strengths?: string[];
    growth_areas?: string[];
    cognitive_pattern?: string;
    development_plan?: string[];
  }>(profileRaw, {});

  // Step 3: Talent
  onProgress?.(75, "Identifying talents...");
  const talentPrompt = buildTalentPrompt(
    {
      strengths: profileData.strengths || [],
      cognitive_pattern: profileData.cognitive_pattern || "",
    },
    scores,
    text,
    analysisMode
  );
  const talentRaw = await callLLM(talentPrompt);
  const talentData = parseJSON<{
    talent_indicators?: string[];
    matching_domains?: string[];
    learning_recommendations?: string[];
    talent_development_focus?: TalentFocus[];
  }>(talentRaw, {});

  // Step 4: Mental Monitoring (optional)
  let mentalMonitoringData: MentalMonitoringResult | null = null;
  if (mentalMonitoringEnabled) {
    onProgress?.(90, "Running mental monitoring check...");
    const keywords = checkMentalMonitoringKeywords(text);
    const monitoringPrompt = buildMentalMonitoringPrompt(text, keywords);
    const monitoringRaw = await callLLM(monitoringPrompt);
    mentalMonitoringData = parseJSON<MentalMonitoringResult>(monitoringRaw, {
      level: "none",
      note: "Assessment unavailable.",
      next_step: "Continue standard monitoring.",
    });
  }

  onProgress?.(100, "Finalizing results...");

  const processingTime = Date.now() - startTime;

  return {
    rubric: {
      scores,
      justifications: justifications as Record<keyof RubricScores, string>,
    },
    strengths: profileData.strengths || [],
    growth_areas: profileData.growth_areas || [],
    cognitive_pattern: profileData.cognitive_pattern || "",
    development_plan: profileData.development_plan || [],
    talent_indicators: talentData.talent_indicators || [],
    matching_domains: talentData.matching_domains || [],
    learning_recommendations: talentData.learning_recommendations || [],
    talent_development_focus: talentData.talent_development_focus || [],
    mental_monitoring: mentalMonitoringData,
  };
}
