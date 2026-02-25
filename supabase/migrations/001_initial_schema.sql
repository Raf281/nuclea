-- ============================================================================
-- NUCLEA Database Schema — V1
-- Secure multi-tenant schema with Row Level Security
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Schools (tenant root)
create table schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- User profiles (linked to Supabase auth.users)
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'principal', 'teacher')),
  school_id uuid references schools(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_user_profiles_school on user_profiles(school_id);
create index idx_user_profiles_email on user_profiles(email);

-- Classes
create table classes (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  teacher_id uuid not null references user_profiles(id) on delete restrict,
  name text not null,
  grade_level text,
  academic_year text,
  created_at timestamptz not null default now()
);

create index idx_classes_school on classes(school_id);
create index idx_classes_teacher on classes(teacher_id);

-- Students
create table students (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references classes(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  student_code text,
  date_of_birth date,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_students_class on students(class_id);

-- Works (student submissions)
create table works (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  title text not null,
  work_type text not null check (work_type in ('essay', 'exam', 'homework', 'project', 'other')),
  original_text text,
  file_name text,
  word_count integer,
  submitted_by uuid not null references user_profiles(id),
  created_at timestamptz not null default now()
);

create index idx_works_student on works(student_id);
create index idx_works_submitted_by on works(submitted_by);

-- Analyses (LLM evaluation results)
create table analyses (
  id uuid primary key default uuid_generate_v4(),
  work_id uuid not null references works(id) on delete cascade,
  mode text not null check (mode in ('elementary', 'highschool', 'university')),
  score_structure numeric(3,1) not null check (score_structure between 0 and 5),
  score_clarity numeric(3,1) not null check (score_clarity between 0 and 5),
  score_evidence numeric(3,1) not null check (score_evidence between 0 and 5),
  score_originality numeric(3,1) not null check (score_originality between 0 and 5),
  score_coherence numeric(3,1) not null check (score_coherence between 0 and 5),
  result_json jsonb not null,
  mental_monitoring_enabled boolean not null default false,
  mental_monitoring_level text check (mental_monitoring_level in ('none', 'mild', 'flag')),
  talent_json jsonb,
  llm_model text,
  processing_time_ms integer,
  created_at timestamptz not null default now()
);

create index idx_analyses_work on analyses(work_id);
create index idx_analyses_created on analyses(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Every table is locked down. Users only see their school's data.
-- ============================================================================

alter table schools enable row level security;
alter table user_profiles enable row level security;
alter table classes enable row level security;
alter table students enable row level security;
alter table works enable row level security;
alter table analyses enable row level security;

-- Helper: get the current user's school_id
create or replace function auth.user_school_id()
returns uuid
language sql
stable
security definer
as $$
  select school_id from user_profiles where id = auth.uid();
$$;

-- Helper: get the current user's role
create or replace function auth.user_role()
returns text
language sql
stable
security definer
as $$
  select role from user_profiles where id = auth.uid();
$$;

-- ---------- Schools ----------
-- Users can only see their own school
create policy "Users see own school"
  on schools for select
  using (id = auth.user_school_id());

-- Only admins can insert/update schools
create policy "Admins manage schools"
  on schools for all
  using (auth.user_role() = 'admin');

-- ---------- User Profiles ----------
-- Users can see profiles from their own school
create policy "Users see school profiles"
  on user_profiles for select
  using (school_id = auth.user_school_id());

-- Users can update their own profile
create policy "Users update own profile"
  on user_profiles for update
  using (id = auth.uid());

-- Allow insert during registration (service role handles this)
create policy "Service inserts profiles"
  on user_profiles for insert
  with check (id = auth.uid());

-- ---------- Classes ----------
-- Users see classes from their own school
create policy "Users see school classes"
  on classes for select
  using (school_id = auth.user_school_id());

-- Teachers can create classes in their school
create policy "Teachers create classes"
  on classes for insert
  with check (
    school_id = auth.user_school_id()
    and teacher_id = auth.uid()
  );

-- Teachers can update their own classes; principals/admins can update any
create policy "Teachers update own classes"
  on classes for update
  using (
    school_id = auth.user_school_id()
    and (teacher_id = auth.uid() or auth.user_role() in ('principal', 'admin'))
  );

-- Teachers can delete their own classes; principals/admins can delete any
create policy "Teachers delete own classes"
  on classes for delete
  using (
    school_id = auth.user_school_id()
    and (teacher_id = auth.uid() or auth.user_role() in ('principal', 'admin'))
  );

-- ---------- Students ----------
-- Users see students from classes in their school
create policy "Users see school students"
  on students for select
  using (
    class_id in (
      select id from classes where school_id = auth.user_school_id()
    )
  );

-- Teachers can add students to their classes; principals/admins to any class
create policy "Teachers add students"
  on students for insert
  with check (
    class_id in (
      select id from classes
      where school_id = auth.user_school_id()
        and (teacher_id = auth.uid() or auth.user_role() in ('principal', 'admin'))
    )
  );

-- Teachers can update students in their classes
create policy "Teachers update students"
  on students for update
  using (
    class_id in (
      select id from classes
      where school_id = auth.user_school_id()
        and (teacher_id = auth.uid() or auth.user_role() in ('principal', 'admin'))
    )
  );

-- Teachers can delete students in their classes
create policy "Teachers delete students"
  on students for delete
  using (
    class_id in (
      select id from classes
      where school_id = auth.user_school_id()
        and (teacher_id = auth.uid() or auth.user_role() in ('principal', 'admin'))
    )
  );

-- ---------- Works ----------
-- Users see works from students in their school
create policy "Users see school works"
  on works for select
  using (
    student_id in (
      select s.id from students s
      join classes c on s.class_id = c.id
      where c.school_id = auth.user_school_id()
    )
  );

-- Teachers can submit works for students in their classes
create policy "Teachers create works"
  on works for insert
  with check (
    submitted_by = auth.uid()
    and student_id in (
      select s.id from students s
      join classes c on s.class_id = c.id
      where c.school_id = auth.user_school_id()
    )
  );

-- Teachers can update works they submitted
create policy "Teachers update own works"
  on works for update
  using (
    submitted_by = auth.uid()
    or auth.user_role() in ('principal', 'admin')
  );

-- Teachers can delete works they submitted
create policy "Teachers delete own works"
  on works for delete
  using (
    submitted_by = auth.uid()
    or auth.user_role() in ('principal', 'admin')
  );

-- ---------- Analyses ----------
-- Users see analyses for works in their school
create policy "Users see school analyses"
  on analyses for select
  using (
    work_id in (
      select w.id from works w
      join students s on w.student_id = s.id
      join classes c on s.class_id = c.id
      where c.school_id = auth.user_school_id()
    )
  );

-- Analyses are created by the system (via service role in API)
-- but teachers can trigger them for works in their school
create policy "Teachers create analyses"
  on analyses for insert
  with check (
    work_id in (
      select w.id from works w
      join students s on w.student_id = s.id
      join classes c on s.class_id = c.id
      where c.school_id = auth.user_school_id()
    )
  );

-- Analyses are immutable — no update/delete by regular users
-- (only service role can modify for data corrections)

-- ============================================================================
-- VIEWS (convenient aggregated queries)
-- ============================================================================

-- Student overview with aggregated scores
create or replace view student_overview as
select
  s.id,
  s.class_id,
  s.first_name,
  s.last_name,
  s.student_code,
  s.date_of_birth,
  s.notes,
  s.created_at,
  c.name as class_name,
  count(distinct w.id) as works_count,
  max(a.created_at) as last_analysis_at,
  case when count(a.id) > 0 then round(avg(a.score_structure)::numeric, 1) end as avg_structure,
  case when count(a.id) > 0 then round(avg(a.score_clarity)::numeric, 1) end as avg_clarity,
  case when count(a.id) > 0 then round(avg(a.score_evidence)::numeric, 1) end as avg_evidence,
  case when count(a.id) > 0 then round(avg(a.score_originality)::numeric, 1) end as avg_originality,
  case when count(a.id) > 0 then round(avg(a.score_coherence)::numeric, 1) end as avg_coherence
from students s
join classes c on s.class_id = c.id
left join works w on w.student_id = s.id
left join analyses a on a.work_id = w.id
group by s.id, s.class_id, s.first_name, s.last_name, s.student_code,
         s.date_of_birth, s.notes, s.created_at, c.name;

-- Dashboard stats view
create or replace view dashboard_stats as
select
  c.school_id,
  count(distinct s.id) as total_students,
  count(distinct a.id) as total_analyses,
  count(distinct c.id) as total_classes,
  coalesce(round(avg(
    (a.score_structure + a.score_clarity + a.score_evidence + a.score_originality + a.score_coherence) / 5.0
  )::numeric, 1), 0) as avg_overall_score
from classes c
left join students s on s.class_id = c.id
left join works w on w.student_id = s.id
left join analyses a on a.work_id = w.id
group by c.school_id;

-- Recent analyses view
create or replace view recent_analyses_view as
select
  a.id,
  s.first_name || ' ' || s.last_name as student_name,
  w.title as work_title,
  round(
    ((a.score_structure + a.score_clarity + a.score_evidence + a.score_originality + a.score_coherence) / 5.0)::numeric,
    1
  ) as avg_score,
  a.created_at,
  a.mode,
  cl.school_id
from analyses a
join works w on a.work_id = w.id
join students s on w.student_id = s.id
join classes cl on s.class_id = cl.id
order by a.created_at desc;
