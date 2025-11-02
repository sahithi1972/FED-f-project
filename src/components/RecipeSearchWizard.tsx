import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RecipeSearchFilter, SearchFilters } from './RecipeSearchFilter';

interface RecipeSearchWizardProps {
  initialIngredients: string[];
}

export const RecipeSearchWizard: React.FC<RecipeSearchWizardProps> = ({ initialIngredients }) => {
  const [filters, setFilters] = useState<SearchFilters | null>(null);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
  };

  // If filters are set, navigate to recipes page with all the filter data
  if (filters) {
    return (
      <Navigate 
        to="/recipes" 
        state={{ 
          filters,
          fromWizard: true // Flag to indicate coming from wizard
        }} 
        replace 
      />
    );
  }

  // Show the filter dialog as a mandatory first step
  return (
    <RecipeSearchFilter
      open={true}
      onOpenChange={() => {}} // Prevent closing
      initialIngredients={initialIngredients}
      onSearch={handleSearch}
      isWizard={true} // Flag to indicate wizard mode
    />
  );
};