import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, Grid3x3, List, Heart, Clock, DollarSign, ChefHat, Sparkles, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import { Plus } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { QuickFilters } from "./QuickFilters";
import { Check, SlidersHorizontal } from "lucide-react";
import { AdvancedFiltersSidebar } from "./AdvancedFiltersSidebar";
import { RecipeGrid } from "./RecipeDiscovery/RecipeGrid";
import { ThemeToggle } from "./ThemeToggle";
import { Skeleton } from "./ui/loading-placeholder";
import { Recipe } from '@/types/recipe';
import { dummyRecipes } from "@/data/dummy-recipes";

const quickFilters = [
  { id: 'relevant', label: 'Most Relevant', icon: '🎯', default: true },
  { id: 'fast', label: 'Fast Cooking', icon: '⚡', timeFilter: 20 },
  { id: 'budget', label: 'Budget-Friendly', icon: '💰', costFilter: 50 },
  { id: 'leftover', label: 'Uses Leftovers', icon: '♻️', special: true },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', dietary: true },
  { id: 'quick20', label: 'Under 20 mins', icon: '⏱️', timeFilter: 20 },
  { id: 'onepot', label: 'One-Pot Meals', icon: '🍲', special: true },
  { id: 'seasonal', label: 'Seasonal', icon: '🌾', special: true },
  { id: 'trending', label: 'Trending Now', icon: '🔥', sort: 'trending' },
  { id: 'easy', label: 'Easy Recipes', icon: '👍', difficulty: 'easy' }
];

