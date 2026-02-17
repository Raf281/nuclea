"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_USER, DEMO_SCHOOL } from "@/lib/demo-data";
import { User, School, Shield, Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Manage your account and school" />

      <div className="p-6 max-w-3xl space-y-6">
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
                <p className="text-sm font-medium">{DEMO_USER.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{DEMO_USER.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <Badge variant="default" className="capitalize">{DEMO_USER.role}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Member since</p>
                <p className="text-sm">{new Date(DEMO_USER.created_at).toLocaleDateString()}</p>
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
            <p className="text-sm font-medium">{DEMO_SCHOOL.name}</p>
            <p className="text-xs text-muted-foreground mt-1">Slug: {DEMO_SCHOOL.slug}</p>
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
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button>Send Invite</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Invited users will receive an email with a registration link.
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
