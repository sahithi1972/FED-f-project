import React, { useCallback, useRef, useState } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes?: Recipe[];
  viewMode: 'grid' | 'list' | 'compact';
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function RecipeGrid({ recipes = [], viewMode, loading, hasMore, onLoadMore }: RecipeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState<number>(-1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const numCols = viewMode === 'list' ? 1 : viewMode === 'compact' ? 4 : 3;
    const numItems = recipes.length;

    switch (e.key) {
      case 'ArrowRight':
        setFocusIndex(prev => Math.min(prev + 1, numItems - 1));
        break;
      case 'ArrowLeft':
        setFocusIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        setFocusIndex(prev => Math.min(prev + numCols, numItems - 1));
        break;
      case 'ArrowUp':
        setFocusIndex(prev => Math.max(prev - numCols, 0));
        break;
      case 'Home':
        setFocusIndex(0);
        break;
      case 'End':
        setFocusIndex(numItems - 1);
        break;
    }
  }, [recipes.length, viewMode]);
  const recipeCount = recipes.length;

  // Show loading state
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold animate-pulse bg-muted rounded w-40 h-8"></h2>
          <p className="text-muted-foreground animate-pulse bg-muted rounded w-32 h-6"></p>
        </div>
        <div className={`
          grid gap-6
          ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
          ${viewMode === 'list' ? 'grid-cols-1' : ''}
          ${viewMode === 'compact' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
        `}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (recipeCount === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😔</div>
        <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search terms
        </p>
        <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-600 transition-colors">
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Recipes</h2>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">{recipeCount} recipes available</p>
          {loading && (
            <div role="status" className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-r-transparent rounded-full animate-spin" />
              <span className="sr-only">Loading recipes...</span>
            </div>
          )}
        </div>
      </div>
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {loading ? 'Loading recipes...' : `${recipeCount} recipes displayed`}
      </div>
      <div 
        ref={gridRef}
        role="grid"
        aria-label="Recipe grid"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        className={`
          grid gap-6
          ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
          ${viewMode === 'list' ? 'grid-cols-1' : ''}
          ${viewMode === 'compact' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
        `}
      >
        {recipes.map((recipe, index) => (
          <div 
            key={recipe.id}
            role="gridcell"
            tabIndex={focusIndex === index ? 0 : -1}
            ref={el => {
              if (focusIndex === index && el) {
                el.focus();
              }
            }}
          >
            <RecipeCard 
              recipe={recipe} 
              viewMode={viewMode}
              onClick={recipe => {
                // Handle recipe click
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => onLoadMore?.()}
          disabled={!hasMore || loading}
          className={`
            px-6 py-3 rounded-lg border-2 transition-all duration-200
            ${loading 
              ? 'border-muted bg-muted cursor-not-allowed' 
              : hasMore 
                ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                : 'border-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
              Loading...
            </span>
          ) : hasMore ? (
            'Load More Recipes'
          ) : (
            'No More Recipes'
          )}
        </button>
      </div>
    </div>
  );
}