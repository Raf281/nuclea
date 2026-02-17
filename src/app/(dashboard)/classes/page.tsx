"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_CLASSES } from "@/lib/demo-data";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ClassesPage() {
  return (
    <>
      <Header title="Classes" subtitle="Manage your school's classes" />

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_CLASSES.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {cls.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Grade {cls.grade_level} &middot; {cls.academic_year}
                    </p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{cls.student_count} students</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
