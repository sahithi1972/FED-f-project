import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecipeSearchFilter, SearchFilters } from '../components/RecipeSearchFilter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { WeatherService, WeatherData } from '../services/weatherService';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  tags: string[];
  matchScore?: number;
  ingredients: string[];
}

export default function Recipes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherSuggestions, setWeatherSuggestions] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('most-relevant');

  // Show filter popup immediately when coming from home page
  useEffect(() => {
    if (location.state?.ingredients) {
      setIngredients(location.state.ingredients);
      setShowFilter(true);
      // Don't load recipes yet - wait for filter submission
      return;
    }
    // If not coming from home page, load recipes normally
    loadSampleRecipes();
  }, [location.state]);

  // Load weather data
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weatherData = await WeatherService.getCurrentWeather();
        setWeather(weatherData);
        const suggestions = WeatherService.getWeatherBasedRecipes(weatherData);
        setWeatherSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      }
    };

    loadWeather();
  }, []);

  // Load sample recipes (replace with API call)
  useEffect(() => {
    loadSampleRecipes();
  }, []);

  const loadSampleRecipes = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const sampleRecipes: Recipe[] = [
        {
          id: '1',
          title: 'Zero-Waste Vegetable Stir Fry',
          description: 'A delicious stir fry that uses commonly leftover vegetables to reduce food waste',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
          cookingTime: 20,
          difficulty: 'Easy',
          servings: 4,
          tags: ['vegetarian', 'quick', 'low-waste', 'healthy'],
          ingredients: ['bell pepper', 'carrot', 'onion', 'garlic', 'soy sauce']
        },
        {
          id: '2',
          title: 'Leftover Bread Pudding',
          description: 'Turn stale bread into a delicious dessert while reducing food waste',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
          cookingTime: 45,
          difficulty: 'Easy',
          servings: 6,
          tags: ['dessert', 'leftovers', 'comfort-food', 'sweet'],
          ingredients: ['stale bread', 'milk', 'eggs', 'sugar', 'cinnamon']
        },
        {
          id: '3',
          title: 'Root Vegetable Soup',
          description: 'Hearty soup using root vegetables that often get forgotten in the fridge',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
          cookingTime: 40,
          difficulty: 'Medium',
          servings: 4,
          tags: ['vegan', 'comfort-food', 'healthy', 'soup'],
          ingredients: ['potato', 'carrot', 'onion', 'celery', 'vegetable broth']
        },
        {
          id: '4',
          title: 'Overripe Banana Smoothie',
          description: 'Don\'t throw away those brown bananas! Make a nutritious smoothie instead',
          image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
          cookingTime: 5,
          difficulty: 'Easy',
          servings: 2,
          tags: ['breakfast', 'quick', 'healthy', 'smoothie'],
          ingredients: ['banana', 'yogurt', 'milk', 'honey', 'cinnamon']
        }
      ];
      setRecipes(sampleRecipes);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (filters: SearchFilters) => {
    setIngredients(filters.ingredients);
    // Load recipes after filter submission
    loadSampleRecipes();
    // In real app, you would make API call with filters
    console.log('Searching with filters:', filters);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    // Filter recipes based on query
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setRecipes(filtered);
  };

  const getFilteredRecipes = () => {
    let filtered = [...recipes];
    
    switch (activeFilter) {
      case 'trending':
        filtered = filtered.sort(() => Math.random() - 0.5); // Randomize for demo
        break;
      case 'quick':
        filtered = filtered.filter(recipe => recipe.cookingTime <= 30);
        break;
      case 'one-pot':
        filtered = filtered.filter(recipe => recipe.tags.includes('one-pot') || recipe.tags.includes('easy'));
        break;
      case 'most-relevant':
      default:
        // Sort by match score or keep original order
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Discover Recipes
              </h1>
              <p className="text-gray-600 text-lg">
                Find perfect recipes based on your ingredients and preferences
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFilter(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg font-semibold rounded-xl shadow-lg"
              >
                🎯 Refine Search
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 text-lg font-semibold rounded-xl hover:bg-gray-50"
              >
                ← Back Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Weather & Quick Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weather Card */}
          {weather && (
            <Card className="lg:col-span-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Current Weather</h3>
                    <p className="text-blue-100">{weather.location}</p>
                  </div>
                  <span className="text-4xl">{weather.icon}</span>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2">{weather.temperature}°C</p>
                  <p className="text-xl text-blue-100">{weather.condition}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Search & Weather Suggestions */}
          <Card className="lg:col-span-2 shadow-xl border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Search */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 Quick Search</h3>
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search recipes..."
                      className="flex-1 h-12 text-lg border-2 border-gray-200 focus:border-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch(searchQuery)}
                    />
                    <Button 
                      onClick={() => handleQuickSearch(searchQuery)}
                      className="bg-green-500 hover:bg-green-600 h-12 px-6"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Weather Suggestions */}
                {weatherSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🌤️ Perfect for this Weather</h3>
                    <div className="flex flex-wrap gap-2">
                      {weatherSuggestions.map((suggestion, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'most-relevant', label: '🔥 Most Relevant', icon: '🎯' },
            { id: 'trending', label: '📈 Trending', icon: '🚀' },
            { id: 'quick', label: '⚡ Quick & Easy', icon: '⏱️' },
            { id: 'one-pot', label: '🍲 One-Pot Meals', icon: '❤️' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        {/* Ingredients Display */}
        {ingredients.length > 0 && (
          <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
                Your Ingredients
              </h3>
              <div className="flex flex-wrap gap-3">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-green-200"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="text-gray-600 mt-4 text-lg">Finding delicious recipes for you...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredRecipes().map(recipe => (
              <Card key={recipe.id} className="shadow-lg border-0 hover-lift transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>⏱️ {recipe.cookingTime} min</span>
                      <span>👥 {recipe.servings} servings</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && getFilteredRecipes().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add more ingredients</p>
            <Button
              onClick={() => setShowFilter(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold"
            >
              Refine Search
            </Button>
          </div>
        )}
      </div>

      {/* Search Filter Modal */}
      <RecipeSearchFilter
        open={showFilter}
        onOpenChange={setShowFilter}
        initialIngredients={ingredients}
        onSearch={handleSearch}
      />
    </div>
  );
}