"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { RubricScores } from "@/lib/types";

interface RubricChartProps {
  scores: RubricScores;
  className?: string;
}

export function RubricChart({ scores, className }: RubricChartProps) {
  const data = [
    { dimension: "Structure", score: scores.structure, fullMark: 5 },
    { dimension: "Clarity", score: scores.clarity, fullMark: 5 },
    { dimension: "Evidence", score: scores.evidence, fullMark: 5 },
    { dimension: "Originality", score: scores.originality, fullMark: 5 },
    { dimension: "Coherence", score: scores.coherence, fullMark: 5 },
  ];

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="oklch(0.6 0.2 264)"
            fill="oklch(0.6 0.2 264)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
