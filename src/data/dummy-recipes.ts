import { Recipe } from '@/types/recipe';

export const dummyRecipes: Recipe[] = Array.from({ length: 120 }, (_, index) => {
  const id = (index + 1).toString();
  const categories = ['trending', 'quick', 'onePot', 'healthy', 'budget', 'comfort', 'seasonal'];
  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean'];
  const ingredients = ['Rice', 'Pasta', 'Chicken', 'Beef', 'Fish', 'Tofu', 'Vegetables'];
  const adjectives = ['Spicy', 'Creamy', 'Fresh', 'Grilled', 'Baked', 'Stir-fried', 'Roasted'];
  const times = [15, 20, 30, 45, 60];
  
  const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
  const mainIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const cookingTime = times[Math.floor(Math.random() * times.length)];
  
  // Assign recipes to multiple categories but ensure primary category based on index
  const primaryCategoryIndex = Math.floor(index / 20); // 20 recipes per primary category
  const primaryCategory = categories[primaryCategoryIndex % categories.length];
  
  // Randomly assign secondary categories
  const isQuick = cookingTime <= 30;
  const isTrending = Math.random() > 0.7;
  const isOnePot = Math.random() > 0.7;
  const isHealthy = mainIngredient === 'Vegetables' || mainIngredient === 'Fish' || mainIngredient === 'Tofu';
  const isBudget = Math.random() > 0.7;
  const isComfort = Math.random() > 0.7;
  const isSeasonal = Math.random() > 0.7;

  return {
    id,
    title: `${adjective} ${mainIngredient} ${cuisine} Style`,
    description: `A delicious ${primaryCategory} recipe featuring ${mainIngredient.toLowerCase()}`,
    imageUrl: `https://source.unsplash.com/featured/?${mainIngredient},${cuisine},food&${id}`,
    cookingTime,
    difficulty: cookingTime <= 30 ? 'easy' : cookingTime <= 45 ? 'medium' : 'hard',
    rating: 3 + Math.random() * 2,
    cuisine,
    dietary: [mainIngredient === 'Vegetables' || mainIngredient === 'Tofu' ? 'vegetarian' : 'non-vegetarian'],
    trending: isTrending,
    tags: [
      isQuick ? 'Quick & Easy' : null,
      isOnePot ? 'One-Pot' : null,
      isHealthy ? 'Healthy' : null,
      isBudget ? 'Budget' : null,
      primaryCategory
    ].filter(Boolean),
    ingredients: [mainIngredient, ...Array(4).fill('').map(() => ingredients[Math.floor(Math.random() * ingredients.length)])],
    instructions: [
      'Prepare ingredients',
      'Cook main components',
      'Combine and season',
      'Serve hot'
    ],
    nutrition: {
      calories: 200 + Math.floor(Math.random() * 300),
      protein: 5 + Math.floor(Math.random() * 20)
    },
    seasonal: isSeasonal,
    onePot: isOnePot,
    isFavorite: false
  };
});