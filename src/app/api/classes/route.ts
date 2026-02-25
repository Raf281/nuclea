import { NextRequest, NextResponse } from "next/server";
import { getClasses, createClass, isLiveMode } from "@/lib/data";

// GET /api/classes — list all classes for the user's school
export async function GET() {
  const classes = await getClasses("school-1");
  return NextResponse.json(classes);
}

// POST /api/classes — create a new class
export async function POST(request: NextRequest) {
  if (!isLiveMode()) {
    return NextResponse.json(
      { error: "Class creation requires live mode" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, grade_level, academic_year, school_id, teacher_id } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const result = await createClass({
    school_id: school_id ?? "school-1",
    teacher_id: teacher_id ?? "",
    name,
    grade_level,
    academic_year,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
