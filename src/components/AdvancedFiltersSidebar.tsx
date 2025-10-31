import React from "react";
import { X, SlidersHorizontal } from "lucide-react";

interface AdvancedFiltersSidebarProps {
  open: boolean;
  onClose: () => void;
  filters: any;
  onChange: (filters: any) => void;
}

export const AdvancedFiltersSidebar: React.FC<AdvancedFiltersSidebarProps> = ({
  open,
  onClose,
  filters,
  onChange,
}) => {
  // Example filter fields, can be extended as needed
  return (
    <aside
      className={`fixed top-0 right-0 h-full w-80 max-w-full bg-background shadow-lg z-40 transition-transform duration-300 ease-in-out border-l border-border
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      aria-label="Advanced filters sidebar"
      role="complementary"
      tabIndex={open ? 0 : -1}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
        <span className="flex items-center gap-2 font-semibold text-lg">
          <SlidersHorizontal className="w-5 h-5" aria-hidden />
          Filters
        </span>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/60"
          aria-label="Close filters sidebar"
          onClick={onClose}
        >
          <X className="w-5 h-5" aria-hidden />
        </button>
      </div>
      <form className="flex flex-col gap-4 p-4 overflow-y-auto h-[calc(100%-56px)]" onSubmit={e => e.preventDefault()}>
        {/* Time filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Max Cooking Time (mins)</span>
          <input
            type="number"
            min={0}
            value={filters.time || ''}
            onChange={e => onChange({ ...filters, time: e.target.value })}
            className="input"
            aria-label="Max cooking time in minutes"
          />
        </label>
        {/* Budget filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Max Budget ($)</span>
          <input
            type="number"
            min={0}
            value={filters.budget || ''}
            onChange={e => onChange({ ...filters, budget: e.target.value })}
            className="input"
            aria-label="Max budget in dollars"
          />
        </label>
        {/* Cuisine filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Cuisine</span>
          <select
            value={filters.cuisine || ''}
            onChange={e => onChange({ ...filters, cuisine: e.target.value })}
            className="input"
            aria-label="Cuisine type"
          >
            <option value="">Any</option>
            <option value="italian">Italian</option>
            <option value="indian">Indian</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="american">American</option>
            <option value="mediterranean">Mediterranean</option>
          </select>
        </label>
        {/* Dietary filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Dietary</span>
          <select
            value={filters.dietary || ''}
            onChange={e => onChange({ ...filters, dietary: e.target.value })}
            className="input"
            aria-label="Dietary preference"
          >
            <option value="">Any</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="glutenfree">Gluten-Free</option>
            <option value="dairyfree">Dairy-Free</option>
          </select>
        </label>
        {/* Difficulty filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Difficulty</span>
          <select
            value={filters.difficulty || ''}
            onChange={e => onChange({ ...filters, difficulty: e.target.value })}
            className="input"
            aria-label="Recipe difficulty"
          >
            <option value="">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        {/* Special filter */}
        <label className="flex flex-col gap-1">
          <span className="font-medium">Special</span>
          <select
            value={filters.special || ''}
            onChange={e => onChange({ ...filters, special: e.target.value })}
            className="input"
            aria-label="Special filter"
          >
            <option value="">None</option>
            <option value="leftover">Uses Leftovers</option>
            <option value="onepot">One-Pot Meals</option>
            <option value="seasonal">Seasonal</option>
            <option value="trending">Trending</option>
          </select>
        </label>
        <button
          type="button"
          className="mt-2 py-2 px-4 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60"
          onClick={onClose}
        >
          Apply Filters
        </button>
      </form>
    </aside>
  );
};
