"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SignalLevel = "none" | "mild" | "flag";

const DEMO_SIGNALS: { id: string; student: string; class: string; level: SignalLevel; note: string; date: string }[] = [
  {
    id: "1",
    student: "Emma Rodriguez",
    class: "English 10A",
    level: "none",
    note: "No concerning signals detected in recent submissions.",
    date: "2025-02-14",
  },
  {
    id: "2",
    student: "James Chen",
    class: "History 11B",
    level: "mild",
    note: "Mild stress indicators noted — mentions of feeling overwhelmed with workload.",
    date: "2025-02-13",
  },
  {
    id: "3",
    student: "Aisha Patel",
    class: "Science 10A",
    level: "none",
    note: "No concerning signals detected.",
    date: "2025-02-12",
  },
  {
    id: "4",
    student: "Lucas Müller",
    class: "Math 12A",
    level: "mild",
    note: "References to pressure and anxiety about upcoming exams.",
    date: "2025-02-11",
  },
];

function LevelBadge({ level }: { level: SignalLevel }) {
  if (level === "none")
    return (
      <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        Clear
      </Badge>
    );
  if (level === "mild")
    return (
      <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
        <Info className="h-3 w-3 mr-1" />
        Mild
      </Badge>
    );
  return (
    <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Flag
    </Badge>
  );
}

export default function MentalMonitoringPage() {
  const clearCount = DEMO_SIGNALS.filter((s) => s.level === "none").length;
  const mildCount = DEMO_SIGNALS.filter((s) => s.level === "mild").length;
  const flagCount = DEMO_SIGNALS.filter((s) => s.level === "flag").length;

  return (
    <>
      <Header title="Mental Monitoring" subtitle="AI-assisted wellbeing screening across student submissions" />

      <div className="p-6 space-y-6">
        {/* Beta Notice */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Beta Feature</p>
              <p className="text-xs text-muted-foreground">
                Mental Monitoring uses AI to detect potential wellbeing signals in student writing. This is an assistive screening tool only — it is indicative, not diagnostic.
              </p>
            </div>
            <Badge variant="outline" className="ml-auto shrink-0">Beta</Badge>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clear</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{clearCount}</div>
              <p className="text-xs text-muted-foreground">students with no signals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mild Signals</CardTitle>
              <Info className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{mildCount}</div>
              <p className="text-xs text-muted-foreground">students to monitor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flags</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{flagCount}</div>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Signals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Recent Screening Results
            </CardTitle>
            <CardDescription>Latest mental monitoring signals from analyzed student work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_SIGNALS.map((signal) => (
                <div key={signal.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{signal.student}</p>
                      <LevelBadge level={signal.level} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{signal.class} &middot; {signal.date}</p>
                    <p className="text-sm text-muted-foreground">{signal.note}</p>
                  </div>
                  <Link href="/students">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
          Disclaimer: This is an AI-assisted screening tool only. It is indicative, not diagnostic. Always consult qualified professionals for clinical assessments.
        </p>
      </div>
    </>
  );
}
