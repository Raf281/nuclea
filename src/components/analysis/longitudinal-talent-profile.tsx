"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Work } from "@/lib/types";
import {
  aggregateTalentProfile,
  type AggregatedTalentProfile,
} from "@/lib/analysis/talent-aggregation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Brain,
  Zap,
} from "lucide-react";

// ---------- Color palette ----------

const DIMENSION_COLORS: Record<string, string> = {
  structure: "#3b82f6",   // blue
  clarity: "#8b5cf6",     // violet
  evidence: "#10b981",    // emerald
  originality: "#f59e0b", // amber
  coherence: "#ec4899",   // pink
};

const DOMAIN_COLORS: Record<string, string> = {
  Technology: "#3b82f6",
  Sciences: "#10b981",
  Humanities: "#f59e0b",
  "Creative Arts": "#ec4899",
  Business: "#8b5cf6",
  Law: "#f97316",
};

// ---------- Props ----------

interface LongitudinalTalentProfileProps {
  works: (Work & { student_name?: string })[];
  studentName?: string;
}

// ---------- Component ----------

export function LongitudinalTalentProfile({ works, studentName }: LongitudinalTalentProfileProps) {
  const profile = useMemo(() => aggregateTalentProfile(works), [works]);

  if (!profile || profile.totalAnalyses < 2) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Longitudinal Profile</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            At least 2 analyzed works are needed to build a longitudinal talent profile.
            {profile?.totalAnalyses === 1 && " Upload one more work to unlock this view."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold">Longitudinal Talent Profile</h3>
          <p className="text-sm text-muted-foreground">
            Aggregated from {profile.totalAnalyses} analyses
            {studentName && <> for {studentName}</>}
          </p>
        </div>
      </div>

      {/* Score Progression + Trajectories */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Score Progression
            </CardTitle>
            <CardDescription>Performance across {profile.totalAnalyses} works over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreProgressionChart data={profile.scoreProgression} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Growth Trajectory
            </CardTitle>
            <CardDescription>Change from first to latest</CardDescription>
          </CardHeader>
          <CardContent>
            <TrajectoryList trajectories={profile.trajectories} />
          </CardContent>
        </Card>
      </div>

      {/* Talent Signals + Top Domains */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Talent Signal Consistency
            </CardTitle>
            <CardDescription>
              How often each talent signal appears across analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TalentSignalBars signals={profile.talentSignals} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Career Domain Fit
            </CardTitle>
            <CardDescription>
              Averaged across all {profile.totalAnalyses} analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DomainFitBars domains={profile.topDomains} />
          </CardContent>
        </Card>
      </div>

      {/* Domain Fit Evolution */}
      {profile.domainFitProgression.length >= 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Domain Fit Evolution
            </CardTitle>
            <CardDescription>How career domain alignment shifts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <DomainEvolutionChart
              data={profile.domainFitProgression}
              topDomains={profile.topDomains.slice(0, 3)}
            />
          </CardContent>
        </Card>
      )}

      {/* Consistent Strengths */}
      {profile.consistentStrengths.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              Consistent Strengths
            </CardTitle>
            <CardDescription>Cognitive strengths that appear across multiple analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.consistentStrengths.map((s, i) => (
                <Badge key={i} variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400 py-1 px-3">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-[11px] text-muted-foreground italic px-1">
        Longitudinal profile computed from observable text patterns across {profile.totalAnalyses} analyses. Indicative only — not diagnostic. Trends may shift as more data is collected.
      </p>
    </div>
  );
}

// ---------- Sub-Components ----------

function ScoreProgressionChart({ data }: { data: AggregatedTalentProfile["scoreProgression"] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.625rem",
            fontSize: 12,
          }}
          labelFormatter={(label, payload) => {
            const item = payload?.[0]?.payload;
            return item?.workTitle || label;
          }}
        />
        {(["structure", "clarity", "evidence", "originality", "coherence"] as const).map((dim) => (
          <Line
            key={dim}
            type="monotone"
            dataKey={dim}
            stroke={DIMENSION_COLORS[dim]}
            strokeWidth={2}
            dot={{ r: 4, fill: DIMENSION_COLORS[dim] }}
            activeDot={{ r: 6 }}
            name={dim.charAt(0).toUpperCase() + dim.slice(1)}
          />
        ))}
        <Line
          type="monotone"
          dataKey="average"
          stroke="hsl(var(--foreground))"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          name="Average"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TrajectoryList({ trajectories }: { trajectories: AggregatedTalentProfile["trajectories"] }) {
  return (
    <div className="space-y-3">
      {trajectories.map((t) => {
        const TrendIcon = t.trend === "improving" ? TrendingUp : t.trend === "declining" ? TrendingDown : Minus;
        const trendColor = t.trend === "improving"
          ? "text-green-500"
          : t.trend === "declining"
            ? "text-red-500"
            : "text-muted-foreground";
        const bgColor = t.trend === "improving"
          ? "bg-green-500/10"
          : t.trend === "declining"
            ? "bg-red-500/10"
            : "bg-muted";

        return (
          <div key={t.dimension} className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: DIMENSION_COLORS[t.dimension] }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t.firstScore} → {t.lastScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`flex items-center gap-1 text-xs ${trendColor} rounded-full px-1.5 py-0.5 ${bgColor}`}>
                  <TrendIcon className="h-3 w-3" />
                  {t.trend === "stable" ? "Stable" : `${t.changePercent > 0 ? "+" : ""}${t.changePercent}%`}
                </div>
                <span className="text-[10px] text-muted-foreground">avg {t.averageScore}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TalentSignalBars({ signals }: { signals: AggregatedTalentProfile["talentSignals"] }) {
  return (
    <div className="space-y-3">
      {signals.map((s, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium truncate mr-2">{s.indicator}</span>
            <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
              {s.frequency}/{s.totalAnalyses}
            </span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${s.confidence}%`, opacity: 0.4 + (s.confidence / 100) * 0.6 }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[10px] text-muted-foreground tabular-nums">{s.confidence}% consistency</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DomainFitBars({ domains }: { domains: AggregatedTalentProfile["topDomains"] }) {
  const topDomain = domains[0];

  return (
    <div className="space-y-4">
      {/* Top match */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 mb-0.5">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Strongest Alignment</span>
        </div>
        <p className="text-base font-semibold">
          {topDomain.icon} {topDomain.name}
          <span className="text-primary ml-2">{topDomain.avgFit}%</span>
        </p>
      </div>

      {/* All domains */}
      <div className="space-y-2.5">
        {domains.map((d) => (
          <div key={d.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <span>{d.icon}</span>
                <span className="font-medium">{d.name}</span>
              </span>
              <span className="tabular-nums text-muted-foreground text-xs">{d.avgFit}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${d.avgFit}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DomainEvolutionChart({
  data,
  topDomains,
}: {
  data: AggregatedTalentProfile["domainFitProgression"];
  topDomains: AggregatedTalentProfile["topDomains"];
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.625rem",
            fontSize: 12,
          }}
          labelFormatter={(label, payload) => {
            const item = payload?.[0]?.payload;
            return item?.workTitle || label;
          }}
          formatter={(value: number) => [`${value}%`]}
        />
        {topDomains.map((domain) => (
          <Area
            key={domain.name}
            type="monotone"
            dataKey={domain.name}
            stroke={DOMAIN_COLORS[domain.name] || domain.color}
            fill={DOMAIN_COLORS[domain.name] || domain.color}
            fillOpacity={0.1}
            strokeWidth={2}
            dot={{ r: 3 }}
            name={`${domain.icon} ${domain.name}`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
