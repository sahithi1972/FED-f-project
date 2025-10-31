import { Button } from "@/components/ui/button";

interface HoverPreviewProps {
  ingredients: string[];
  steps: string[];
  onViewFull: () => void;
}

export function HoverPreview({ ingredients, steps, onViewFull }: HoverPreviewProps) {
  return (
    <div className="hover-preview p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Quick Ingredients</h4>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            {ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="line-clamp-1">{ingredient}</li>
            ))}
            {ingredients.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{ingredients.length - 3} more ingredients
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">First Step</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {steps[0]}
          </p>
        </div>

        <Button 
          onClick={onViewFull}
          className="w-full"
          variant="secondary"
        >
          View Full Recipe
        </Button>
      </div>
    </div>
  );
}