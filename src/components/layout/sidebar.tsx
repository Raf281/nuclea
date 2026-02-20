"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileSearch,
  Settings,
  Sparkles,
  Heart,
  LineChart,
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Academic",
    items: [
      { label: "Classes", href: "/classes", icon: GraduationCap },
      { label: "Students", href: "/students", icon: Users },
      { label: "Analyze", href: "/analyze", icon: FileSearch },
    ],
  },
  {
    group: "Beta",
    items: [
      { label: "Talent Matching", href: "/talent-matching", icon: Sparkles, beta: true },
      { label: "Mental Monitoring", href: "/mental-monitoring", icon: Heart, beta: true },
      { label: "Individual Development", href: "/individual-development", icon: LineChart, beta: true },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("nuclea-user="));
      if (raw) {
        const data = JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("=")));
        setUserName(data.name || "");
        setUserEmail(data.email || "");
      }
    } catch { /* ignore */ }
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-0 md:w-16 overflow-hidden" : "w-64",
          "hidden md:block"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              {/* Geometric hexagon logo inspired by Palantir */}
              <div className="relative flex h-9 w-9 items-center justify-center">
                <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer hexagon */}
                  <path
                    d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
                    className="stroke-primary fill-primary/10"
                    strokeWidth="1.5"
                  />
                  {/* Inner diamond */}
                  <path
                    d="M20 8 L30 20 L20 32 L10 20 Z"
                    className="fill-primary/20 stroke-primary"
                    strokeWidth="1"
                  />
                  {/* Center lines radiating outward */}
                  <line x1="20" y1="2" x2="20" y2="14" className="stroke-primary" strokeWidth="1" opacity="0.5" />
                  <line x1="20" y1="26" x2="20" y2="38" className="stroke-primary" strokeWidth="1" opacity="0.5" />
                  <line x1="4" y1="20" x2="14" y2="20" className="stroke-primary" strokeWidth="1" opacity="0.5" />
                  <line x1="26" y1="20" x2="36" y2="20" className="stroke-primary" strokeWidth="1" opacity="0.5" />
                  {/* Center dot */}
                  <circle cx="20" cy="20" r="2.5" className="fill-primary" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold tracking-[0.25em] uppercase leading-none">NUCLEA</span>
                <span className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase mt-0.5">Intelligence</span>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((group) => (
            <div key={group.group} className="mb-3">
              {!collapsed && (
                <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {"beta" in item && item.beta && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Beta
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleLogout} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 w-full" onClick={handleLogout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
