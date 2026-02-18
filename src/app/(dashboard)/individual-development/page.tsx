"use client";

import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  LineChart,
  Target,
  Lightbulb,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Development data per student — simulates progress over multiple analyses
const STUDENT_DEVELOPMENT = [
  {
    id: "student-1",
    name: "Emma Thompson",
    class: "10th Grade - English Literature",
    analysesCount: 4,
    trend: "improving" as const,
    avgChange: +0.4,
    currentAvg: 3.9,
    previousAvg: 3.5,
    scores: [
      { date: "Nov 2025", avg: 3.2 },
      { date: "Dec 2025", avg: 3.5 },
      { date: "Jan 2026", avg: 3.6 },
      { date: "Feb 2026", avg: 3.9 },
    ],
    strengths: ["Evidence Integration", "Structured Argumentation"],
    growthAreas: ["Originality", "Creative Thesis Framing"],
    recommendation:
      "Emma shows consistent upward growth in analytical writing. Recommend advanced research projects with primary sources to push originality further.",
    nextSteps: [
      "Assign comparative essay across two historical periods",
      "Encourage participation in debate club for argumentation skills",
      "Introduce peer-review workshops to refine thesis uniqueness",
    ],
  },
  {
    id: "student-2",
    name: "Liam Chen",
    class: "10th Grade - English Literature",
    analysesCount: 3,
    trend: "improving" as const,
    avgChange: +0.3,
    currentAvg: 3.8,
    previousAvg: 3.5,
    scores: [
      { date: "Dec 2025", avg: 3.5 },
      { date: "Jan 2026", avg: 3.6 },
      { date: "Feb 2026", avg: 3.8 },
    ],
    strengths: ["Originality", "Creative Expression"],
    growthAreas: ["Evidence Density", "Source Integration"],
    recommendation:
      "Liam excels in creative and original thinking. Focus on strengthening evidence-based reasoning to complement his natural creativity.",
    nextSteps: [
      "Practice citing academic sources in creative essays",
      "Assign a research-based argumentative piece",
      "Use structured templates for evidence integration",
    ],
  },
  {
    id: "student-3",
    name: "Sofia Martinez",
    class: "10th Grade - English Literature",
    analysesCount: 3,
    trend: "stable" as const,
    avgChange: +0.1,
    currentAvg: 4.3,
    previousAvg: 4.2,
    scores: [
      { date: "Dec 2025", avg: 4.2 },
      { date: "Jan 2026", avg: 4.2 },
      { date: "Feb 2026", avg: 4.3 },
    ],
    strengths: ["Structure", "Evidence", "Coherence"],
    growthAreas: ["Originality — already high, push further"],
    recommendation:
      "Sofia is a top performer with consistently high scores. Challenge her with advanced tasks to prevent plateauing and foster deeper critical thinking.",
    nextSteps: [
      "Assign university-level reading material for advanced analysis",
      "Encourage independent research project on a self-chosen topic",
      "Consider mentoring role for peer-writing workshops",
    ],
  },
  {
    id: "student-4",
    name: "Noah Williams",
    class: "10th Grade - English Literature",
    analysesCount: 2,
    trend: "declining" as const,
    avgChange: -0.2,
    currentAvg: 3.0,
    previousAvg: 3.2,
    scores: [
      { date: "Jan 2026", avg: 3.2 },
      { date: "Feb 2026", avg: 3.0 },
    ],
    strengths: ["Clarity of Language"],
    growthAreas: ["Evidence", "Structure", "Coherence"],
    recommendation:
      "Noah shows a slight decline that may indicate disengagement or difficulty with recent topics. A one-on-one check-in is recommended to identify blockers.",
    nextSteps: [
      "Schedule individual feedback session to discuss challenges",
      "Provide structured essay templates with guided prompts",
      "Assign shorter, focused writing exercises to rebuild confidence",
    ],
  },
  {
    id: "student-5",
    name: "Mia Johnson",
    class: "8th Grade - History",
    analysesCount: 3,
    trend: "improving" as const,
    avgChange: +0.5,
    currentAvg: 3.5,
    previousAvg: 3.0,
    scores: [
      { date: "Dec 2025", avg: 3.0 },
      { date: "Jan 2026", avg: 3.2 },
      { date: "Feb 2026", avg: 3.5 },
    ],
    strengths: ["Evidence Gathering", "Coherence"],
    growthAreas: ["Clarity", "Originality"],
    recommendation:
      "Mia is making strong progress especially in evidence-based writing. Support her momentum with increasingly challenging source material.",
    nextSteps: [
      "Introduce multi-source analysis assignments",
      "Practice writing clear thesis statements",
      "Encourage creative interpretation of historical events",
    ],
  },
  {
    id: "student-7",
    name: "Olivia Brown",
    class: "4th Grade - Elementary English",
    analysesCount: 2,
    trend: "stable" as const,
    avgChange: 0,
    currentAvg: 3.0,
    previousAvg: 3.0,
    scores: [
      { date: "Jan 2026", avg: 3.0 },
      { date: "Feb 2026", avg: 3.0 },
    ],
    strengths: ["Creativity", "Personal Expression"],
    growthAreas: ["Sentence Variety", "Vocabulary"],
    recommendation:
      "Olivia has strong creative instincts for her age. Focus on expanding vocabulary and sentence structure through engaging, interest-based activities.",
    nextSteps: [
      "Reading exercises with age-appropriate adventure stories",
      "Vocabulary games connected to her hobbies (sports, animals)",
      "Short creative writing prompts with picture stimuli",
    ],
  },
  {
    id: "student-8",
    name: "Lucas Garcia",
    class: "4th Grade - Elementary English",
    analysesCount: 2,
    trend: "improving" as const,
    avgChange: +0.3,
    currentAvg: 2.7,
    previousAvg: 2.4,
    scores: [
      { date: "Jan 2026", avg: 2.4 },
      { date: "Feb 2026", avg: 2.7 },
    ],
    strengths: ["Interest-Driven Writing", "Personal Voice"],
    growthAreas: ["Structure", "Evidence", "Vocabulary"],
    recommendation:
      "Lucas responds best to topics he cares about (football, family). Leverage these interests to build writing skills in a motivating context.",
    nextSteps: [
      "Assign writing about football matches or favorite players",
      "Use fill-in-the-blank templates to practice sentence structure",
      "Math exercises with sports statistics for cross-subject learning",
    ],
  },
];

