import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface RecipeSkeletonProps {
  className?: string;
}

export function RecipeSkeleton({ className }: RecipeSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

export function RecipeGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <RecipeSkeleton key={i} />
      ))}
    </div>
  );
}