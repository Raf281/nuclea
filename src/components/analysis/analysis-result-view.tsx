"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RubricChart } from "./rubric-chart";
import { ScoreCards } from "./score-cards";
import { TalentMatrix } from "./talent-matrix";
import { WellbeingOverview } from "./wellbeing-overview";
import type { AnalysisResult, AnalysisMode } from "@/lib/types";
import {
  TrendingUp, TrendingDown, Brain,
  Calendar, Sparkles, Target, Heart,
  AlertTriangle, CheckCircle, Info,
} from "lucide-react";

interface AnalysisResultViewProps {
  result: AnalysisResult;
  mode: AnalysisMode;
}

export function AnalysisResultView({ result, mode }: AnalysisResultViewProps) {
  const isElementary = mode === "elementary";

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="development">Development</TabsTrigger>
        <TabsTrigger value="talent">
          Talent
          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">Beta</Badge>
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evaluation Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <RubricChart scores={result.rubric.scores} />
            </CardContent>
          </Card>

          {/* Score Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreCards
                scores={result.rubric.scores}
                justifications={result.rubric.justifications}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4" />
              Cognitive Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{result.cognitive_pattern}</p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{s}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Growth Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="h-4 w-4 text-yellow-500" />
                Growth Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.growth_areas.map((g, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{g}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Cognitive Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4" />
              Cognitive Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{result.cognitive_pattern}</p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Development Tab */}
      <TabsContent value="development" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              3-Day Development Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {result.development_plan.map((day, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">Day {i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {day.replace(/^Day \d+:\s*/i, "")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Talent Tab */}
      <TabsContent value="talent" className="space-y-6">
        {/* Career Domain Fit Matrix */}
        {!isElementary && (
          <TalentMatrix
            scores={result.rubric.scores}
            talentIndicators={result.talent_indicators}
            matchingDomains={result.matching_domains}
          />
        )}

        {/* Learning Recommendations (Elementary) */}
        {isElementary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" />
                Learning Recommendations
                <Badge variant="secondary" className="text-[10px]">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {(result.learning_recommendations.length > 0
                  ? result.learning_recommendations
                  : result.matching_domains
                ).map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{r}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Talent Indicators (Elementary) */}
        {isElementary && result.talent_indicators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                Talent Indicators
                <Badge variant="secondary" className="text-[10px]">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.talent_indicators.map((t, i) => (
                  <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Talent Development Focus (Default Mode) */}
        {!isElementary && result.talent_development_focus.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" />
                Development Roadmap
                <Badge variant="secondary" className="text-[10px]">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.talent_development_focus.map((focus, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-2">
                  <p className="font-medium text-sm">{focus.talent}</p>
                  <p className="text-sm text-muted-foreground italic">{focus.rationale}</p>
                  <ul className="space-y-1">
                    {focus.next_steps.map((step, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Wellbeing Assessment */}
        {result.wellbeing && (
          <WellbeingOverview wellbeing={result.wellbeing} />
        )}
      </TabsContent>
    </Tabs>
  );
}