function TrendIcon({ trend }: { trend: "improving" | "stable" | "declining" }) {
  if (trend === "improving")
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "declining")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
}

function TrendBadge({ trend }: { trend: "improving" | "stable" | "declining" }) {
  const variants: Record<string, string> = {
    improving: "bg-green-500/10 text-green-600 border-green-500/30",
    stable: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    declining: "bg-red-500/10 text-red-600 border-red-500/30",
  };
  const labels: Record<string, string> = {
    improving: "Improving",
    stable: "Stable",
    declining: "Needs Attention",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${variants[trend]}`}
    >
      <TrendIcon trend={trend} />
      {labels[trend]}
    </span>
  );
}

export default function IndividualDevelopmentPage() {
  const improving = STUDENT_DEVELOPMENT.filter(
    (s) => s.trend === "improving"
  ).length;
  const stable = STUDENT_DEVELOPMENT.filter(
    (s) => s.trend === "stable"
  ).length;
  const declining = STUDENT_DEVELOPMENT.filter(
    (s) => s.trend === "declining"
  ).length;

  return (
    <>
      <Header
        title="Individual Development"
        subtitle="Track student progress over time with personalized recommendations"
      />

      <div className="p-6 space-y-6">
        {/* Beta Notice */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <LineChart className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Beta Feature</p>
              <p className="text-xs text-muted-foreground">
                Individual Development tracks each student&apos;s score
                progression across multiple analyses and generates tailored
                recommendations. Accuracy improves with more data points.
              </p>
            </div>
            <Badge variant="outline" className="ml-auto shrink-0">
              Beta
            </Badge>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Improving</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{improving}</span>
              <p className="text-xs text-muted-foreground">
                students with upward trend
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stable</CardTitle>
              <Minus className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stable}</span>
              <p className="text-xs text-muted-foreground">
                students with consistent scores
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Needs Attention
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{declining}</span>
              <p className="text-xs text-muted-foreground">
                students with declining scores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Development Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Student Progress Overview
          </h2>

          {STUDENT_DEVELOPMENT.map((student) => (
            <Card
              key={student.id}
              className="hover:border-primary/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {student.name}
                      <TrendBadge trend={student.trend} />
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {student.class} &middot; {student.analysesCount} analyses
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      {student.currentAvg.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                    <p className="text-xs text-muted-foreground">
                      {student.avgChange > 0 ? "+" : ""}
                      {student.avgChange.toFixed(1)} from previous
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Timeline */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Score Timeline
                  </p>
                  <div className="flex items-end gap-1 h-12">
                    {student.scores.map((score, i) => {
                      const height = (score.avg / 5) * 100;
                      const isLast = i === student.scores.length - 1;
                      return (
                        <div
                          key={score.date}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <span className="text-[10px] font-medium">
                            {score.avg.toFixed(1)}
                          </span>
                          <div
                            className={`w-full rounded-t transition-all ${
                              isLast ? "bg-primary" : "bg-primary/30"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-[9px] text-muted-foreground">
                            {score.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Target className="h-3 w-3" /> Strengths
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {student.strengths.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Growth Areas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {student.growthAreas.map((g) => (
                        <Badge
                          key={g}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="rounded-lg bg-accent/50 p-3">
                  <p className="text-xs font-medium mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-primary" />
                    Individual Recommendation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.recommendation}
                  </p>
                </div>

                {/* Next Steps */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Recommended Next Steps
                  </p>
                  <ul className="space-y-1">
                    {student.nextSteps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary font-medium mt-0.5">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link to student profile */}
                <div className="flex justify-end">
                  <Link href="/students">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      View Full Profile
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
