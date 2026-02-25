import { NextRequest, NextResponse } from "next/server";
import { getWorksByStudent, createWork, isLiveMode } from "@/lib/data";

// GET /api/works?student_id=xxx — list works for a student
export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("student_id");

  if (!studentId) {
    return NextResponse.json(
      { error: "student_id parameter is required" },
      { status: 400 }
    );
  }

  const works = await getWorksByStudent(studentId);
  return NextResponse.json(works);
}

// POST /api/works — create a new work
export async function POST(request: NextRequest) {
  if (!isLiveMode()) {
    return NextResponse.json(
      { error: "Work creation requires live mode" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { student_id, title, work_type, original_text, file_name, word_count, submitted_by } = body;

  if (!student_id || !title || !work_type || !submitted_by) {
    return NextResponse.json(
      { error: "student_id, title, work_type, and submitted_by are required" },
      { status: 400 }
    );
  }

  const result = await createWork({
    student_id,
    title,
    work_type,
    original_text,
    file_name,
    word_count,
    submitted_by,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to create work" }, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
