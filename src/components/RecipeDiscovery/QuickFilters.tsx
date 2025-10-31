import { Check, SlidersHorizontal } from 'lucide-react';
import { quickFilters, filterDescriptions } from './constants';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';

interface QuickFiltersProps {
  activeFilters: string[];
  onToggle: (filterId: string) => void;
  onShowAdvanced: () => void;
}

export function QuickFilters({ activeFilters, onToggle, onShowAdvanced }: QuickFiltersProps) {
  const [sortedFilters, setSortedFilters] = useState(quickFilters);

  useEffect(() => {
    const updateFilters = () => {
      const activeFilterItems = quickFilters.filter(f => activeFilters.includes(f.id));
      const inactiveFilterItems = quickFilters.filter(f => !activeFilters.includes(f.id));
      
      // Sort dynamic filters first, then active filters, then the rest
      const dynamicFilters = inactiveFilterItems.filter(f => f.dynamic);
      const regularFilters = inactiveFilterItems.filter(f => !f.dynamic);
      
      setSortedFilters([...activeFilterItems, ...dynamicFilters, ...regularFilters]);
    };

    updateFilters();
  }, [activeFilters]);

  return (
    <div className="py-2">
      <div className="overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2 min-w-max">
          <TooltipProvider>
            {sortedFilters.map(filter => (
              <Tooltip key={filter.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onToggle(filter.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105",
                      activeFilters.includes(filter.id)
                        ? "bg-gradient-to-r from-primary to-primary-600 text-primary-foreground shadow-lg shadow-primary/30"
                        : filter.dynamic
                        ? "border-2 border-primary/40 hover:border-primary hover:bg-primary/10 animate-pulse"
                        : "border-2 border-border hover:border-primary hover:bg-primary/10"
                    )}
                  >
                    <span className="text-base">{filter.icon}</span>
                    <span>{filter.label}</span>
                    {activeFilters.includes(filter.id) && (
                      <Check size={16} className="ml-1 animate-in zoom-in" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-sm">
                  {filterDescriptions[filter.id]}
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onShowAdvanced}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 border-primary text-primary hover:bg-primary/10 transition-all hover:scale-105"
                >
                  <SlidersHorizontal size={16} />
                  More Filters
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Access advanced filtering options
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}