"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ArrowRight, UserPlus, Loader2 } from "lucide-react";
import { SkeletonStudentsList } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Student, ClassData } from "@/lib/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classId, setClassId] = useState("");
  const [studentCode, setStudentCode] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/classes").then((r) => r.json()),
    ])
      .then(([studentData, classData]) => {
        setStudents(studentData);
        setClasses(classData);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        s.class_name?.toLowerCase().includes(q) ||
        s.student_code?.toLowerCase().includes(q)
    );
  }, [search, students]);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setClassId("");
    setStudentCode("");
    setError(null);
  }

  async function handleCreateStudent() {
    if (!firstName.trim() || !lastName.trim() || !classId) {
      setError("First name, last name, and class are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: classId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          student_code: studentCode.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create student");
        return;
      }

      // Refresh student list
      const refreshed = await fetch("/api/students").then((r) => r.json());
      setStudents(refreshed);
      resetForm();
      setDialogOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Students" subtitle="All students across your school" />
        <SkeletonStudentsList />
      </>
    );
  }

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
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Create a new student profile. Assign them to a class to begin tracking their progress.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      placeholder="Emma"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Thompson"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class..." />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} {cls.grade_level ? `(Grade ${cls.grade_level})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Student Code <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input
                    placeholder="e.g. STU-2026-001"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </DialogClose>
                <Button size="sm" onClick={handleCreateStudent} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Student
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
