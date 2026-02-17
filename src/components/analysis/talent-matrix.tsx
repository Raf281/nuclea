"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RubricScores } from "@/lib/types";
import { Sparkles, TrendingUp } from "lucide-react";

// Career domain definitions with weighted rubric dimensions
const CAREER_DOMAINS = [
  {
    name: "Technology & Engineering",
    icon: "💻",
    weights: { structure: 0.3, clarity: 0.15, evidence: 0.25, originality: 0.15, coherence: 0.15 },
    color: "bg-blue-500",
  },
  {
    name: "Sciences & Research",
    icon: "🔬",
    weights: { structure: 0.25, clarity: 0.15, evidence: 0.35, originality: 0.1, coherence: 0.15 },
    color: "bg-emerald-500",
  },
  {
    name: "Humanities & Social Sciences",
    icon: "📚",
    weights: { structure: 0.15, clarity: 0.25, evidence: 0.2, originality: 0.2, coherence: 0.2 },
    color: "bg-amber-500",
  },
  {
    name: "Creative Arts & Design",
    icon: "🎨",
    weights: { structure: 0.1, clarity: 0.2, evidence: 0.05, originality: 0.45, coherence: 0.2 },
    color: "bg-pink-500",
  },
  {
    name: "Business & Management",
    icon: "📊",
    weights: { structure: 0.3, clarity: 0.25, evidence: 0.2, originality: 0.05, coherence: 0.2 },
    color: "bg-violet-500",
  },
  {
    name: "Law & Policy",
    icon: "⚖️",
    weights: { structure: 0.2, clarity: 0.2, evidence: 0.3, originality: 0.1, coherence: 0.2 },
    color: "bg-orange-500",
  },
];

function calculateFit(scores: RubricScores, weights: Record<keyof RubricScores, number>): number {
  let total = 0;
  for (const key of Object.keys(weights) as (keyof RubricScores)[]) {
    total += (scores[key] / 5) * weights[key];
  }
  return Math.round(total * 100);
}

interface TalentMatrixProps {
  scores: RubricScores;
  talentIndicators: string[];
  matchingDomains: string[];
}

export function TalentMatrix({ scores, talentIndicators, matchingDomains }: TalentMatrixProps) {
  const domainFits = CAREER_DOMAINS.map((domain) => ({
    ...domain,
    fit: calculateFit(scores, domain.weights),
  })).sort((a, b) => b.fit - a.fit);

  const topDomain = domainFits[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4" />
          Career Domain Fit Matrix
          <Badge variant="secondary" className="text-[10px]">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Top match highlight */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Strongest Alignment</span>
          </div>
          <p className="text-lg font-semibold">
            {topDomain.icon} {topDomain.name}
            <span className="text-primary ml-2">{topDomain.fit}%</span>
          </p>
        </div>

        {/* Domain fit bars */}
        <div className="space-y-3">
          {domainFits.map((domain) => (
            <div key={domain.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{domain.icon}</span>
                  <span className="font-medium">{domain.name}</span>
                </span>
                <span className="tabular-nums font-semibold text-muted-foreground">{domain.fit}%</span>
              </div>
              <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${domain.color} transition-all duration-500`}
                  style={{ width: `${domain.fit}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dimension contribution breakdown */}
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Score Contribution
          </p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {(["structure", "clarity", "evidence", "originality", "coherence"] as const).map((dim) => {
              const val = scores[dim];
              const pct = Math.round((val / 5) * 100);
              return (
                <div key={dim} className="space-y-1">
                  <div
                    className="mx-auto h-16 w-full rounded-md bg-muted relative overflow-hidden"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary/30 transition-all"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums">
                      {val}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground capitalize">{dim.slice(0, 4)}.</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI-detected talent indicators mapped to domains */}
        {talentIndicators.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Detected Talent Signals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {talentIndicators.map((t, i) => (
                <Badge key={i} variant="outline" className="text-xs py-0.5 px-2">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground italic">
          Based on rubric dimension analysis. Indicative only — not diagnostic. Career domain fit is calculated from writing skill patterns.
        </p>
      </CardContent>
    </Card>
  );
}
