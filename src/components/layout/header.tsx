"use client";

import { ThemeToggle } from "./theme-toggle";
import { Badge } from "@/components/ui/badge";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Dashboard", subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:inline-flex text-xs">
          Demo Mode
        </Badge>
        <ThemeToggle />
        <div className="flex items-center gap-2 ml-2 pl-2 border-l">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">Dr. Sarah Mitchell</p>
            <p className="text-xs text-muted-foreground">Principal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