export default function RecipeResultsPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [ingredients, setIngredients] = useState(["Tomato", "Rice", "Onion"]);
  const [searchedIngredients, setSearchedIngredients] = useState(["Tomato", "Rice", "Onion"]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState('relevant');
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState({
    time: 60,
    budget: 'all',
    cuisine: [],
    difficulty: [],
    leftover: false,
    dietary: [], // Add dietary to filter state
  });
  const [activeQuickFilters, setActiveQuickFilters] = useState(['relevant']);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [page, setPage] = useState(1);
  const RECIPES_PER_PAGE = 6;

  // Move debouncedQuery and loading state above useEffect that uses them
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  React.useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => debounceTimeout.current && clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  const filteredRecipes = useMemo(() => {
    let result = [...dummyRecipes];
    
    if (filters.time < 60) result = result.filter(r => r.cookingTime <= filters.time);
    if (filters.budget !== 'all') {
      const ranges = { low: [0, 50], mid: [50, 100], high: [100, 999] };
      const [min, max] = ranges[filters.budget] || [0, 999];
      result = result.filter(r => (r.cost || 0) >= min && (r.cost || 0) <= max);
    }
    if (filters.cuisine.length > 0) result = result.filter(r => filters.cuisine.includes(r.cuisine));
    if (filters.difficulty.length > 0) result = result.filter(r => filters.difficulty.includes(r.difficulty));
    if (filters.leftover) result = result.filter(r => r.usesLeftovers);
    
    // Add debounced search filter
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }
    
    if (sortBy === 'time') result.sort((a, b) => a.cookingTime - b.cookingTime);
    else if (sortBy === 'cost') result.sort((a, b) => (a.cost || 0) - (b.cost || 0));
    else result.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    
    return result;
  }, [filters, sortBy, debouncedQuery]);

  const paginatedRecipes = useMemo(() => {
    const start = 0;
    const end = page * RECIPES_PER_PAGE;
    return filteredRecipes.slice(start, end);
  }, [filteredRecipes, page]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-emerald-400';
    if (match >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
    if (difficulty === 'Medium') return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
    return isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700';
  };

  function removeIngredient(ingredient) {
    setSearchedIngredients(searchedIngredients.filter(i => i !== ingredient));
  }

  function addIngredient() {
    // Placeholder for add logic (could open modal or input)
  }

  function toggleQuickFilter(id) {
    setActiveQuickFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  // Sync quick filters and advanced sidebar filters
  React.useEffect(() => {
    // Example: if 'fast' quick filter is active, set time filter to 20
    let newFilters = { ...filters };
    if (activeQuickFilters.includes('fast') || activeQuickFilters.includes('quick20')) {
      newFilters.time = 20;
    }
    if (activeQuickFilters.includes('budget')) {
      newFilters.budget = 'low';
    }
    if (activeQuickFilters.includes('leftover')) {
      newFilters.leftover = true;
    }
    if (activeQuickFilters.includes('vegetarian')) {
      newFilters.dietary = ['Vegetarian'];
    }
    if (activeQuickFilters.includes('easy')) {
      newFilters.difficulty = ['Easy'];
    }
    setFilters(newFilters);
  }, [activeQuickFilters]);

  // When advanced sidebar changes, update filters
  React.useEffect(() => {
    if (Object.keys(advancedFilters).length > 0) {
      setFilters(f => ({ ...f, ...advancedFilters }));
    }
  }, [advancedFilters]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters, searchQuery]);

  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-900';
  const cardBg = isDark ? 'bg-slate-800/80' : 'bg-white';
  const cardText = isDark ? 'text-slate-300' : 'text-slate-700';
  const inputBg = isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200';

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-container" aria-label="Breadcrumb">
        <a href="/" className="breadcrumb-link" tabIndex={0}>Home</a>
        <ChevronRight size={16} className="breadcrumb-separator" aria-hidden />
        <span className="breadcrumb-active" aria-current="page">Recipes</span>
      </nav>

      {/* Search Bar Section */}
      <section className="search-section" aria-label="Recipe search">
        <div className="search-bar-container">
          {/* Search Input Group */}
          <div className="search-input-group">
            <Search size={20} aria-hidden />
            <input
              type="text"
              placeholder="Search recipes by name, ingredient, or cuisine..."
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search recipes"
            />
            <button className="search-button" aria-label="Submit search">Search</button>
          </div>
          {/* Right Side Controls */}
          <div className="search-controls">
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort recipes"
            >
              <option value="relevant">Most Relevant</option>
              <option value="time">Quickest First</option>
              <option value="cost">Cheapest First</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="view-toggle-buttons" role="group" aria-label="View mode toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3x3 aria-hidden />
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List aria-hidden />
              </button>
              <button
                className={viewMode === "compact" ? "active" : ""}
                onClick={() => setViewMode("compact")}
                aria-label="Compact view"
                aria-pressed={viewMode === "compact"}
              >
                <LayoutGrid aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Tags Section */}
      {searchedIngredients.length > 0 && (
        <div className="ingredient-tags-section">
          <span className="label">Searching with:</span>
          {searchedIngredients.map(ingredient => (
            <div className="ingredient-chip" key={ingredient}>
              <span>{ingredient}</span>
              <button onClick={() => removeIngredient(ingredient)} aria-label={`Remove ${ingredient}`}>
                <X size={14} />
              </button>
            </div>
          ))}
          <button className="add-more-button" onClick={addIngredient}>
            <Plus size={16} /> Add More
          </button>
        </div>
      )}

      {/* Quick Filter Chips Section */}
      <QuickFilters
        quickFilters={quickFilters}
        activeFilters={activeQuickFilters}
        onToggle={toggleQuickFilter}
        onMore={() => setShowAdvancedFilters(true)}
        aria-label="Quick filter chips"
      />

      {/* Advanced Filters Sidebar */}
      <AdvancedFiltersSidebar
        open={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onChange={setAdvancedFilters}
        aria-label="Advanced filters sidebar"
      />

      <div className={`${bgClass} ${textClass} min-h-screen transition-all duration-300`}>
        {/* Header Bar */}
        <div className={`sticky top-0 z-40 ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} backdrop-blur border-b`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Search</span>
            </button>
            <div className="flex-1" />
            <ThemeToggle />
          </div>
          
          {/* Ingredient Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:gap-3 sm:mb-6">
            <span className={`text-sm ${cardText}`}>Searching with:</span>
            {ingredients.map((ing, i) => (
              <div key={i} className={`${isDark ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-100 border-emerald-300'} border px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium group hover:scale-105 transition-transform` + ' max-w-[90vw] truncate'}>
                <span className="truncate">{ing}</span>
                <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className={`${inputBg} border px-3 py-1.5 rounded-lg text-sm font-medium hover:border-emerald-500 transition-colors` + ' max-w-[90vw]'}
            >
              + Add More
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className={`lg:sticky lg:top-24 lg:h-fit w-full lg:w-64 ${cardBg} rounded-2xl p-6 border ${isDark ? 'border-slate-700' : 'border-slate-200'} mb-6 lg:mb-0`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={20} className="text-emerald-400" />
                  Filters
                </h3>
                <button onClick={() => setFilters({ time: 60, budget: 'all', cuisine: [], difficulty: [], leftover: false, dietary: [] })} className="text-sm text-emerald-400 hover:text-emerald-300">Clear</button>
              </div>

              {/* Time Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Cooking Time: {filters.time} mins</label>
                <input type="range" min="5" max="60" value={filters.time} onChange={(e) => setFilters({...filters, time: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
              </div>

              {/* Budget Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Budget</label>
                <div className="space-y-2">
                  {[{id: 'all', label: 'All'}, {id: 'low', label: 'Under ₹50'}, {id: 'mid', label: '₹50-₹100'}, {id: 'high', label: 'Premium'}].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="budget" checked={filters.budget === opt.id} onChange={() => setFilters({...filters, budget: opt.id})} className="accent-emerald-500" />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Cuisine</label>
                <div className="space-y-2">
                  {['Indian', 'Asian', 'Italian'].map(cuisine => (
                    <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={filters.cuisine.includes(cuisine)} onChange={(e) => {
                        if (e.target.checked) setFilters({...filters, cuisine: [...filters.cuisine, cuisine]});
                        else setFilters({...filters, cuisine: filters.cuisine.filter(c => c !== cuisine)});
                      }} className="accent-emerald-500" />
                      <span className="text-sm">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Special</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.leftover} onChange={(e) => setFilters({...filters, leftover: e.target.checked})} className="accent-emerald-500" />
                  <span className="text-sm">♻️ Uses Leftovers</span>
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0" role="region" aria-label="Recipe results">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1" tabIndex={0}>Recipe Results</h2>
                  <p className={cardText}>Found {filteredRecipes.length} delicious recipes for you!</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${inputBg} border px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500`} aria-label="Sort recipes">
                    <option value="relevant">Most Relevant</option>
                    <option value="time">Quickest First</option>
                    <option value="cost">Cheapest First</option>
                  </select>
                  
                  <div className={`${cardBg} border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-lg p-1 flex gap-1`} role="group" aria-label="View mode toggle">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-700/50'} transition-colors`} aria-label="Grid view" aria-pressed={viewMode === 'grid'}>
                      <Grid3x3 size={18} aria-hidden />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-700/50'} transition-colors`} aria-label="List view" aria-pressed={viewMode === 'list'}>
                      <List size={18} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recipe Grid (modular) */}
              {loading ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                  ))}
                </div>
              ) : (
                <RecipeGrid recipes={paginatedRecipes} viewMode={viewMode} />
              )}

              {/* Load More Button */}
              {paginatedRecipes.length < filteredRecipes.length && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                    onClick={() => setPage(page + 1)}
                    aria-label="Load more recipes"
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* Empty State */}
              {filteredRecipes.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-bold mb-2">No recipes found</h3>
                  <p className={cardText}>Try adjusting your filters or adding more ingredients</p>
                  <button onClick={() => setFilters({ time: 60, budget: 'all', cuisine: [], difficulty: [], leftover: false, dietary: [] })} className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}