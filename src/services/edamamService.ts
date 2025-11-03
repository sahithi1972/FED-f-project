// Enhanced Edamam Service with Smart Filtering
export interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: {
    text: string;
    quantity: number;
    measure: string;
    food: string;
    weight: number;
    foodCategory: string;
    foodId: string;
    image: string;
  }[];
  calories: number;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: any;
}

export interface SmartRecipe extends EdamamRecipe {
  matchScore: number;
  difficulty: string;
  wasteReductionTips: string[];
  isPerfectForYou: boolean;
}

interface RecipeSearchFilters {
  query?: string;
  ingredients: string[];
  dietary?: string[];
  cuisine?: string[];
  healthRestrictions?: string[];
  cookingTime?: number;
  mealType?: string;
  difficulty?: string;
}

export class EdamamService {
  private appId: string;
  private appKey: string;
  private baseUrl = 'https://api.edamam.com/api/recipes/v2';

  constructor() {
    this.appId = import.meta.env.VITE_EDAMAM_APP_ID;
    this.appKey = import.meta.env.VITE_EDAMAM_APP_KEY;
  }

  private buildQueryParams(filters: RecipeSearchFilters): string {
    const params = new URLSearchParams({
      type: 'public',
      app_id: this.appId,
      app_key: this.appKey,
      random: 'true',
      'imageSize': 'LARGE',
      'field': 'uri,label,image,source,url,yield,dietLabels,healthLabels,cautions,ingredientLines,ingredients,calories,totalWeight,totalTime,cuisineType,mealType,dishType'
    });

    // 🚀 IMPROVED: Better ingredient search
    if (filters.ingredients.length > 0) {
      const cleanIngredients = filters.ingredients
        .map(i => i.trim())
        .filter(i => i.length > 0);

      if (cleanIngredients.length > 0) {
        const allIngredients = cleanIngredients.join(' OR ');
        params.append('q', allIngredients);
        params.append('ingr', '1-20'); // More flexible ingredient count
      }
    }

    // Get more results
    params.append('from', '0');
    params.append('to', '30'); // Get 30 recipes per category

    return params.toString();
  }

  private generateMockRecipesByCategory(category: string): SmartRecipe[] {
    const categories = {
      trending: ['Popular', 'Trending', 'Featured'],
      quick: ['Quick', 'Easy', 'Fast'],
      healthy: ['Healthy', 'Light', 'Nutritious'],
      comfort: ['Comfort', 'Hearty', 'Home-style'],
      seasonal: ['Seasonal', 'Fresh', 'Local'],
      budget: ['Budget', 'Economic', 'Simple'],
      onepot: ['One-Pot', 'Easy Cleanup', 'Simple']
    };

    const prefixes = categories[category as keyof typeof categories] || ['Custom'];

    return Array(30).fill(0).map((_, i) => ({
      uri: `mock_${category}_${i}`,
      label: `${prefixes[i % prefixes.length]} ${category.charAt(0).toUpperCase() + category.slice(1)} Recipe ${i + 1}`,
      image: `https://source.unsplash.com/800x600/?${category},food&${i}`,
      source: 'ZeroWasteChef',
      url: '#',
      yield: Math.floor(Math.random() * 4) + 2,
      dietLabels: ['Balanced'],
      healthLabels: ['Vegetarian'],
      cautions: [],
      ingredientLines: [
        'onions',
        'potatoes',
        'tomatoes',
        'garlic',
        'herbs and spices'
      ],
      ingredients: [],
      calories: Math.floor(Math.random() * 500) + 200,
      totalWeight: Math.floor(Math.random() * 1000) + 500,
      totalTime: Math.floor(Math.random() * 45) + 15,
      cuisineType: ['international'],
      mealType: ['lunch', 'dinner'],
      dishType: ['main course'],
      totalNutrients: {},
      matchScore: Math.floor(Math.random() * 30) + 70,
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      wasteReductionTips: ['Use vegetable scraps for stock'],
      isPerfectForYou: true
    }));
  }

  async searchRecipes(filters: RecipeSearchFilters): Promise<SmartRecipe[]> {
    try {
      // Try the API first
      const response = await fetch(`${this.baseUrl}?${this.buildQueryParams(filters)}`);
      
      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (!data.hits || data.hits.length === 0) {
        throw new Error('No results');
      }

      return data.hits.map((hit: any) => this.enhanceRecipe(hit.recipe, filters));
    } catch (error) {
      console.log('Falling back to mock data');
      // Fall back to mock data
      let mockRecipes: SmartRecipe[] = [];

      if (filters.ingredients?.length > 0) {
        // Generate ingredient-based recipes
        mockRecipes = this.generateMockRecipesByCategory('custom').map(recipe => ({
          ...recipe,
          label: `${filters.ingredients.join(' & ')} ${recipe.label}`,
          ingredientLines: [...filters.ingredients, ...recipe.ingredientLines],
          matchScore: 90 // Higher score for ingredient matches
        }));
      } else {
        // Generate category-based recipes
        mockRecipes = this.generateMockRecipesByCategory(filters.mealType || 'trending');
      }

      return mockRecipes.map(recipe => this.enhanceRecipe(recipe, filters));
    }
  }

  private enhanceRecipe(recipe: EdamamRecipe, filters: RecipeSearchFilters): SmartRecipe {
    const smartRecipe = recipe as SmartRecipe;
    
    // Calculate match score based on ingredients
    if (filters.ingredients?.length > 0) {
      const userIngredients = filters.ingredients.map(ing => ing.toLowerCase());
      const recipeIngredients = recipe.ingredientLines.join(' ').toLowerCase();
      const matchCount = userIngredients.filter(ing => recipeIngredients.includes(ing)).length;
      smartRecipe.matchScore = Math.min(100, Math.round((matchCount / userIngredients.length) * 100));
    } else {
      smartRecipe.matchScore = Math.floor(Math.random() * 30) + 70;
    }

    // Set difficulty based on cooking time
    smartRecipe.difficulty = recipe.totalTime > 45 ? 'Hard' : recipe.totalTime > 25 ? 'Medium' : 'Easy';

    // Add waste reduction tips
    smartRecipe.wasteReductionTips = this.generateWasteTips(recipe);

    // Determine if perfect match
    smartRecipe.isPerfectForYou = smartRecipe.matchScore > 80;

    return smartRecipe;
  }

  private generateWasteTips(recipe: EdamamRecipe): string[] {
    const tips: string[] = [];
    const ingredients = recipe.ingredients.map(i => i.food?.toLowerCase() || '');

    if (ingredients.includes('tomato')) {
      tips.push('Use overripe tomatoes for sauce or soup');
    }
    if (ingredients.includes('potato')) {
      tips.push('Save potato peels for crispy snacks');
    }
    if (ingredients.includes('onion')) {
      tips.push('Use onion skins in stock for extra flavor');
    }
    if (tips.length === 0) {
      tips.push('Save vegetable scraps for homemade stock');
    }

    return tips;
  }
}