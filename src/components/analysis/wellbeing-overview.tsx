"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WellbeingResult } from "@/lib/types";
import { Heart, AlertTriangle, CheckCircle, Info, ShieldCheck } from "lucide-react";

interface WellbeingOverviewProps {
  wellbeing: WellbeingResult;
}

const LEVEL_CONFIG = {
  none: {
    icon: CheckCircle,
    badge: "success" as const,
    label: "No Concerns",
    bgColor: "bg-green-500/5 border-green-500/20",
    barColor: "bg-green-500",
    description: "No wellbeing signals were detected in this work.",
  },
  mild: {
    icon: Info,
    badge: "warning" as const,
    label: "Mild Indicators",
    bgColor: "bg-yellow-500/5 border-yellow-500/20",
    barColor: "bg-yellow-500",
    description: "Some mild indicators were found. Monitoring recommended.",
  },
  flag: {
    icon: AlertTriangle,
    badge: "destructive" as const,
    label: "Attention Needed",
    bgColor: "bg-red-500/5 border-red-500/20",
    barColor: "bg-red-500",
    description: "Significant indicators detected. Professional follow-up recommended.",
  },
};

export function WellbeingOverview({ wellbeing }: WellbeingOverviewProps) {
  const config = LEVEL_CONFIG[wellbeing.level];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4" />
          Wellbeing Assessment
          <Badge variant="secondary" className="text-[10px]">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status indicator */}
        <div className={`rounded-lg border p-4 ${config.bgColor}`}>
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={config.badge}>{config.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Signal level gauge */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Signal Level</p>
          <div className="flex gap-1.5">
            <div className={`h-3 flex-1 rounded-l-full ${wellbeing.level !== "none" ? "bg-green-500" : "bg-green-500"}`} />
            <div className={`h-3 flex-1 ${wellbeing.level === "mild" || wellbeing.level === "flag" ? "bg-yellow-500" : "bg-muted"}`} />
            <div className={`h-3 flex-1 rounded-r-full ${wellbeing.level === "flag" ? "bg-red-500" : "bg-muted"}`} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Clear</span>
            <span>Mild</span>
            <span>Flag</span>
          </div>
        </div>

        {/* LLM note */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assessment Note</p>
          <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-3">{wellbeing.note}</p>
        </div>

        {/* Recommended next step */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recommended Action</p>
          <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">{wellbeing.next_step}</p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground italic border-t pt-3">
          Disclaimer: This is an AI-assisted screening tool only. It is indicative, not diagnostic.
          All decisions regarding student wellbeing must be made by qualified professionals.
        </p>
      </CardContent>
    </Card>
  );
}
