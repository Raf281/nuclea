// ============================================================================
// NUCLEA Data Access Layer
// Dual-mode: Demo data (no Supabase) or Live data (Supabase)
// All data access goes through this module.
// ============================================================================

import type {
  ClassData, Student, Work, Analysis, AnalysisResult,
  DashboardStats, RecentAnalysis, CreateStudentRequest,
  UserProfile, School,
} from "../types";
import {
  DEMO_SCHOOL, DEMO_CLASSES, DEMO_STUDENTS, DEMO_WORKS,
  DEMO_DASHBOARD_STATS, getDemoStudent, getDemoStudentsByClass,
  getDemoWorksByStudent, getDemoClass,
} from "../demo-data";

// ============================================================================
// Mode Detection
// ============================================================================

export function isLiveMode(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isDemoUser(userId?: string | null): boolean {
  return !userId || userId.startsWith("demo-") || userId === "user-1";
}

// ============================================================================
// Dashboard
// ============================================================================

export async function getDashboardStats(schoolId: string): Promise<DashboardStats> {
  if (!isLiveMode() || isDemoUser()) {
    return DEMO_DASHBOARD_STATS;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return DEMO_DASHBOARD_STATS;

  const { data: stats } = await supabase
    .from("dashboard_stats")
    .select("*")
    .eq("school_id", schoolId)
    .single();

  const { data: recent } = await supabase
    .from("recent_analyses_view")
    .select("*")
    .eq("school_id", schoolId)
    .limit(5);

  if (!stats) return DEMO_DASHBOARD_STATS;

  return {
    total_students: stats.total_students ?? 0,
    total_analyses: stats.total_analyses ?? 0,
    total_classes: stats.total_classes ?? 0,
    avg_overall_score: Number(stats.avg_overall_score) || 0,
    recent_analyses: (recent ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      student_name: r.student_name as string,
      work_title: r.work_title as string,
      avg_score: Number(r.avg_score),
      created_at: r.created_at as string,
      mode: r.mode as RecentAnalysis["mode"],
    })),
  };
}

// ============================================================================
// Classes
// ============================================================================

