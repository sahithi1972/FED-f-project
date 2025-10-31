import { Filter, ChevronDown, X } from 'lucide-react';
import { SearchFilters } from '../RecipeSearch/types';
import { CUISINES, DIETARY_RESTRICTIONS, DIFFICULTY_LEVELS } from '../RecipeSearch/constants';

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface FilterSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <div className="border-b border-border py-4">
      <button className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
      <div>{children}</div>
    </div>
  );
}

export function FilterSidebar({ filters, onChange, isOpen, onClose }: FilterSidebarProps) {
  const updateFilters = (key: keyof SearchFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={`
        fixed inset-y-0 right-0 w-80 bg-background border-l border-border p-6 transform transition-transform duration-300 ease-in-out z-50
        lg:relative lg:translate-x-0 lg:w-72 lg:border lg:rounded-xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">Advanced Filters</h3>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-muted rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filter Sections */}
      <div className="space-y-4">
        {/* Cooking Time */}
        <FilterSection title="Cooking Time" icon="⏱️">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-primary font-medium">
                {filters.cookingTime || 120} minutes
              </label>
              <input
                type="range"
                min="5"
                max="120"
                value={filters.cookingTime || 120}
                onChange={e => updateFilters('cookingTime', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>30 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
        </FilterSection>

        {/* Cuisine */}
        <FilterSection title="Cuisine" icon="🍽️">
          <div className="space-y-2">
            {CUISINES.map(cuisine => (
              <label key={cuisine.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.cuisine.includes(cuisine.value)}
                  onChange={e => {
                    const newCuisines = e.target.checked
                      ? [...filters.cuisine, cuisine.value]
                      : filters.cuisine.filter(c => c !== cuisine.value);
                    updateFilters('cuisine', newCuisines);
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">{cuisine.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Dietary */}
        <FilterSection title="Dietary" icon="🥗">
          <div className="space-y-2">
            {DIETARY_RESTRICTIONS.map(diet => (
              <label key={diet.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.dietary.includes(diet.value)}
                  onChange={e => {
                    const newDietary = e.target.checked
                      ? [...filters.dietary, diet.value]
                      : filters.dietary.filter(d => d !== diet.value);
                    updateFilters('dietary', newDietary);
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">{diet.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Difficulty */}
        <FilterSection title="Difficulty" icon="📊">
          <div className="space-y-2">
            {DIFFICULTY_LEVELS.map(level => (
              <label key={level.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.difficulty.includes(level.value)}
                  onChange={e => {
                    const newDifficulty = e.target.checked
                      ? [...filters.difficulty, level.value]
                      : filters.difficulty.filter(d => d !== level.value);
                    updateFilters('difficulty', newDifficulty);
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">{level.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Clear All Button */}
      <button
        onClick={() => onChange({
          cuisine: [],
          cookingTime: null,
          dietary: [],
          difficulty: [],
          sort: 'relevant',
          usesLeftovers: false,
          onePot: false,
          seasonal: false,
          microwave: false
        })}
        className="mt-6 w-full px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}