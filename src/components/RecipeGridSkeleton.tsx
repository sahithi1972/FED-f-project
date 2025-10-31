import { RecipeSkeleton } from "./RecipeSkeleton";

interface RecipeGridSkeletonProps {
  count?: number;
}

export function RecipeGridSkeleton({ count = 12 }: RecipeGridSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <RecipeSkeleton key={index} />
      ))}
    </>
  );
}