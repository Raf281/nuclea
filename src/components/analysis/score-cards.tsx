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
    <div className="grid gap-3 sm:grid-cols-5">
      {DIMENSIONS.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
            <span className={cn("text-lg font-bold", scoreColor(scores[key]))}>
              {scores[key]}
            </span>
          </div>
          <Progress value={(scores[key] / 5) * 100} className={cn("h-1.5", progressColor(scores[key]))} />
          {justifications?.[key] && (
            <p className="text-xs text-muted-foreground leading-relaxed">{justifications[key]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
