import { QuickFilter } from './types';

const getTimeBasedTrending = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Breakfast trending now";
  if (hour >= 11 && hour < 15) return "Lunch favorites";
  if (hour >= 15 && hour < 18) return "Tea-time snacks";
  if (hour >= 18 && hour < 22) return "Dinner trending now";
  return "Late night specials";
};

export const filterDescriptions: Record<string, string> = {
  relevant: "Recipes that best match your preferences and pantry",
  fast: "Quick recipes that take less than 30 minutes",
  budget: "Affordable recipes with common ingredients",
  leftover: "Creative ways to use yesterday's food",
  vegetarian: "Delicious meat-free recipes",
  quick20: "Super quick recipes ready in 20 minutes",
  onepot: "Minimal cleanup with one-pot cooking",
  seasonal: "Recipes using in-season ingredients",
  trending: getTimeBasedTrending(),
  easy: "Simple recipes with basic cooking skills"
};

export const quickFilters: QuickFilter[] = [
  { 
    id: 'relevant', 
    label: 'Most Relevant', 
    icon: '🎯', 
    default: true,
    tooltip: filterDescriptions.relevant
  },
  { 
    id: 'fast', 
    label: 'Fast Cooking', 
    icon: '⚡', 
    timeFilter: 30,
    tooltip: filterDescriptions.fast
  },
  { 
    id: 'budget', 
    label: 'Budget-Friendly', 
    icon: '�', 
    costFilter: 50,
    tooltip: filterDescriptions.budget
  },
  { 
    id: 'leftover', 
    label: 'Uses Leftovers', 
    icon: '♻️', 
    special: true,
    tooltip: filterDescriptions.leftover
  },
  { 
    id: 'vegetarian', 
    label: 'Vegetarian', 
    icon: '�', 
    dietary: true,
    tooltip: filterDescriptions.vegetarian
  },
  { 
    id: 'quick20', 
    label: 'Under 20 mins', 
    icon: '🕒', 
    timeFilter: 20,
    tooltip: filterDescriptions.quick20
  },
  { 
    id: 'onepot', 
    label: 'One-Pot Meals', 
    icon: '🥘', 
    special: true,
    tooltip: filterDescriptions.onepot
  },
  { 
    id: 'seasonal', 
    label: 'Seasonal', 
    icon: '�', 
    special: true,
    tooltip: filterDescriptions.seasonal
  },
  { 
    id: 'trending', 
    label: 'Trending Now', 
    icon: '🔥', 
    sort: 'trending',
    tooltip: filterDescriptions.trending,
    dynamic: true
  },
  { 
    id: 'easy', 
    label: 'Easy Recipes', 
    icon: '�', 
    difficulty: 'easy',
    tooltip: filterDescriptions.easy
  }
];