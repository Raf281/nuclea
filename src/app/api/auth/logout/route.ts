import { NextResponse } from "next/server";
import { isLiveMode } from "@/lib/data";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear demo session cookies
  response.cookies.set("nuclea-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("nuclea-user", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  // Sign out from Supabase if live mode
  if (isLiveMode()) {
    try {
      const { getSupabaseServer } = await import("@/lib/supabase/server");
      const supabase = await getSupabaseServer();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Supabase sign-out failure is non-critical
    }
  }

  return response;
}
