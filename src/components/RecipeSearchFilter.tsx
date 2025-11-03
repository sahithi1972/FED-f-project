import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Plus, Minus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface RecipeSearchFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIngredients: string[];
  onSearch: (filters: SearchFilters) => void;
  isWizard?: boolean;
}

export interface SearchFilters {
  ingredients: string[];
  dietary: string[];
  healthRestrictions: string[];
  customHealthCondition?: string;
  cuisine: string[];
  mealType: string;
  servings: number;
  cookingTime: number;
  difficulty: string;
}

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Low-Carb', 'Keto', 'Paleo', 'Mediterranean'
];

const cuisineOptions = [
  'Italian', 'Mexican', 'Chinese', 'Indian', 'Thai', 'Japanese',
  'Mediterranean', 'American', 'French', 'Korean', 'Vietnamese'
];

const healthOptions = [
  'Sugar-Conscious',
  'Low-Sodium', 
  'Low-Fat',
  'Gluten-Free',
  'Dairy-Free',
  'Peanut-Free',
  'Tree-Nut-Free',
  'Shellfish-Free',
  'Alcohol-Free',
  'Kidney-Friendly',
  'Other'
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const difficultyOptions = ['Easy', 'Medium', 'Hard'];

export const RecipeSearchFilter: React.FC<RecipeSearchFilterProps> = ({
  open,
  onOpenChange,
  initialIngredients,
  onSearch,
  isWizard = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    ingredients: initialIngredients,
    dietary: [],
    cuisine: [],
    healthRestrictions: [],
    customHealthCondition: '',
    mealType: '',
    servings: 2,
    cookingTime: 30,
    difficulty: '',
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [activeSection, setActiveSection] = useState('ingredients');

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ingredients: initialIngredients
    }));
  }, [initialIngredients]);

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !filters.ingredients.includes(newIngredient.trim().toLowerCase())) {
      setFilters(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim().toLowerCase()]
      }));
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient)
    }));
  };

  const handleArrayToggle = (field: 'dietary' | 'cuisine' | 'healthRestrictions', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    onOpenChange(false);
  };

  const clearFilters = () => {
    setFilters({
      ingredients: [],
      dietary: [],
      cuisine: [],
      healthRestrictions: [],
      customHealthCondition: '',
      mealType: '',
      servings: 2,
      cookingTime: 30,
      difficulty: '',
    });
    setNewIngredient('');
  };

  const FilterButton = ({ section, label, icon }: { section: string; label: string; icon: string }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveSection(section)}
      className={cn(
        "w-full p-4 rounded-xl transition-all flex items-center gap-3 text-lg font-medium",
        activeSection === section 
          ? "bg-green-500 text-white shadow-lg" 
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      )}
    >
      <span className="text-2xl">{icon}</span>
      {label}
      <ChevronRight className={cn(
        "ml-auto w-5 h-5 transition-transform",
        activeSection === section ? "rotate-90" : ""
      )} />
    </motion.button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-[100vh] max-w-none m-0 p-0 bg-gray-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DialogHeader className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DialogTitle className="text-4xl font-bold text-white mb-4 flex items-center gap-4">
                  <span className="text-5xl">🍳</span> Craft Your Perfect Recipe Search
                </DialogTitle>
                <p className="text-gray-400 text-xl">
                  Customize your culinary journey with ingredients and preferences
                </p>
              </motion.div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar - Navigation */}
              <div className="lg:col-span-3 space-y-3">
                <FilterButton section="ingredients" label="Ingredients" icon="🥕" />
                <FilterButton section="dietary" label="Dietary" icon="🥗" />
                <FilterButton section="cuisine" label="Cuisine" icon="🌍" />
                <FilterButton section="health" label="Health" icon="❤️" />
                <FilterButton section="preferences" label="Preferences" icon="⚙️" />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9">
                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {activeSection === 'ingredients' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white mb-6">🥕 Available Ingredients</h3>
                          <div className="flex gap-2 mb-4">
                            <Input
                              value={newIngredient}
                              onChange={(e) => setNewIngredient(e.target.value)}
                              placeholder="Add an ingredient (e.g., tomatoes, chicken, rice)..."
                              onKeyPress={handleKeyPress}
                              className="flex-1 h-12 text-lg bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            />
                            <Button 
                              onClick={handleAddIngredient} 
                              className="h-12 px-6 bg-green-500 hover:bg-green-600"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 min-h-12">
                            {filters.ingredients.map(ingredient => (
                              <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                key={ingredient}
                                className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                              >
                                {ingredient}
                                <button
                                  onClick={() => handleRemoveIngredient(ingredient)}
                                  className="text-green-300 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeSection === 'dietary' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white mb-6">🥗 Dietary Preferences</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dietaryOptions.map(option => (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={option}
                                onClick={() => handleArrayToggle('dietary', option)}
                                className={cn(
                                  "p-4 rounded-xl text-left transition-all",
                                  filters.dietary.includes(option)
                                    ? "bg-green-500 text-white shadow-lg"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                )}
                              >
                                {option}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeSection === 'cuisine' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white mb-6">🌍 Cuisine Types</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {cuisineOptions.map(option => (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={option}
                                onClick={() => handleArrayToggle('cuisine', option)}
                                className={cn(
                                  "p-4 rounded-xl text-left transition-all",
                                  filters.cuisine.includes(option)
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                )}
                              >
                                {option}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeSection === 'health' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white mb-6">❤️ Health Considerations</h3>
                          
                          {/* Standard Health Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {healthOptions.map((option) => (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={option}
                                onClick={() => {
                                  if (option === 'Other') {
                                    setFilters(prev => ({
                                      ...prev,
                                      customHealthCondition: '',
                                    }));
                                  } else {
                                    handleArrayToggle('healthRestrictions', option);
                                  }
                                }}
                                className={cn(
                                  "p-4 rounded-xl text-left transition-all",
                                  filters.healthRestrictions.includes(option)
                                    ? "bg-purple-500 text-white shadow-lg"
                                    : option === 'Other' 
                                      ? "bg-yellow-500 text-white shadow-lg"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                )}
                              >
                                {option}
                              </motion.button>
                            ))}
                          </div>

                          {/* Custom Health Condition Input */}
                          {(filters.healthRestrictions.includes('Other') || filters.customHealthCondition) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3"
                            >
                              <Label className="text-lg font-semibold text-white">
                                🩺 Specify Health Condition
                              </Label>
                              <Input
                                value={filters.customHealthCondition || ''}
                                onChange={(e) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    customHealthCondition: e.target.value,
                                    healthRestrictions: e.target.value.trim() 
                                      ? prev.healthRestrictions.filter(h => h !== 'Other').concat(['Custom'])
                                      : prev.healthRestrictions
                                  }));
                                }}
                                placeholder="E.g., Pregnancy, Migraine triggers, Specific allergies..."
                                className="h-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                              />
                              <p className="text-sm text-gray-400">
                                We'll do our best to find recipes that accommodate your specific needs
                              </p>
                            </motion.div>
                          )}

                          {/* Common Medical Conditions Quick Select */}
                          <div className="border-t border-gray-600 pt-6">
                            <Label className="text-lg font-semibold text-white mb-3 block">
                              🏥 Common Conditions
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                'Diabetes Friendly',
                                'Heart Healthy', 
                                'Pregnancy Safe',
                                'Low Cholesterol',
                                'High Fiber',
                                'Low Carb'
                              ].map(condition => (
                                <button
                                  key={condition}
                                  onClick={() => {
                                    setFilters(prev => ({
                                      ...prev,
                                      customHealthCondition: condition,
                                      healthRestrictions: prev.healthRestrictions.includes('Custom') 
                                        ? prev.healthRestrictions 
                                        : [...prev.healthRestrictions, 'Custom']
                                    }));
                                  }}
                                  className="p-3 text-left rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                                >
                                  {condition}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === 'preferences' && (
                        <div className="space-y-8">
                          <h3 className="text-2xl font-bold text-white mb-6">⚙️ Cooking Preferences</h3>
                          
                          {/* Meal Type */}
                          <div className="space-y-4">
                            <Label className="text-xl font-bold text-white">
                              🕒 Meal Type
                            </Label>
                            <select
                              value={filters.mealType}
                              onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
                              className="w-full p-4 rounded-xl bg-gray-700 border-gray-600 text-white"
                            >
                              <option value="">Any meal type</option>
                              {mealTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          {/* Servings */}
                          <div className="space-y-4">
                            <Label className="text-xl font-bold text-white">
                              👥 Servings: {filters.servings} {filters.servings === 1 ? 'person' : 'people'}
                            </Label>
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={() => setFilters(prev => ({ ...prev, servings: Math.max(1, prev.servings - 1) }))}
                                className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                              >
                                <Minus className="w-5 h-5" />
                              </Button>
                              <div className="flex-1 text-center">
                                <span className="text-3xl font-bold text-white">{filters.servings}</span>
                              </div>
                              <Button
                                onClick={() => setFilters(prev => ({ ...prev, servings: prev.servings + 1 }))}
                                className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                              >
                                <Plus className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>

                          {/* Cooking Time */}
                          <div className="space-y-4">
                            <Label className="text-xl font-bold text-white">
                              ⏱️ Max Cooking Time: {filters.cookingTime} minutes
                            </Label>
                            <input
                              type="range"
                              min="10"
                              max="120"
                              step="5"
                              value={filters.cookingTime}
                              onChange={(e) => setFilters(prev => ({ ...prev, cookingTime: parseInt(e.target.value) }))}
                              className="w-full slider"
                            />
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>10 min</span>
                              <span>120 min</span>
                            </div>
                          </div>

                          {/* Difficulty */}
                          <div className="space-y-4">
                            <Label className="text-xl font-bold text-white">
                              🎯 Difficulty Level
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                              {difficultyOptions.map(diff => (
                                <Button
                                  key={diff}
                                  onClick={() => setFilters(prev => ({ ...prev, difficulty: diff }))}
                                  className={cn(
                                    "p-4 h-auto text-lg",
                                    filters.difficulty === diff
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  )}
                                >
                                  {diff}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mt-8"
            >
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex-1 py-6 text-lg font-semibold border-2 border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl"
              >
                🗑️ Clear All
              </Button>
              <Button
                onClick={handleSearch}
                disabled={filters.ingredients.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
                  text-white py-6 text-lg font-semibold rounded-xl shadow-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Find Perfect Recipes!
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};