// ============================================================================
// NUCLEA Demo Data — Pre-seeded data for Investor Demos
// ============================================================================

import type {
  School, UserProfile, ClassData, Student, Work, Analysis,
  AnalysisResult, DashboardStats, RecentAnalysis,
} from "./types";

// ---------- School ----------
export const DEMO_SCHOOL: School = {
  id: "school-1",
  name: "Demo International School",
  slug: "demo-international",
  created_at: "2025-09-01T00:00:00Z",
};

// ---------- Users ----------
export const DEMO_USER: UserProfile = {
  id: "user-1",
  email: "admin@nuclea.app",
  full_name: "Dr. Sarah Mitchell",
  role: "principal",
  school_id: "school-1",
  school: DEMO_SCHOOL,
  created_at: "2025-09-01T00:00:00Z",
};

// ---------- Classes ----------
export const DEMO_CLASSES: ClassData[] = [
  { id: "class-1", school_id: "school-1", teacher_id: "user-2", name: "10th Grade - English Literature", grade_level: "10", academic_year: "2025-2026", created_at: "2025-09-01T00:00:00Z", student_count: 8 },
  { id: "class-2", school_id: "school-1", teacher_id: "user-3", name: "8th Grade - History", grade_level: "8", academic_year: "2025-2026", created_at: "2025-09-01T00:00:00Z", student_count: 6 },
  { id: "class-3", school_id: "school-1", teacher_id: "user-2", name: "4th Grade - Elementary English", grade_level: "4", academic_year: "2025-2026", created_at: "2025-09-01T00:00:00Z", student_count: 5 },
];

// ---------- Students ----------
export const DEMO_STUDENTS: Student[] = [
  { id: "student-1", class_id: "class-1", first_name: "Emma", last_name: "Thompson", student_code: "DIS-1001", date_of_birth: "2009-03-15", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "10th Grade - English Literature", works_count: 4, last_analysis_at: "2026-02-10T14:30:00Z", avg_scores: { structure: 3.8, clarity: 3.3, evidence: 3.8, originality: 3.0, coherence: 3.5 } },
  { id: "student-2", class_id: "class-1", first_name: "Liam", last_name: "Chen", student_code: "DIS-1002", date_of_birth: "2009-07-22", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "10th Grade - English Literature", works_count: 3, last_analysis_at: "2026-02-08T10:15:00Z", avg_scores: { structure: 3.7, clarity: 4.0, evidence: 3.3, originality: 4.3, coherence: 3.7 } },
  { id: "student-3", class_id: "class-1", first_name: "Sofia", last_name: "Martinez", student_code: "DIS-1003", date_of_birth: "2009-11-05", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "10th Grade - English Literature", works_count: 3, last_analysis_at: "2026-02-12T09:00:00Z", avg_scores: { structure: 4.5, clarity: 4.2, evidence: 4.5, originality: 3.8, coherence: 4.3 } },
  { id: "student-4", class_id: "class-1", first_name: "Noah", last_name: "Williams", student_code: "DIS-1004", date_of_birth: "2009-01-18", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "10th Grade - English Literature", works_count: 2, last_analysis_at: "2026-01-20T11:45:00Z", avg_scores: { structure: 3.0, clarity: 3.5, evidence: 2.5, originality: 3.0, coherence: 3.0 } },
  { id: "student-5", class_id: "class-2", first_name: "Mia", last_name: "Johnson", student_code: "DIS-2001", date_of_birth: "2011-05-30", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "8th Grade - History", works_count: 3, last_analysis_at: "2026-02-14T13:20:00Z", avg_scores: { structure: 3.7, clarity: 3.3, evidence: 4.0, originality: 3.0, coherence: 3.7 } },
  { id: "student-6", class_id: "class-2", first_name: "Ethan", last_name: "Kim", student_code: "DIS-2002", date_of_birth: "2011-09-12", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "8th Grade - History", works_count: 2, last_analysis_at: "2026-02-05T16:00:00Z", avg_scores: { structure: 4.0, clarity: 3.5, evidence: 3.5, originality: 4.0, coherence: 3.5 } },
  { id: "student-7", class_id: "class-3", first_name: "Olivia", last_name: "Brown", student_code: "DIS-3001", date_of_birth: "2015-04-08", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "4th Grade - Elementary English", works_count: 2, last_analysis_at: "2026-02-11T10:00:00Z", avg_scores: { structure: 3.0, clarity: 3.0, evidence: 2.0, originality: 4.0, coherence: 3.0 } },
  { id: "student-8", class_id: "class-3", first_name: "Lucas", last_name: "Garcia", student_code: "DIS-3002", date_of_birth: "2015-08-25", notes: null, created_at: "2025-09-02T00:00:00Z", class_name: "4th Grade - Elementary English", works_count: 2, last_analysis_at: "2026-02-13T14:30:00Z", avg_scores: { structure: 2.5, clarity: 3.0, evidence: 2.0, originality: 3.5, coherence: 2.5 } },
];

