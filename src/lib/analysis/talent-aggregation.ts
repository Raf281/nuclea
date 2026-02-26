// ============================================================================
// NUCLEA Longitudinal Talent Aggregation
// Aggregates multiple analyses into a unified talent profile over time
// ============================================================================

import type { Work, RubricScores, AnalysisResult } from "@/lib/types";

// ---------- Types ----------

export interface ScoreDataPoint {
  date: string;
  workTitle: string;
  structure: number;
  clarity: number;
  evidence: number;
  originality: number;
  coherence: number;
  average: number;
}

export interface TalentSignal {
  indicator: string;
  frequency: number;
  totalAnalyses: number;
  confidence: number; // 0-100
}

export interface DomainFitDataPoint {
  date: string;
  workTitle: string;
  [domainName: string]: string | number; // domain name -> fit %
}

export interface DimensionTrajectory {
  dimension: keyof RubricScores;
  label: string;
  firstScore: number;
  lastScore: number;
  averageScore: number;
  trend: "improving" | "stable" | "declining";
  changePercent: number;
}

export interface AggregatedTalentProfile {
  scoreProgression: ScoreDataPoint[];
  talentSignals: TalentSignal[];
  domainFitProgression: DomainFitDataPoint[];
  trajectories: DimensionTrajectory[];
  topDomains: { name: string; icon: string; avgFit: number; color: string }[];
  consistentStrengths: string[];
  totalAnalyses: number;
}

// ---------- Career Domain Weights (same as talent-matrix.tsx) ----------

const CAREER_DOMAINS = [
  {
    name: "Technology",
    icon: "💻",
    weights: { structure: 0.3, clarity: 0.15, evidence: 0.25, originality: 0.15, coherence: 0.15 },
    color: "#3b82f6",
  },
  {
    name: "Sciences",
    icon: "🔬",
    weights: { structure: 0.25, clarity: 0.15, evidence: 0.35, originality: 0.1, coherence: 0.15 },
    color: "#10b981",
  },
  {
    name: "Humanities",
    icon: "📚",
    weights: { structure: 0.15, clarity: 0.25, evidence: 0.2, originality: 0.2, coherence: 0.2 },
    color: "#f59e0b",
  },
  {
    name: "Creative Arts",
    icon: "🎨",
    weights: { structure: 0.1, clarity: 0.2, evidence: 0.05, originality: 0.45, coherence: 0.2 },
    color: "#ec4899",
  },
  {
    name: "Business",
    icon: "📊",
    weights: { structure: 0.3, clarity: 0.25, evidence: 0.2, originality: 0.05, coherence: 0.2 },
    color: "#8b5cf6",
  },
  {
    name: "Law",
    icon: "⚖️",
    weights: { structure: 0.2, clarity: 0.2, evidence: 0.3, originality: 0.1, coherence: 0.2 },
    color: "#f97316",
  },
];

function calculateFit(scores: RubricScores, weights: Record<keyof RubricScores, number>): number {
  let total = 0;
  for (const key of Object.keys(weights) as (keyof RubricScores)[]) {
    total += (scores[key] / 5) * weights[key];
  }
  return Math.round(total * 100);
}

// ---------- Dimension Labels ----------

const DIMENSION_LABELS: Record<keyof RubricScores, string> = {
  structure: "Structure",
  clarity: "Clarity",
  evidence: "Evidence",
  originality: "Originality",
  coherence: "Coherence",
};

// ---------- Core Aggregation ----------

