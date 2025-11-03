import { useState, useEffect } from 'react';
import { EdamamService, SmartRecipe } from '../services/edamamService';

const edamamService = new EdamamService();

export default function RecipeApiTest() {
  const [recipes, setRecipes] = useState<SmartRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSearch = async () => {
      try {
        setLoading(true);
        // Test search with some basic filters
        const results = await edamamService.searchRecipes({
          ingredients: ['chicken', 'rice'],
          dietary: ['Gluten-Free'],
          cuisine: ['Asian'],
          healthRestrictions: [],
          cookingTime: 30,
          mealType: 'dinner',
          difficulty: 'medium'
        });
        setRecipes(results);
        console.log('API Response:', results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    testSearch();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edamam API Test</h1>
        
        {loading && (
          <div className="text-lg">Loading recipes...</div>
        )}

        {error && (
          <div className="text-red-500 mb-4">Error: {error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.uri} 
              className="bg-card border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.label}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.label}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {recipe.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    Match: {recipe.matchScore}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Time: {recipe.totalTime} mins | Calories: {Math.round(recipe.calories)}
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Waste Reduction Tips:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {recipe.wasteReductionTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}