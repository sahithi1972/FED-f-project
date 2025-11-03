import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RecipeCard } from '../components/RecipeCard';
import { WeatherService, WeatherData } from '../services/weatherService';
import { RecipeSearchFilter, SearchFilters } from '../components/RecipeSearchFilter';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { VoiceInput } from '../components/VoiceInput';
import { UploadRecipeDialog } from '../components/RecipeDiscovery/components/UploadRecipeDialog';
import { Recipe } from '@/types/recipe';
import { dummyRecipes } from '../data/dummy-recipes';

// Filter tabs with categories
const filterTabs = [
  { id: 'most-relevant', label: '🎯 Most Relevant' },
  { id: 'trending', label: '📈 Trending Now' },
  { id: 'quick', label: '⚡ Quick & Easy' },
  { id: 'one-pot', label: '🍲 One-Pot Meals' },
  { id: 'healthy', label: '🥗 Healthy Choices' },
  { id: 'budget', label: '💰 Budget Friendly' },
  { id: 'comfort', label: '🤗 Comfort Food' },
  { id: 'seasonal', label: '🌞 Seasonal Picks' }
];

const Recipes = () => {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weatherSuggestions, setWeatherSuggestions] = useState<Recipe[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('most-relevant');
  const [showFilter, setShowFilter] = useState(false);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    ingredients: [],
    dietary: [],
    cuisine: [],
    healthRestrictions: [],
    cookingTime: 60,
    servings: 4,
    mealType: '',
    difficulty: 'medium'
  });

  // Filter recipes based on search criteria
  const getFilteredRecipes = () => {
    let filtered = dummyRecipes.map(recipe => ({
      ...recipe,
      matchScore: 1,
      wasteReductionTips: [],
      isPerfectForYou: false,
      uri: '',
      score: 1,
      shareAs: '',
      yield: recipe.servings || 4,
      dietLabels: [],
      healthLabels: recipe.tags || [],
      cautions: [],
      ingredientLines: recipe.ingredients || [],
      calories: 0,
      glycemicIndex: 0,
      totalTime: recipe.cookingTime || 0,
      cuisineType: [],
      mealType: [],
      dishType: [],
      instructions: [],
      tags: recipe.tags || [],
      tips: [],
      source: '',
      url: '',
      servings: recipe.servings || 4,
      ingredients: recipe.ingredients || []
    }));

    // Apply tag filters
    if (selectedTag !== 'most-relevant') {
      switch (selectedTag) {
        case 'trending':
          filtered = filtered.filter(recipe => recipe.trending);
          break;
        case 'quick':
          filtered = filtered.filter(recipe => recipe.cookingTime <= 30);
          break;
        case 'one-pot':
          filtered = filtered.filter(recipe => recipe.onePot);
          break;
        case 'healthy':
          filtered = filtered.filter(recipe => recipe.healthLabels.includes('Healthy'));
          break;
        case 'budget':
          filtered = filtered.filter(recipe => recipe.tags.includes('Budget'));
          break;
        case 'comfort':
          filtered = filtered.filter(recipe => recipe.tags.includes('Comfort'));
          break;
        case 'seasonal':
          filtered = filtered.filter(recipe => recipe.seasonal);
          break;
      }
    }

    // Apply text search if provided
    if (searchInput.trim()) {
      const searchTerms = searchInput.toLowerCase().split(/\s+/);
      filtered = filtered.filter(recipe => {
        const searchableText = `${recipe.title} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Apply ingredient filters
    if (filters.ingredients.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.ingredients.every(ingredient =>
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      );
    }

    return filtered.slice(0, 30); // Return up to 30 recipes
  };

  // Update recipes when filters change
  useEffect(() => {
    setRecipes(getFilteredRecipes());
  }, [selectedTag, searchInput, filters.ingredients]);

  // Load weather and initial recipes
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weatherData = await WeatherService.getCurrentWeather();
        setWeather(weatherData);

        // Set weather-appropriate recipes
        const weatherBasedRecipes = getFilteredRecipes().filter(recipe => {
          if (weatherData.temperature > 25) {
            return recipe.tags.includes('Cold') || recipe.tags.includes('Fresh');
          }
          if (weatherData.temperature < 15) {
            return recipe.tags.includes('Hot') || recipe.tags.includes('Comfort');
          }
          return recipe.seasonal;
        }).slice(0, 5);

        setWeatherSuggestions(weatherBasedRecipes);
      } catch (error) {
        console.error('Failed to load weather:', error);
      }
    };

    loadWeather();
    setRecipes(getFilteredRecipes());
  }, []);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSearchInput(transcript.trim());
  };

  return (
    <div className="min-h-screen bg-background recipes-page">
      <style>{`.recipes-page .bg-secondary{background-color:#0ea5a3 !important;color:#fff !important}.recipes-page .bg-primary{background-color:#10b981 !important}.recipes-page .card:hover{transform:translateY(-6px)}.recipes-page .view-recipe-btn{animation:none}`}</style>
      <div className="container mx-auto px-4 py-8">
        <style>{`
          /* hide horizontal scrollbar for weather scroll container */
          .recipes-page .weather-scroll::-webkit-scrollbar { display: none; }
          .recipes-page .weather-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          /* ensure consistent look for cards in the weather strip */
          .recipes-page .weather-strip-card img { object-fit: cover; }
        `}</style>
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Discover Recipes</h1>
            <p className="text-gray-500">Find perfect recipes based on your ingredients and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowFilter(true)} className="bg-transparent hover:bg-green-700/10">
              Refine Search
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Recipe
            </Button>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              ← Back Home
            </Button>
          </div>
        </div>

        {/* Quick Search + Voice Input (full width) */}
        <div className="mb-8">
          <div className="bg-card/60 border rounded-lg p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Search</h3>

              <div className="flex gap-3 items-center">
                <Input
                  type="text"
                  placeholder="Say ingredients like 'tomatoes chicken rice'..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />

                <Button
                  variant={showVoicePanel ? 'default' : 'outline'}
                  onClick={() => setShowVoicePanel(v => !v)}
                  className="flex items-center gap-2"
                >
                  {showVoicePanel ? 'Hide Voice' : 'Voice'}
                </Button>

                <Button onClick={() => setShowFilter(true)} className="ml-1">
                  Refine
                </Button>
              </div>

              <AnimatePresence>
                {showVoicePanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="p-4 rounded-lg bg-[#06120f] border border-emerald-900 shadow-sm">
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <p className="text-emerald-200 text-sm mb-2">Try saying:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              "tomatoes onions chicken",
                              "vegetarian pasta recipes",
                              "quick dinner with rice",
                              "one-pot meals",
                              "budget friendly dinner"
                            ].map((s) => (
                              <button
                                key={s}
                                onClick={() => { setSearchInput(s); setShowVoicePanel(false); }}
                                className="text-emerald-300 text-sm text-left px-3 py-2 rounded-md hover:bg-emerald-900/30 transition"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="w-64">
                          <VoiceInput onTranscript={handleVoiceTranscript} theme="dark" compact />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Weather-based Suggestions (full width) */}
        {weather && weatherSuggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
            <div className="flex items-center mb-4">
              <Sun className="inline-block mr-2" />
              <h3 className="text-xl font-semibold">Weather-based Suggestions ({weather.temperature}°C, {weather.condition})</h3>
            </div>
            {/* Horizontal scroll; hide scrollbar via weather-scroll class */}
            <div className="overflow-x-auto weather-scroll">
              <div className="flex gap-6 w-max items-stretch">
                {weatherSuggestions.map((recipe) => (
                  <motion.div key={recipe.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="min-w-[260px] h-[420px] flex-shrink-0 flex">
                    {/* Make the RecipeCard stretch to full height */}
                    <div className="flex-1 flex flex-col">
                      <RecipeCard className="h-full flex flex-col" recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tags (centered row) */}
        <div className="flex flex-wrap gap-3 justify-start mb-8">
          {filterTabs.map((tab) => (
            <Badge
              key={tab.id}
              variant={selectedTag === tab.id ? 'default' : 'outline'}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center gap-2 ${selectedTag === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-transparent border border-transparent text-emerald-300 hover:bg-emerald-900/30'}`}
              onClick={() => setSelectedTag(tab.id)}
            >
              <span className="leading-4">{tab.label}</span>
            </Badge>
          ))}
        </div>

        {/* Recipe Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedTag === 'most-relevant' ? 'All Recipes' : `${filterTabs.find(tab => tab.id === selectedTag)?.label} Recipes`}
          </h2>
          {recipes.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <motion.div key={recipe.id} whileHover={{ translateY: -6, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }} transition={{ type: 'spring', stiffness: 300 }}>
                  <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No recipes found. Try adjusting your filters or search terms.</p>
              <Button onClick={() => {
                setSelectedTag('most-relevant');
                setSearchInput('');
                setFilters({
                  ingredients: [],
                  dietary: [],
                  cuisine: [],
                  healthRestrictions: [],
                  cookingTime: 60,
                  servings: 4,
                  mealType: '',
                  difficulty: 'medium'
                });
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Modals */}
        <RecipeSearchFilter
          open={showFilter}
          onOpenChange={setShowFilter}
          onSearch={handleSearch}
          initialIngredients={filters.ingredients}
        />
        <UploadRecipeDialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} />
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe as any}
            open={!!selectedRecipe}
            onOpenChange={(open) => !open && setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Recipes;