export function aggregateTalentProfile(
  works: (Work & { student_name?: string })[]
): AggregatedTalentProfile | null {
  // Filter works that have analyses
  const analyzedWorks = works
    .filter((w) => w.analysis)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (analyzedWorks.length === 0) return null;

  // --- Score Progression ---
  const scoreProgression: ScoreDataPoint[] = analyzedWorks.map((w) => {
    const a = w.analysis!;
    const scores: RubricScores = {
      structure: a.score_structure,
      clarity: a.score_clarity,
      evidence: a.score_evidence,
      originality: a.score_originality,
      coherence: a.score_coherence,
    };
    const avg = Object.values(scores).reduce((sum, v) => sum + v, 0) / 5;
    return {
      date: w.created_at,
      workTitle: w.title,
      ...scores,
      average: Math.round(avg * 10) / 10,
    };
  });

  // --- Talent Signal Frequency ---
  const indicatorCount = new Map<string, number>();
  const totalAnalyses = analyzedWorks.length;

  for (const w of analyzedWorks) {
    const result = w.analysis!.result_json;
    if (result?.talent_indicators) {
      for (const indicator of result.talent_indicators) {
        // Normalize: trim and lowercase for matching, keep original for display
        const normalized = indicator.trim();
        indicatorCount.set(normalized, (indicatorCount.get(normalized) || 0) + 1);
      }
    }
  }

  const talentSignals: TalentSignal[] = Array.from(indicatorCount.entries())
    .map(([indicator, frequency]) => ({
      indicator,
      frequency,
      totalAnalyses,
      confidence: Math.round((frequency / totalAnalyses) * 100),
    }))
    .sort((a, b) => b.confidence - a.confidence);

  // --- Domain Fit Progression ---
  const domainFitProgression: DomainFitDataPoint[] = analyzedWorks.map((w) => {
    const a = w.analysis!;
    const scores: RubricScores = {
      structure: a.score_structure,
      clarity: a.score_clarity,
      evidence: a.score_evidence,
      originality: a.score_originality,
      coherence: a.score_coherence,
    };
    const point: DomainFitDataPoint = {
      date: w.created_at,
      workTitle: w.title,
    };
    for (const domain of CAREER_DOMAINS) {
      point[domain.name] = calculateFit(scores, domain.weights);
    }
    return point;
  });

  // --- Dimension Trajectories ---
  const dimensions = Object.keys(DIMENSION_LABELS) as (keyof RubricScores)[];
  const trajectories: DimensionTrajectory[] = dimensions.map((dim) => {
    const values = scoreProgression.map((p) => p[dim] as number);
    const first = values[0];
    const last = values[values.length - 1];
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const change = last - first;
    const changePercent = first > 0 ? Math.round((change / first) * 100) : 0;

    let trend: "improving" | "stable" | "declining" = "stable";
    if (change > 0.5) trend = "improving";
    else if (change < -0.5) trend = "declining";

    return {
      dimension: dim,
      label: DIMENSION_LABELS[dim],
      firstScore: first,
      lastScore: last,
      averageScore: Math.round(avg * 10) / 10,
      trend,
      changePercent,
    };
  });

  // --- Top Domains (averaged across all analyses) ---
  const domainAvgFits = CAREER_DOMAINS.map((domain) => {
    const fits = domainFitProgression.map((p) => p[domain.name] as number);
    const avgFit = Math.round(fits.reduce((s, v) => s + v, 0) / fits.length);
    return { name: domain.name, icon: domain.icon, avgFit, color: domain.color };
  }).sort((a, b) => b.avgFit - a.avgFit);

  // --- Consistent Strengths ---
  const strengthCount = new Map<string, number>();
  for (const w of analyzedWorks) {
    const result = w.analysis!.result_json;
    if (result?.strengths) {
      for (const s of result.strengths) {
        // Extract the label part before the " + " quote reference
        const label = s.split(" + ")[0].trim();
        strengthCount.set(label, (strengthCount.get(label) || 0) + 1);
      }
    }
  }
  const consistentStrengths = Array.from(strengthCount.entries())
    .filter(([, count]) => count >= Math.ceil(totalAnalyses * 0.4)) // appears in >=40% of analyses
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label);

  return {
    scoreProgression,
    talentSignals,
    domainFitProgression,
    trajectories,
    topDomains: domainAvgFits,
    consistentStrengths,
    totalAnalyses,
  };
}
