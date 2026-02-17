"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Briefcase, FlaskConical, BookOpen, Palette, Scale, Monitor, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CAREER_DOMAINS = [
  { name: "Technology", icon: Monitor, color: "text-blue-500", students: 12, avgFit: 78 },
  { name: "Sciences", icon: FlaskConical, color: "text-green-500", students: 8, avgFit: 82 },
  { name: "Humanities", icon: BookOpen, color: "text-amber-500", students: 15, avgFit: 71 },
  { name: "Arts & Creative", icon: Palette, color: "text-purple-500", students: 6, avgFit: 75 },
  { name: "Business", icon: Briefcase, color: "text-cyan-500", students: 10, avgFit: 68 },
  { name: "Law & Policy", icon: Scale, color: "text-rose-500", students: 5, avgFit: 73 },
];

const TOP_MATCHES = [
  { student: "Emma Rodriguez", domain: "Sciences", fit: 92, strengths: "Evidence, Coherence" },
  { student: "James Chen", domain: "Technology", fit: 88, strengths: "Structure, Clarity" },
  { student: "Aisha Patel", domain: "Humanities", fit: 85, strengths: "Originality, Coherence" },
  { student: "Lucas Müller", domain: "Business", fit: 81, strengths: "Structure, Evidence" },
];

export default function TalentMatchingPage() {
  return (
    <>
      <Header title="Talent Matching" subtitle="Career domain fit analysis based on cognitive profiles" />

      <div className="p-6 space-y-6">
        {/* Beta Notice */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Beta Feature</p>
              <p className="text-xs text-muted-foreground">
                Talent Matching analyzes rubric scores across student submissions to suggest career domain fits. Results improve with more data points.
              </p>
            </div>
            <Badge variant="outline" className="ml-auto shrink-0">Beta</Badge>
          </CardContent>
        </Card>

        {/* Career Domain Overview */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CAREER_DOMAINS.map((domain) => (
            <Card key={domain.name} className="hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{domain.name}</CardTitle>
                <domain.icon className={`h-4 w-4 ${domain.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{domain.students}</span>
                  <span className="text-xs text-muted-foreground">students matched</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${domain.avgFit}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{domain.avgFit}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">avg. domain fit</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Top Talent Matches
            </CardTitle>
            <CardDescription>Strongest career domain matches across all analyzed students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_MATCHES.map((match) => (
                <div key={match.student} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{match.student}</p>
                      <Badge variant="secondary" className="text-[10px]">{match.domain}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Key strengths: {match.strengths}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">{match.fit}%</span>
                    <Link href="/students">
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
