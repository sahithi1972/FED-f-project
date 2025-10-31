import React from "react";
import { Check, SlidersHorizontal } from "lucide-react";

interface QuickFilter {
  id: string;
  label: string;
  icon?: string;
  default?: boolean;
}

interface QuickFiltersProps {
  quickFilters: QuickFilter[];
  activeFilters: string[];
  onToggle: (id: string) => void;
  onMore: () => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  quickFilters,
  activeFilters,
  onToggle,
  onMore,
}) => {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
      aria-label="Quick filters"
      tabIndex={0}
    >
      {quickFilters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            type="button"
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-accent hover:text-accent-foreground"
            }`}
            aria-pressed={isActive}
            aria-label={filter.label}
            onClick={() => onToggle(filter.id)}
          >
            {filter.icon && <span className="mr-1 text-lg" aria-hidden>{filter.icon}</span>}
            {filter.label}
            {isActive && <Check className="ml-1 w-4 h-4" aria-hidden />}
          </button>
        );
      })}
      <button
        type="button"
        className="flex items-center gap-1 px-3 py-1 rounded-full border border-muted-foreground/20 bg-muted text-muted-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
        aria-label="Show advanced filters"
        onClick={onMore}
      >
        <SlidersHorizontal className="w-4 h-4 mr-1" aria-hidden />
        More Filters
      </button>
    </div>
  );
};
