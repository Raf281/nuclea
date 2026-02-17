import { Progress } from "@/components/ui/progress";
import type { RubricScores } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoreCardsProps {
  scores: RubricScores;
  justifications?: Partial<Record<keyof RubricScores, string>>;
}

const DIMENSIONS: { key: keyof RubricScores; label: string }[] = [
  { key: "structure", label: "Structure" },
  { key: "clarity", label: "Clarity" },
  { key: "evidence", label: "Evidence" },
  { key: "originality", label: "Originality" },
  { key: "coherence", label: "Coherence" },
];

function scoreColor(score: number): string {
  if (score >= 4) return "text-green-500";
  if (score >= 3) return "text-yellow-500";
  return "text-red-500";
}

function progressColor(score: number): string {
  if (score >= 4) return "[&>div]:bg-green-500";
  if (score >= 3) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

export function ScoreCards({ scores, justifications }: ScoreCardsProps) {
  return (
    <div className="space-y-3">
      {DIMENSIONS.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">{label}</span>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Progress value={(scores[key] / 5) * 100} className={cn("h-2 flex-1", progressColor(scores[key]))} />
              <span className={cn("text-sm font-bold tabular-nums shrink-0 w-8 text-right", scoreColor(scores[key]))}>
                {scores[key]}<span className="text-muted-foreground font-normal">/5</span>
              </span>
            </div>
          </div>
          {justifications?.[key] && (
            <p className="text-xs text-muted-foreground leading-relaxed pl-0">{justifications[key]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
