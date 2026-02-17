"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getDemoClass, getDemoStudentsByClass } from "@/lib/demo-data";
import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const cls = getDemoClass(classId);
  const students = getDemoStudentsByClass(classId);

  if (!cls) {
    return (
      <>
        <Header title="Class Not Found" />
        <div className="p-6">
          <p className="text-muted-foreground">This class does not exist.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={cls.name}
        subtitle={`Grade ${cls.grade_level} — ${cls.academic_year}`}
      />

      <div className="p-6 space-y-6">
        {/* Class Stats */}
        <div className="flex items-center gap-4">
          <Badge variant="outline">{students.length} Students</Badge>
          <Badge variant="secondary">{cls.academic_year}</Badge>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Students</h2>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          {students.map((student) => {
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
                          {student.works_count || 0} works &middot; Code: {student.student_code || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {student.avg_scores && (
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-sm font-medium">{avgScore.toFixed(1)}</span>
                          <Progress value={(avgScore / 5) * 100} className="w-20" />
                        </div>
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
