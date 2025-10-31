import { Recipe } from '@/types/recipe';

export const dummyRecipes: Recipe[] = [
  {
    id: "1",
    title: "Spicy Tomato Rice",
    description: "A flavorful one-pot rice dish with fresh tomatoes and aromatic spices",
    imageUrl: "https://source.unsplash.com/random?tomato-rice",
    cookingTime: 30,
    difficulty: "easy",
    rating: 4.5,
    cuisine: "Indian",
    dietary: ["vegetarian"],
    trending: true,
    tags: ["One-Pot", "Spicy", "Quick"],
    ingredients: ["Rice", "Tomatoes", "Onion", "Garlic", "Spices"],
    instructions: [
      "Sauté onions and garlic",
      "Add tomatoes and spices",
      "Cook rice with the mixture"
    ],
    nutrition: {
      calories: 350,
      protein: 8
    },
    seasonal: true,
    onePot: true,
    isFavorite: false
  },
  {
    id: "2",
    title: "Crispy Fried Rice",
    description: "Quick and easy fried rice with vegetables and eggs",
    imageUrl: "https://source.unsplash.com/random?fried-rice",
    cookingTime: 15,
    difficulty: "easy",
    rating: 4.2,
    cuisine: "Asian",
    dietary: ["vegetarian"],
    tags: ["Quick", "One-Pan", "Leftover-Friendly"],
    ingredients: ["Rice", "Vegetables", "Eggs", "Soy Sauce", "Oil"],
    instructions: [
      "Heat oil in a wok",
      "Stir fry vegetables",
      "Add rice and seasonings",
      "Make a well and scramble eggs"
    ],
    nutrition: {
      calories: 380,
      protein: 10
    },
    usesLeftovers: true,
    onePot: true,
    isFavorite: false
  },
  {
    id: "3",
    title: "Aromatic Vegetable Curry",
    description: "Rich and flavorful curry loaded with fresh vegetables",
    imageUrl: "https://source.unsplash.com/random?vegetable-curry",
    cookingTime: 35,
    difficulty: "medium",
    rating: 4.7,
    cuisine: "Indian",
    dietary: ["vegan", "gluten-free"],
    tags: ["Curry", "Healthy", "Spicy"],
    ingredients: ["Mixed Vegetables", "Coconut Milk", "Curry Paste", "Rice"],
    instructions: [
      "Prepare curry paste",
      "Cook vegetables until tender",
      "Add coconut milk and simmer",
      "Serve with rice"
    ],
    nutrition: {
      calories: 320,
      protein: 7
    },
    seasonal: true,
    isFavorite: false
  },
  {
    id: "4",
    title: "Quick Stir-Fry Noodles",
    description: "Classic Asian stir-fry noodles with crispy vegetables",
    imageUrl: "https://source.unsplash.com/random?stir-fry-noodles",
    cookingTime: 20,
    difficulty: "easy",
    rating: 4.3,
    cuisine: "Asian",
    dietary: ["vegetarian"],
    trending: true,
    tags: ["Quick", "Stir-Fry", "Weeknight"],
    ingredients: ["Noodles", "Mixed Vegetables", "Soy Sauce", "Garlic"],
    instructions: [
      "Cook noodles al dente",
      "Stir fry vegetables",
      "Add noodles and sauce",
      "Toss until well combined"
    ],
    nutrition: {
      calories: 400,
      protein: 12
    },
    onePot: true,
    isFavorite: false
  },
  {
    id: "5",
    title: "Mediterranean Salad",
    description: "Fresh and light Mediterranean salad with feta cheese and olives",
    imageUrl: "/images/recipes/mediterranean-salad.jpg",
    cookingTime: 10,
    difficulty: "easy",
    rating: 4.6,
    cuisine: "Mediterranean",
    dietary: ["vegetarian", "gluten-free"],
    tags: ["Fresh", "Quick", "Light"],
    ingredients: ["Mixed Greens", "Feta Cheese", "Olives", "Tomatoes", "Cucumber"],
    instructions: [
      "Wash and chop vegetables",
      "Combine in a bowl",
      "Add dressing and toss",
      "Garnish with feta"
    ],
    nutrition: {
      calories: 250,
      protein: 8
    },
    seasonal: true,
    isFavorite: false
  }
];