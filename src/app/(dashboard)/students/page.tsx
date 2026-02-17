"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DEMO_STUDENTS } from "@/lib/demo-data";
import { Search, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return DEMO_STUDENTS;
    const q = search.toLowerCase();
    return DEMO_STUDENTS.filter(
      (s) =>
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        s.class_name?.toLowerCase().includes(q) ||
        s.student_code?.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <Header title="Students" subtitle="All students across your school" />

      <div className="p-6 space-y-6">
        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students by name, class, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">{filtered.length} students found</p>

        {/* Student List */}
        <div className="space-y-2">
          {filtered.map((student) => {
            const avgScore = student.avg_scores
              ? (Object.values(student.avg_scores).reduce((a, b) => a + b, 0) / 5)
              : 0;

            return (
              <Link key={student.id} href={`/students/${student.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.class_name} &middot; {student.works_count || 0} works
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {student.avg_scores && (
                        <div className="hidden sm:flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{avgScore.toFixed(1)}<span className="text-muted-foreground">/5</span></p>
                          </div>
                          <Progress value={(avgScore / 5) * 100} className="w-24" />
                        </div>
                      )}
                      {student.last_analysis_at && (
                        <span className="hidden lg:block text-xs text-muted-foreground">
                          {new Date(student.last_analysis_at).toLocaleDateString()}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
