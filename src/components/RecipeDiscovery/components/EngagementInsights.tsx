import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EngagementInsightsProps {
  views: number;
  completionRate: number;
  comments: number;
}

function getCompletionTip(rate: number): string {
  if (rate < 50) return "Try simplifying your steps or adding visuals";
  if (rate < 75) return "Consider breaking long steps into smaller ones";
  return "Great job! Your recipe is highly engaging";
}

export function EngagementInsights({ views, completionRate, comments }: EngagementInsightsProps) {
  const tip = getCompletionTip(completionRate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Views</h3>
        <div className="text-2xl font-bold">{views}</div>
        <div className="text-sm text-muted-foreground">Total recipe views</div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Completion Rate</h3>
        <Progress value={completionRate} className="mb-2" />
        <div className="text-sm text-muted-foreground">{tip}</div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Engagement</h3>
        <div className="text-2xl font-bold">{comments}</div>
        <div className="text-sm text-muted-foreground">Comments received</div>
      </Card>
    </div>
  );
}