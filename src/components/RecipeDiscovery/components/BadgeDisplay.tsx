import { Badge } from "@/data/badges";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger>
              <Card className={`p-4 text-center transition-all duration-200 ${
                badge.isUnlocked 
                  ? "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200" 
                  : "opacity-50 grayscale"
              }`}>
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm">{badge.title}</h3>
                {badge.isUnlocked ? (
                  <span className="text-xs text-green-600 mt-1 block">Unlocked!</span>
                ) : (
                  <div className="text-xs text-muted-foreground mt-1">
                    Progress: {badge.currentProgress}/{badge.requirement}
                  </div>
                )}
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.description}</p>
              {!badge.isUnlocked && (
                <div className="mt-1">
                  <Progress value={(badge.currentProgress / badge.requirement) * 100} className="h-1" />
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}