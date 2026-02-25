import { NextRequest, NextResponse } from "next/server";
import { isLiveMode } from "@/lib/data";

// Demo credentials — always available as fallback
const DEMO_ACCOUNTS = [
  { email: "demo@nuclea.com", password: "demo123", name: "Dr. Sarah Mitchell", role: "principal" },
];

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // --- Demo login (always available) ---
  const demoAccount = DEMO_ACCOUNTS.find(
    (a) => a.email === email && a.password === password
  );

  if (demoAccount) {
    const sessionToken = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      user: { email: demoAccount.email, name: demoAccount.name, role: demoAccount.role },
      mode: "demo",
    });

    response.cookies.set("nuclea-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set(
      "nuclea-user",
      JSON.stringify({
        email: demoAccount.email,
        name: demoAccount.name,
        role: demoAccount.role,
        mode: "demo",
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return response;
  }

  // --- Supabase Auth (live mode) ---
  if (isLiveMode()) {
    const { getSupabaseServer } = await import("@/lib/supabase/server");
    const supabase = await getSupabaseServer();

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const response = NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.full_name ?? data.user.email,
          role: profile?.role ?? "teacher",
          school_id: profile?.school_id,
        },
        mode: "live",
      });

      // Store user info for client-side access
      response.cookies.set(
        "nuclea-user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: profile?.full_name ?? data.user.email,
          role: profile?.role ?? "teacher",
          school_id: profile?.school_id,
          mode: "live",
        }),
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        }
      );

      return response;
    }
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
