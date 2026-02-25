import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/data";

export async function POST(request: NextRequest) {
  if (!isLiveMode()) {
    return NextResponse.json(
      { error: "Registration requires Supabase configuration" },
      { status: 400 }
    );
  }

  const { email, password, full_name, school_name } = await request.json();

  // Input validation
  if (!email || !password || !full_name) {
    return NextResponse.json(
      { error: "Email, password, and full name are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase/server");
  const adminClient = getSupabaseAdmin();

  if (!adminClient) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Create school if name provided
  let schoolId: string | null = null;
  if (school_name) {
    const slug = school_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data: school, error: schoolError } = await adminClient
      .from("schools")
      .insert({ name: school_name, slug })
      .select()
      .single();

    if (schoolError) {
      return NextResponse.json(
        { error: "Failed to create school" },
        { status: 500 }
      );
    }
    schoolId = school.id;
  }

  // Create Supabase Auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create account" },
      { status: 400 }
    );
  }

  // Create user profile
  const { error: profileError } = await adminClient
    .from("user_profiles")
    .insert({
      id: authData.user.id,
      email,
      full_name,
      role: schoolId ? "principal" : "teacher",
      school_id: schoolId,
    });

  if (profileError) {
    // Rollback: delete the auth user if profile creation fails
    await adminClient.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: authData.user.id,
      email,
      name: full_name,
    },
  });
}
