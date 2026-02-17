"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users, FileSearch, GraduationCap, TrendingUp,
  ArrowRight, Clock,
} from "lucide-react";
import Link from "next/link";
import { DEMO_DASHBOARD_STATS, DEMO_CLASSES } from "@/lib/demo-data";

const stats = DEMO_DASHBOARD_STATS;

function ScoreColor({ score }: { score: number }) {
  if (score >= 4) return <span className="text-green-500 font-semibold">{score.toFixed(1)}</span>;
  if (score >= 3) return <span className="text-yellow-500 font-semibold">{score.toFixed(1)}</span>;
  return <span className="text-red-500 font-semibold">{score.toFixed(1)}</span>;
}

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Overview of your school's analytics" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_students}</div>
              <p className="text-xs text-muted-foreground">across {stats.total_classes} classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Analyses Completed</CardTitle>
              <FileSearch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_analyses}</div>
              <p className="text-xs text-muted-foreground">total evaluations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avg_overall_score.toFixed(1)}<span className="text-sm text-muted-foreground">/5</span></div>
              <Progress value={(stats.avg_overall_score / 5) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_classes}</div>
              <p className="text-xs text-muted-foreground">active this semester</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Latest student evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recent_analyses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.student_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.work_title}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={a.mode === "elementary" ? "secondary" : "outline"} className="text-[10px]">
                        {a.mode === "elementary" ? "Elem" : "Default"}
                      </Badge>
                      <ScoreColor score={a.avg_score} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>Your school&apos;s active classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_CLASSES.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/classes/${cls.id}`}
                    className="flex items-center justify-between group hover:bg-accent rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">Grade {cls.grade_level} &middot; {cls.academic_year}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{cls.student_count} students</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Link href="/analyze">
                  <Button className="w-full">
                    <FileSearch className="h-4 w-4 mr-2" />
                    Start New Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
