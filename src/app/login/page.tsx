"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <svg viewBox="0 0 40 40" className="h-16 w-16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
                className="stroke-primary fill-primary/10"
                strokeWidth="1.5"
              />
              <path
                d="M20 8 L30 20 L20 32 L10 20 Z"
                className="fill-primary/20 stroke-primary"
                strokeWidth="1"
              />
              <line x1="20" y1="2" x2="20" y2="14" className="stroke-primary" strokeWidth="1" opacity="0.5" />
              <line x1="20" y1="26" x2="20" y2="38" className="stroke-primary" strokeWidth="1" opacity="0.5" />
              <line x1="4" y1="20" x2="14" y2="20" className="stroke-primary" strokeWidth="1" opacity="0.5" />
              <line x1="26" y1="20" x2="36" y2="20" className="stroke-primary" strokeWidth="1" opacity="0.5" />
              <circle cx="20" cy="20" r="2.5" className="fill-primary" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-[0.3em] uppercase">NUCLEA</h1>
          <p className="mt-1 text-xs tracking-[0.2em] uppercase text-muted-foreground">Intelligence</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="demo@nuclea.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 rounded-md border border-dashed border-muted-foreground/25 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Demo Access:</span>{" "}
                demo@nuclea.com / demo123
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          NUCLEA Intelligence &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