// ---------- Demo Analysis Results ----------

// Emma's progression: 4 distinct results showing growth over time

const EMMA_RESULT_1: AnalysisResult = {
  rubric: {
    scores: { structure: 3, clarity: 3, evidence: 3, originality: 2, coherence: 3 },
    justifications: {
      structure: "Basic introduction-body-conclusion format present but transitions are abrupt. Example: 'The Industrial Revolution changed everything' shows simple opening.",
      clarity: "Language is understandable but sentences are sometimes awkward. Example: 'factories were built and people moved' demonstrates basic clarity.",
      evidence: "Some facts mentioned but without citations or data. Example: 'many workers suffered' lacks specificity.",
      originality: "Follows textbook narrative closely without personal interpretation. Example: 'the revolution started in England' is purely factual.",
      coherence: "Paragraphs follow a chronological order but lack connecting arguments. Example: 'then came the steam engine' shows listing rather than linking.",
    },
  },
  strengths: [
    "Information Processing + 'covers multiple aspects'",
    "Sequential Reasoning + 'chronological order'",
    "Topic Coverage + 'addresses key events'",
  ],
  growth_areas: [
    "Argument depth + 'surface-level analysis'",
    "Source integration + 'no citations'",
    "Original interpretation + 'follows textbook closely'",
  ],
  cognitive_pattern: "Sequential information processing with broad topic coverage. Operates at descriptive level. Uses chronological organization as primary framework.",
  development_plan: [
    "Day 1: Practice finding and integrating primary sources into arguments",
    "Day 2: Write a paragraph that presents a personal interpretation of historical events",
    "Day 3: Practice linking causes and effects across different historical developments",
  ],
  talent_indicators: ["Information Processing", "Sequential Reasoning", "Broad Topic Coverage"],
  matching_domains: ["History", "Social Studies"],
  learning_recommendations: [],
  talent_development_focus: [
    {
      talent: "Information Processing",
      rationale: "Ability to gather and organize facts provides foundation for deeper analytical work.",
      next_steps: ["Practice categorizing information by theme rather than chronology", "Create concept maps linking related historical events"],
    },
  ],
  mental_monitoring: null,
};

const EMMA_RESULT_2: AnalysisResult = {
  rubric: {
    scores: { structure: 4, clarity: 3, evidence: 4, originality: 3, coherence: 3 },
    justifications: {
      structure: "Well-organized thematic sections with clear topic sentences. Example: 'Athenian democracy differed fundamentally from modern systems' shows structured argumentation.",
      clarity: "Generally clear but some complex sentences lose precision. Example: 'the assembly gathered to vote on matters of state' is readable.",
      evidence: "Historical examples and comparisons well-integrated. Example: 'Pericles argued in 431 BC' shows source-based reasoning.",
      originality: "Emerging comparative thinking between ancient and modern. Example: 'unlike today's representative model' shows independent thought.",
      coherence: "Thematic connections present but could be tighter between sections. Example: 'this connects to the broader question' attempts linking.",
    },
  },
  strengths: [
    "Pattern Recognition + 'draws parallels between eras'",
    "Comparative Analysis + 'unlike today's model'",
    "Deductive Reasoning + 'therefore the Athenians'",
  ],
  growth_areas: [
    "Sentence precision + 'complex structures lose clarity'",
    "Cross-section transitions + 'abrupt topic shifts'",
    "Multi-perspective analysis + 'single viewpoint dominates'",
  ],
  cognitive_pattern: "Emerging analytical reasoning with comparative framework. Beginning to operate at interpretive level. Uses thematic organization with growing sophistication.",
  development_plan: [
    "Day 1: Practice writing thesis statements that frame comparisons",
    "Day 2: Work on transitions that explicitly connect different sections",
    "Day 3: Analyze the same event from two different historical perspectives",
  ],
  talent_indicators: ["Pattern Recognition", "Comparative Analysis", "Deductive Reasoning"],
  matching_domains: ["Political Science", "History", "Philosophy"],
  learning_recommendations: [],
  talent_development_focus: [
    {
      talent: "Pattern Recognition",
      rationale: "Growing ability to identify patterns across time periods signals strong analytical potential.",
      next_steps: ["Compare three different democratic systems across centuries", "Map recurring political patterns in a visual timeline"],
    },
  ],
  mental_monitoring: null,
};

