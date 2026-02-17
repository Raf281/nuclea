"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RubricChart } from "@/components/analysis/rubric-chart";
import { ScoreCards } from "@/components/analysis/score-cards";
import { AnalysisResultView } from "@/components/analysis/analysis-result-view";
import { getDemoStudent, getDemoWorksByStudent } from "@/lib/demo-data";
import { FileSearch, Calendar, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export default function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const student = getDemoStudent(studentId);
  const works = getDemoWorksByStudent(studentId);

  if (!student) {
    return (
      <>
        <Header title="Student Not Found" />
        <div className="p-6">
          <p className="text-muted-foreground">This student does not exist.</p>
        </div>
      </>
    );
  }

  const avgScore = student.avg_scores
    ? (Object.values(student.avg_scores).reduce((a, b) => a + b, 0) / 5)
    : 0;

  const latestWork = works.length > 0 ? works[0] : null;

  return (
    <>
      <Header
        title={`${student.first_name} ${student.last_name}`}
        subtitle={student.class_name || ""}
      />

      <div className="p-6 space-y-6">
        {/* Student Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{student.first_name} {student.last_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{student.class_name}</Badge>
                {student.student_code && <Badge variant="secondary">{student.student_code}</Badge>}
                <span className="text-sm text-muted-foreground">{works.length} works analyzed</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/analyze">
              <Button>
                <FileSearch className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="works">Works ({works.length})</TabsTrigger>
            {latestWork?.analysis && <TabsTrigger value="latest">Latest Analysis</TabsTrigger>}
          </TabsList>

          {/* Aggregated Profile */}
          <TabsContent value="profile" className="space-y-6">
            {student.avg_scores ? (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Average Scores</CardTitle>
                      <CardDescription>Aggregated across {works.length} works</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RubricChart scores={student.avg_scores} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Score Breakdown</CardTitle>
                      <CardDescription>
                        Overall Average: <strong>{avgScore.toFixed(1)}</strong>/5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScoreCards scores={student.avg_scores} />
                    </CardContent>
                  </Card>
                </div>

                {/* Latest cognitive info */}
                {latestWork?.analysis && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Latest Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {latestWork.analysis.result_json.strengths.map((s, i) => (
                            <li key={i} className="text-sm flex gap-2">
                              <span className="text-green-500 font-semibold">{i + 1}.</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Latest Growth Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {latestWork.analysis.result_json.growth_areas.map((g, i) => (
                            <li key={i} className="text-sm flex gap-2">
                              <span className="text-yellow-500 font-semibold">{i + 1}.</span>
                              {g}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No analyses yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Upload this student&apos;s work to create their first cognitive profile.
                  </p>
                  <Link href="/analyze" className="mt-4">
                    <Button>Start First Analysis</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Works Timeline */}
          <TabsContent value="works" className="space-y-4">
            {works.length > 0 ? (
              works.map((work) => {
                const a = work.analysis;
                const avg = a
                  ? ((a.score_structure + a.score_clarity + a.score_evidence + a.score_originality + a.score_coherence) / 5)
                  : 0;

                return (
                  <Card key={work.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{work.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(work.created_at).toLocaleDateString()}</span>
                            <span>&middot;</span>
                            <Badge variant="outline" className="text-[10px]">{work.work_type}</Badge>
                            {a && (
                              <>
                                <span>&middot;</span>
                                <Badge variant={a.mode === "elementary" ? "secondary" : "outline"} className="text-[10px]">
                                  {a.mode === "elementary" ? "Elementary" : a.mode === "highschool" ? "High School" : "University"}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {a && (
                          <span className="text-sm font-semibold">{avg.toFixed(1)}/5</span>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No works uploaded yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Latest Analysis Detail */}
          {latestWork?.analysis && (
            <TabsContent value="latest">
              <AnalysisResultView
                result={latestWork.analysis.result_json}
                mode={latestWork.analysis.mode}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
