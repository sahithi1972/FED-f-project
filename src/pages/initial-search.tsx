import React from 'react';
import { useLocation } from 'react-router-dom';
import { RecipeSearchFilter, SearchFilters } from '../components/RecipeSearchFilter';
import { Navigate } from 'react-router-dom';

export default function InitialSearch() {
  const location = useLocation();
  const initialIngredients = location.state?.ingredients || [];
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setHasSubmitted(true);
  };

  // After form submission, navigate to recipes page with all filters
  if (hasSubmitted && searchFilters) {
    return (
      <Navigate
        to="/recipes"
        state={{ 
          filters: searchFilters,
          fromInitialSearch: true 
        }}
        replace
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <RecipeSearchFilter
          open={true}
          onOpenChange={() => {}} // Prevent closing
          initialIngredients={initialIngredients}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
}