const EMMA_RESULT_3: AnalysisResult = {
  rubric: {
    scores: { structure: 4, clarity: 4, evidence: 4, originality: 4, coherence: 4 },
    justifications: {
      structure: "Sophisticated argument architecture with thesis-driven organization. Example: 'policy failure stems from three interconnected factors' shows advanced framing.",
      clarity: "Precise academic language with well-constructed sentences. Example: 'empirical evidence suggests a correlation' demonstrates scholarly expression.",
      evidence: "Multiple data sources synthesized into cohesive arguments. Example: 'according to the IPCC 2023 report' shows research integration.",
      originality: "Independent policy analysis with novel connections. Example: 'linking economic incentives to behavioral change' shows creative synthesis.",
      coherence: "Arguments build upon each other in a logical chain. Example: 'this economic framework therefore predicts' shows causal reasoning.",
    },
  },
  strengths: [
    "Pattern Recognition + Causal Linking + 'interconnected factors'",
    "Systems Thinking + 'economic framework predicts'",
    "Evidence Synthesis + 'multiple sources confirm'",
  ],
  growth_areas: [
    "Counter-argument integration + 'opposing views not addressed'",
    "Quantitative reasoning + 'data interpretation could deepen'",
    "Conclusion scope + 'final section narrows too quickly'",
  ],
  cognitive_pattern: "Systems-level analytical reasoning with policy orientation. Operates at abstract-interpretive level. Uses multi-causal frameworks for complex problem analysis.",
  development_plan: [
    "Day 1: Practice integrating counter-arguments into thesis-driven essays",
    "Day 2: Analyze quantitative climate data and translate into written arguments",
    "Day 3: Write conclusions that maintain the scope of the analysis while proposing solutions",
  ],
  talent_indicators: ["Pattern Recognition + Causal Linking", "Systems Thinking", "Policy Analysis"],
  matching_domains: ["Political Science", "Environmental Studies", "Data Science", "Policy Research"],
  learning_recommendations: [],
  talent_development_focus: [
    {
      talent: "Systems Thinking",
      rationale: "Ability to connect economic, political and environmental systems indicates strong potential for complex problem solving.",
      next_steps: ["Model a policy problem using systems dynamics diagrams", "Write a policy brief that addresses multiple stakeholder perspectives"],
    },
  ],
  mental_monitoring: null,
};

const EMMA_RESULT_4: AnalysisResult = {
  rubric: {
    scores: { structure: 4, clarity: 3, evidence: 4, originality: 3, coherence: 4 },
    justifications: {
      structure: "Clear introduction-body-conclusion sequencing with logical transitions. Example: 'political instability' shows structured sectioning.",
      clarity: "Consistent wording throughout; a few sentences could be tighter. Example: 'Rome faced an almost constant cycle' demonstrates readable prose.",
      evidence: "Sources and quantitative data embedded throughout the argument. Example: 'Between 235 and 284 AD' shows historical data integration.",
      originality: "Independent reasoning appears but can deepen with more unique framing. Example: 'combination of political instability' shows some original synthesis.",
      coherence: "Argument threads remain aligned end to end with consistent logic. Example: 'economic decline further accelerated' demonstrates causal linking.",
    },
  },
  strengths: [
    "Pattern Recognition + 'data shows patterns'",
    "Deductive Structuring + 'logical sequence'",
    "Causal Linking + 'direct relationship'",
  ],
  growth_areas: [
    "Evidence density + 'could integrate more primary sources'",
    "Original framing + 'relies on established narratives'",
    "Thesis nuance + 'argument could be more specific'",
  ],
  cognitive_pattern: "Analytical reasoning with structured information organization. Operates at moderate abstraction level. Uses deductive problem-solving approach with consistent causal linking.",
  development_plan: [
    "Day 1: Practice evidence integration with primary sources",
    "Day 2: Strengthen causal linking through comparative analysis",
    "Day 3: Refine thesis definition with structured argumentation",
  ],
  talent_indicators: ["Pattern Recognition + Causal Linking", "Systems Thinking", "Comparative Analysis"],
  matching_domains: ["Political Science", "Data Science", "Research"],
  learning_recommendations: [],
  talent_development_focus: [
    {
      talent: "Pattern Recognition + Causal Linking",
      rationale: "Strong foundation for research and analytical work, visible in text structure.",
      next_steps: ["Engage in structured debate forums focusing on evidence-based argumentation", "Conduct evidence-based research projects using primary sources"],
    },
  ],
  mental_monitoring: null,
};