export async function getClasses(schoolId: string): Promise<ClassData[]> {
  if (!isLiveMode() || isDemoUser()) {
    return DEMO_CLASSES;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return DEMO_CLASSES;

  const { data, error } = await supabase
    .from("classes")
    .select(`
      *,
      students:students(count)
    `)
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((c: Record<string, unknown>) => ({
    id: c.id as string,
    school_id: c.school_id as string,
    teacher_id: c.teacher_id as string,
    name: c.name as string,
    grade_level: (c.grade_level as string) ?? null,
    academic_year: (c.academic_year as string) ?? null,
    created_at: c.created_at as string,
    student_count: ((c.students as Array<{ count: number }>)?.[0]?.count) ?? 0,
  }));
}

export async function getClass(classId: string): Promise<ClassData | null> {
  if (!isLiveMode() || isDemoUser()) {
    return getDemoClass(classId) ?? null;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("classes")
    .select(`
      *,
      students:students(count)
    `)
    .eq("id", classId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    school_id: data.school_id,
    teacher_id: data.teacher_id,
    name: data.name,
    grade_level: data.grade_level ?? null,
    academic_year: data.academic_year ?? null,
    created_at: data.created_at,
    student_count: data.students?.[0]?.count ?? 0,
  };
}

export async function createClass(input: {
  school_id: string;
  teacher_id: string;
  name: string;
  grade_level?: string;
  academic_year?: string;
}): Promise<ClassData | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("classes")
    .insert({
      school_id: input.school_id,
      teacher_id: input.teacher_id,
      name: input.name,
      grade_level: input.grade_level ?? null,
      academic_year: input.academic_year ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateClass(
  classId: string,
  updates: { name?: string; grade_level?: string; academic_year?: string }
): Promise<ClassData | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("classes")
    .update(updates)
    .eq("id", classId)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function deleteClass(classId: string): Promise<boolean> {
  if (!isLiveMode()) return false;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return false;

  const { error } = await supabase
    .from("classes")
    .delete()
    .eq("id", classId);

  return !error;
}

// ============================================================================
// Students
// ============================================================================

export async function getStudents(schoolId: string): Promise<Student[]> {
  if (!isLiveMode() || isDemoUser()) {
    return DEMO_STUDENTS;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("student_overview")
    .select("*")
    .in("class_id", (
      await supabase
        .from("classes")
        .select("id")
        .eq("school_id", schoolId)
    ).data?.map((c: { id: string }) => c.id) ?? []);

  if (error || !data) return [];

  return data.map(mapStudentRow);
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  if (!isLiveMode() || isDemoUser()) {
    return getDemoStudentsByClass(classId);
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("student_overview")
    .select("*")
    .eq("class_id", classId);

  if (error || !data) return [];

  return data.map(mapStudentRow);
}

export async function getStudent(studentId: string): Promise<Student | null> {
  if (!isLiveMode() || isDemoUser()) {
    return getDemoStudent(studentId) ?? null;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("student_overview")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error || !data) return null;
  return mapStudentRow(data);
}

export async function createStudent(input: CreateStudentRequest): Promise<Student | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("students")
    .insert({
      class_id: input.class_id,
      first_name: input.first_name,
      last_name: input.last_name,
      student_code: input.student_code ?? null,
      date_of_birth: input.date_of_birth ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateStudent(
  studentId: string,
  updates: Partial<Pick<Student, "first_name" | "last_name" | "student_code" | "date_of_birth" | "notes">>
): Promise<Student | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", studentId)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  if (!isLiveMode()) return false;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return false;

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId);

  return !error;
}

// ============================================================================
// Works
// ============================================================================

export async function getWorksByStudent(studentId: string): Promise<(Work & { student_name: string })[]> {
  if (!isLiveMode() || isDemoUser()) {
    return getDemoWorksByStudent(studentId);
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("works")
    .select(`
      *,
      student:students!inner(first_name, last_name),
      analysis:analyses(*)
    `)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((w: Record<string, unknown>) => {
    const student = w.student as { first_name: string; last_name: string };
    const analysisArr = w.analysis as Record<string, unknown>[];
    const analysis = analysisArr?.[0] ?? undefined;

    return {
      id: w.id as string,
      student_id: w.student_id as string,
      title: w.title as string,
      work_type: w.work_type as Work["work_type"],
      original_text: (w.original_text as string) ?? null,
      file_name: (w.file_name as string) ?? null,
      word_count: (w.word_count as number) ?? null,
      submitted_by: w.submitted_by as string,
      created_at: w.created_at as string,
      student_name: `${student.first_name} ${student.last_name}`,
      analysis: analysis ? mapAnalysisRow(analysis) : undefined,
    };
  });
}

export async function createWork(input: {
  student_id: string;
  title: string;
  work_type: string;
  original_text?: string;
  file_name?: string;
  word_count?: number;
  submitted_by: string;
}): Promise<Work | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("works")
    .insert({
      student_id: input.student_id,
      title: input.title,
      work_type: input.work_type,
      original_text: input.original_text ?? null,
      file_name: input.file_name ?? null,
      word_count: input.word_count ?? null,
      submitted_by: input.submitted_by,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

// ============================================================================
// Analyses
// ============================================================================

export async function createAnalysis(input: {
  work_id: string;
  mode: string;
  result: AnalysisResult;
  mental_monitoring_enabled: boolean;
  llm_model?: string;
  processing_time_ms?: number;
}): Promise<Analysis | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const scores = input.result.rubric.scores;

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      work_id: input.work_id,
      mode: input.mode,
      score_structure: scores.structure,
      score_clarity: scores.clarity,
      score_evidence: scores.evidence,
      score_originality: scores.originality,
      score_coherence: scores.coherence,
      result_json: input.result,
      mental_monitoring_enabled: input.mental_monitoring_enabled,
      mental_monitoring_level: input.result.mental_monitoring?.level ?? null,
      talent_json: {
        indicators: input.result.talent_indicators,
        domains: input.result.matching_domains,
        focus: input.result.talent_development_focus,
      },
      llm_model: input.llm_model ?? null,
      processing_time_ms: input.processing_time_ms ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return mapAnalysisRow(data);
}

export async function getAnalysesByStudent(studentId: string): Promise<Analysis[]> {
  if (!isLiveMode() || isDemoUser()) {
    const works = getDemoWorksByStudent(studentId);
    return works
      .filter((w) => w.analysis)
      .map((w) => w.analysis!);
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("analyses")
    .select(`
      *,
      work:works!inner(student_id)
    `)
    .eq("work.student_id", studentId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapAnalysisRow);
}

// ============================================================================
// User Profile
// ============================================================================

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isLiveMode()) return null;

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*, school:schools(*)")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
    school_id: profile.school_id,
    school: profile.school ?? undefined,
    created_at: profile.created_at,
  };
}

export async function getSchool(schoolId: string): Promise<School | null> {
  if (!isLiveMode() || isDemoUser()) {
    return DEMO_SCHOOL;
  }

  const { getSupabaseServer } = await import("../supabase/server");
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data } = await supabase
    .from("schools")
    .select("*")
    .eq("id", schoolId)
    .single();

  return data;
}

// ============================================================================
// Helpers
// ============================================================================

function mapStudentRow(row: Record<string, unknown>): Student {
  const avgScores = (row.avg_structure != null) ? {
    structure: Number(row.avg_structure),
    clarity: Number(row.avg_clarity),
    evidence: Number(row.avg_evidence),
    originality: Number(row.avg_originality),
    coherence: Number(row.avg_coherence),
  } : null;

  return {
    id: row.id as string,
    class_id: row.class_id as string,
    first_name: row.first_name as string,
    last_name: row.last_name as string,
    student_code: (row.student_code as string) ?? null,
    date_of_birth: (row.date_of_birth as string) ?? null,
    notes: (row.notes as string) ?? null,
    created_at: row.created_at as string,
    class_name: row.class_name as string | undefined,
    works_count: Number(row.works_count) || 0,
    last_analysis_at: (row.last_analysis_at as string) ?? null,
    avg_scores: avgScores,
  };
}

function mapAnalysisRow(row: Record<string, unknown>): Analysis {
  return {
    id: row.id as string,
    work_id: row.work_id as string,
    mode: row.mode as Analysis["mode"],
    score_structure: Number(row.score_structure),
    score_clarity: Number(row.score_clarity),
    score_evidence: Number(row.score_evidence),
    score_originality: Number(row.score_originality),
    score_coherence: Number(row.score_coherence),
    result_json: row.result_json as AnalysisResult,
    mental_monitoring_enabled: row.mental_monitoring_enabled as boolean,
    mental_monitoring_level: (row.mental_monitoring_level as Analysis["mental_monitoring_level"]) ?? null,
    talent_json: (row.talent_json as object) ?? null,
    llm_model: (row.llm_model as string) ?? null,
    processing_time_ms: (row.processing_time_ms as number) ?? null,
    created_at: row.created_at as string,
  };
}
