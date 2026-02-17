// ============================================================================
// NUCLEA Types
// ============================================================================

export type UserRole = "admin" | "principal" | "teacher";
export type WorkType = "essay" | "exam" | "homework" | "project" | "other";
export type AnalysisMode = "elementary" | "highschool" | "university";
export type MentalMonitoringLevel = "none" | "mild" | "flag";

// ---------- Analysis Result Types ----------

export interface RubricScores {
  structure: number;
  clarity: number;
  evidence: number;
  originality: number;
  coherence: number;
}

export interface RubricResult {
  scores: RubricScores;
  justifications: Record<keyof RubricScores, string>;
}

export interface TalentFocus {
  talent: string;
  rationale: string;
  next_steps: string[];
}

export interface MentalMonitoringResult {
  level: MentalMonitoringLevel;
  note: string;
  next_step: string;
}

export interface AnalysisResult {
  rubric: RubricResult;
  strengths: string[];
  growth_areas: string[];
  cognitive_pattern: string;
  development_plan: string[];
  talent_indicators: string[];
  matching_domains: string[];
  learning_recommendations: string[];
  talent_development_focus: TalentFocus[];
  mental_monitoring: MentalMonitoringResult | null;
}

// ---------- Data Models ----------

export interface School {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string | null;
  school?: School;
  created_at: string;
}

export interface ClassData {
  id: string;
  school_id: string;
  teacher_id: string;
  name: string;
  grade_level: string | null;
  academic_year: string | null;
  created_at: string;
  student_count?: number;
  teacher?: UserProfile;
}

export interface Student {
  id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  student_code: string | null;
  date_of_birth: string | null;
  notes: string | null;
  created_at: string;
  class_name?: string;
  works_count?: number;
  last_analysis_at?: string | null;
  avg_scores?: RubricScores | null;
}

export interface Work {
  id: string;
  student_id: string;
  title: string;
  work_type: WorkType;
  original_text: string | null;
  file_name: string | null;
  word_count: number | null;
  submitted_by: string;
  created_at: string;
  analysis?: Analysis;
}

export interface Analysis {
  id: string;
  work_id: string;
  mode: AnalysisMode;
  score_structure: number;
  score_clarity: number;
  score_evidence: number;
  score_originality: number;
  score_coherence: number;
  result_json: AnalysisResult;
  mental_monitoring_enabled: boolean;
  mental_monitoring_level: MentalMonitoringLevel | null;
  talent_json: object | null;
  llm_model: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

// ---------- Store / State Types ----------

export interface DashboardStats {
  total_students: number;
  total_analyses: number;
  total_classes: number;
  avg_overall_score: number;
  recent_analyses: RecentAnalysis[];
}

export interface RecentAnalysis {
  id: string;
  student_name: string;
  work_title: string;
  avg_score: number;
  created_at: string;
  mode: AnalysisMode;
}

// ---------- API Request Types ----------

export interface AnalyzeRequest {
  student_id: string;
  work_title: string;
  work_type: WorkType;
  text: string;
  analysis_mode: AnalysisMode;
  mental_monitoring_enabled: boolean;
}

export interface CreateStudentRequest {
  class_id: string;
  first_name: string;
  last_name: string;
  student_code?: string;
  date_of_birth?: string;
  notes?: string;
}
