import { NextRequest, NextResponse } from "next/server";
import { getStudents, getStudentsByClass, createStudent, isLiveMode } from "@/lib/data";

// GET /api/students — list students, optionally filtered by class_id
export async function GET(request: NextRequest) {
  const classId = request.nextUrl.searchParams.get("class_id");

  if (classId) {
    const students = await getStudentsByClass(classId);
    return NextResponse.json(students);
  }

  const students = await getStudents("school-1");
  return NextResponse.json(students);
}

// POST /api/students — create a new student
export async function POST(request: NextRequest) {
  if (!isLiveMode()) {
    return NextResponse.json(
      { error: "Student creation requires live mode" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { class_id, first_name, last_name, student_code, date_of_birth, notes } = body;

  if (!class_id || !first_name || !last_name) {
    return NextResponse.json(
      { error: "class_id, first_name, and last_name are required" },
      { status: 400 }
    );
  }

  const result = await createStudent({
    class_id,
    first_name,
    last_name,
    student_code,
    date_of_birth,
    notes,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