const DEMO_ANALYSIS_RESULT_ELEMENTARY: AnalysisResult = {
  rubric: {
    scores: { structure: 3, clarity: 3, evidence: 2, originality: 4, coherence: 3 },
    justifications: {
      structure: "Simple topic-based organization with personal statements. Example: 'My favorite pet' shows basic structure.",
      clarity: "Clear, age-appropriate language with simple sentences. Example: 'I am nine years old' demonstrates readable prose.",
      evidence: "Personal experiences used as examples. Example: 'I like pizza' shows personal evidence.",
      originality: "Personal expression with unique interests visible. Example: 'My favorite sport is Leichtathletik' shows individual perspective.",
      coherence: "Logical flow between personal statements. Example: 'I am in 4th grade' connects to context.",
    },
  },
  strengths: [
    "Narrative thinking + 'My favorite pet'",
    "Topic organization + 'I like pizza'",
    "Personal expression + 'My hobby is sport'",
  ],
  growth_areas: [
    "Limited sentence variety + 'I am nine'",
    "Basic vocabulary expansion + 'I like'",
    "Simple transitions missing + 'My favorite'",
  ],
  cognitive_pattern: "Descriptive reasoning with personal experience-based organization. Operates at concrete, personal level. Uses direct, topic-based approach.",
  development_plan: [
    "Day 1: Read English texts about football to improve vocabulary",
    "Day 2: Write a short presentation about favorite football club to practice sentence variety",
    "Day 3: Learn history of favorite football club to connect interests with learning",
  ],
  talent_indicators: ["Sports-themed narrative thinking", "Personal experience-based reasoning", "Interest-driven organization"],
  matching_domains: [],
  learning_recommendations: [
    "Math with football context: Calculate goals, player statistics, field dimensions",
    "English texts about football: Read stories about favorite teams, write about matches",
    "History project about favorite football club: Research club history, connect to historical events",
  ],
  talent_development_focus: [],
  mental_monitoring: null,
};

// ---------- Demo Works with Analyses ----------

