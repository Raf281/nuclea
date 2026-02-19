import { NextRequest, NextResponse } from "next/server";

// Demo credentials — replace with Supabase Auth later
const DEMO_ACCOUNTS = [
  { email: "demo@nuclea.com", password: "demo123", name: "Dr. Sarah Mitchell", role: "principal" },
];

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const account = DEMO_ACCOUNTS.find(
    (a) => a.email === email && a.password === password
  );

  if (!account) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create a simple session token
  const sessionToken = crypto.randomUUID();

  const response = NextResponse.json({
    success: true,
    user: { email: account.email, name: account.name, role: account.role },
  });

  // Set HTTP-only session cookie (7 days)
  response.cookies.set("nuclea-session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Store user info in a readable cookie for client-side access
  response.cookies.set(
    "nuclea-user",
    JSON.stringify({ email: account.email, name: account.name, role: account.role }),
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
