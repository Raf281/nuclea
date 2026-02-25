"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, School, Shield, Mail } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  role: string;
  mode?: string;
  school_id?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("nuclea-user="));
      if (cookie) {
        setUser(JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))));
      }
    } catch {
      // Cookie parsing failed
    }
  }, []);

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "—";
  const displayRole = user?.role ?? "teacher";
  const isDemo = user?.mode === "demo" || !user?.mode;

  return (
    <>
      <Header title="Settings" subtitle="Manage your account and school" />

      <div className="p-6 max-w-3xl space-y-6">
        {/* Mode indicator */}
        {isDemo && (
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Badge variant="secondary">Demo Mode</Badge>
              <p className="text-sm text-muted-foreground">
                You are using the demo account. Data is not persisted.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <Badge variant="default" className="capitalize">{displayRole}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mode</p>
                <Badge variant={isDemo ? "secondary" : "default"}>
                  {isDemo ? "Demo" : "Live"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* School */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <School className="h-4 w-4" />
              School
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {isDemo ? "Demo International School" : "Your School"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isDemo ? "Demo data — create a live account to connect your school" : "Connected"}
            </p>
          </CardContent>
        </Card>

        {/* Invitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Invitations
            </CardTitle>
            <CardDescription>Invite teachers to your school (Principal only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="teacher@school.edu"
                disabled={isDemo}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              />
              <Button disabled={isDemo}>Send Invite</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isDemo
                ? "Invitations are disabled in demo mode."
                : "Invited users will receive an email with a registration link."}
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Invite-only access — no public registration</p>
              <p>Row-level security enforced on all data</p>
              <p>AI analysis uses Claude API with no data retention</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