export const DEMO_WORKS: (Work & { student_name: string })[] = [
  // Emma Thompson — 4 works showing progression (Oct 2025 → Feb 2026)
  {
    id: "work-4", student_id: "student-1", title: "The Industrial Revolution", work_type: "essay",
    original_text: "The Industrial Revolution changed everything. Factories were built and people moved to cities...",
    file_name: null, word_count: 780, submitted_by: "user-2", created_at: "2025-10-15T10:00:00Z",
    student_name: "Emma Thompson",
    analysis: {
      id: "analysis-4", work_id: "work-4", mode: "highschool",
      score_structure: 3, score_clarity: 3, score_evidence: 3, score_originality: 2, score_coherence: 3,
      result_json: EMMA_RESULT_1,
      mental_monitoring_enabled: false, mental_monitoring_level: null, talent_json: null,
      llm_model: "claude-sonnet-4-20250514", processing_time_ms: 9800, created_at: "2025-10-15T10:00:00Z",
    },
  },
  {
    id: "work-5", student_id: "student-1", title: "Democracy in Ancient Greece", work_type: "essay",
    original_text: "Athenian democracy differed fundamentally from modern representative systems. The assembly gathered...",
    file_name: null, word_count: 1050, submitted_by: "user-2", created_at: "2025-12-05T14:00:00Z",
    student_name: "Emma Thompson",
    analysis: {
      id: "analysis-5", work_id: "work-5", mode: "highschool",
      score_structure: 4, score_clarity: 3, score_evidence: 4, score_originality: 3, score_coherence: 3,
      result_json: EMMA_RESULT_2,
      mental_monitoring_enabled: false, mental_monitoring_level: null, talent_json: null,
      llm_model: "claude-sonnet-4-20250514", processing_time_ms: 10500, created_at: "2025-12-05T14:00:00Z",
    },
  },
  {
    id: "work-2", student_id: "student-1", title: "Climate Change and Policy", work_type: "essay",
    original_text: "Climate change represents one of the most pressing challenges of the 21st century...",
    file_name: null, word_count: 980, submitted_by: "user-2", created_at: "2026-01-25T09:15:00Z",
    student_name: "Emma Thompson",
    analysis: {
      id: "analysis-2", work_id: "work-2", mode: "university",
      score_structure: 4, score_clarity: 4, score_evidence: 4, score_originality: 4, score_coherence: 4,
      result_json: EMMA_RESULT_3,
      mental_monitoring_enabled: false, mental_monitoring_level: null, talent_json: null,
      llm_model: "claude-sonnet-4-20250514", processing_time_ms: 11200, created_at: "2026-01-25T09:15:00Z",
    },
  },
  {
    id: "work-1", student_id: "student-1", title: "The Fall of the Roman Empire", work_type: "essay",
    original_text: "The fall of the Roman Empire is one of the most debated topics in historical scholarship...",
    file_name: null, word_count: 1250, submitted_by: "user-2", created_at: "2026-02-10T14:30:00Z",
    student_name: "Emma Thompson",
    analysis: {
      id: "analysis-1", work_id: "work-1", mode: "university",
      score_structure: 4, score_clarity: 3, score_evidence: 4, score_originality: 3, score_coherence: 4,
      result_json: EMMA_RESULT_4,
      mental_monitoring_enabled: false, mental_monitoring_level: null, talent_json: null,
      llm_model: "claude-sonnet-4-20250514", processing_time_ms: 12340, created_at: "2026-02-10T14:30:00Z",
    },
  },
  // Olivia Brown — Elementary
  {
    id: "work-3", student_id: "student-7", title: "My Favorite Things", work_type: "essay",
    original_text: "My name is Olivia. I am nine years old. I like pizza and my favorite sport is football...",
    file_name: null, word_count: 150, submitted_by: "user-2", created_at: "2026-02-11T10:00:00Z",
    student_name: "Olivia Brown",
    analysis: {
      id: "analysis-3", work_id: "work-3", mode: "elementary",
      score_structure: 3, score_clarity: 3, score_evidence: 2, score_originality: 4, score_coherence: 3,
      result_json: DEMO_ANALYSIS_RESULT_ELEMENTARY,
      mental_monitoring_enabled: false, mental_monitoring_level: null, talent_json: null,
      llm_model: "claude-sonnet-4-20250514", processing_time_ms: 8500, created_at: "2026-02-11T10:00:00Z",
    },
  },
];

// ---------- Dashboard Stats ----------

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  total_students: DEMO_STUDENTS.length,
  total_analyses: 19,
  total_classes: DEMO_CLASSES.length,
  avg_overall_score: 3.5,
  recent_analyses: [
    { id: "analysis-5a", student_name: "Mia Johnson", work_title: "World War II: Causes and Consequences", avg_score: 3.5, created_at: "2026-02-14T13:20:00Z", mode: "university" },
    { id: "analysis-4a", student_name: "Lucas Garcia", work_title: "My Family", avg_score: 2.7, created_at: "2026-02-13T14:30:00Z", mode: "elementary" },
    { id: "analysis-6a", student_name: "Sofia Martinez", work_title: "Shakespeare's Influence on Modern Literature", avg_score: 4.3, created_at: "2026-02-12T09:00:00Z", mode: "university" },
    { id: "analysis-3", student_name: "Olivia Brown", work_title: "My Favorite Things", avg_score: 3.0, created_at: "2026-02-11T10:00:00Z", mode: "elementary" },
    { id: "analysis-1", student_name: "Emma Thompson", work_title: "The Fall of the Roman Empire", avg_score: 3.6, created_at: "2026-02-10T14:30:00Z", mode: "university" },
  ],
};

// Helper to find data
export function getDemoStudent(id: string): Student | undefined {
  return DEMO_STUDENTS.find(s => s.id === id);
}

export function getDemoStudentsByClass(classId: string): Student[] {
  return DEMO_STUDENTS.filter(s => s.class_id === classId);
}

export function getDemoWorksByStudent(studentId: string): (Work & { student_name: string })[] {
  return DEMO_WORKS.filter(w => w.student_id === studentId);
}

export function getDemoClass(id: string): ClassData | undefined {
  return DEMO_CLASSES.find(c => c.id === id);
}
