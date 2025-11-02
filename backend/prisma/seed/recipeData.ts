import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/auth';

const prisma = new PrismaClient();


type SampleRecipe = {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  mainImage: string;
  ingredients: Array<{ name: string; quantity: number; unit: string; wastageReduction: number }>;
  steps: Array<{ order: number; description: string }>;
  tags: string[];
};
type IngredientCategory = { name: string; description: string; icon: string };
type CommonIngredient = { name: string; category: string; shelfLifeDays: number; perishability: string };
type IngredientSubstitution = { original: string; substitute: string; confidence: number };

const sampleRecipes: SampleRecipe[] = [
  // ... (keep the full sampleRecipes array from previous content)
];
const ingredientCategories: IngredientCategory[] = [
  // ... (keep the full ingredientCategories array from previous content)
];
const commonIngredients: CommonIngredient[] = [
  // ... (keep the full commonIngredients array from previous content)
];
const ingredientSubstitutions: IngredientSubstitution[] = [
  // ... (keep the full ingredientSubstitutions array from previous content)
];

export async function seedRecipeData() {
  console.log('🌱 Seeding recipe data...');
  try {
    // Create categories
    const categoryMap = new Map();
    console.log('Creating ingredient categories...');
    for (const catData of ingredientCategories) {
      const category = await prisma.ingredientCategory.upsert({
        where: { name: catData.name },
        update: {},
        create: catData,
      });
      categoryMap.set(catData.name, category.id);
    }
    console.log(`✅ Created ${ingredientCategories.length} ingredient categories`);

    // Create ingredients
    const ingredientMap = new Map();
    console.log('Creating ingredients...');
    for (const ingData of commonIngredients) {
      const categoryId = categoryMap.get(ingData.category);
      if (!categoryId) {
        console.warn(`⚠️ Category not found for ingredient: ${ingData.name}`);
        continue;
      }
      const ingredient = await prisma.ingredient.upsert({
        where: { name: ingData.name },
        update: {},
        create: {
          name: ingData.name,
          categoryId,
          shelfLifeDays: ingData.shelfLifeDays,
          perishability: ingData.perishability as any, // Cast to enum type
          commonUnits: ['pieces', 'cups', 'tbsp', 'tsp', 'cloves', 'slices', 'bunch', 'stalks'],
        },
      });
      ingredientMap.set(ingData.name, ingredient.id);
    }
    console.log(`✅ Created ${ingredientMap.size} ingredients`);

    // Create substitution relationships
    console.log('Creating ingredient substitutions...');
    let substitutionCount = 0;
    for (const subData of ingredientSubstitutions) {
      const originalId = ingredientMap.get(subData.original);
      const substituteId = ingredientMap.get(subData.substitute);
      if (originalId && substituteId) {
        try {
          await prisma.ingredientSubstitution.upsert({
            where: {
              originalId_substituteId: {
                originalId,
                substituteId,
              },
            },
            update: { confidence: subData.confidence },
            create: {
              originalId,
              substituteId,
              confidence: subData.confidence,
              notes: `Good substitution for ${subData.original}`,
            },
          });
          substitutionCount++;
        } catch (error) {
          console.warn(`⚠️ Failed to create substitution: ${subData.original} -> ${subData.substitute}`);
        }
      } else {
        console.warn(`⚠️ Missing ingredients for substitution: ${subData.original} -> ${subData.substitute}`);
      }
    }

  // Create sample users if they don't exist
  const hashedPassword = await hashPassword('password123');
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'chef@wastechef.com' },
      update: {},
      create: {
        email: 'chef@wastechef.com',
        password: hashedPassword,
        name: 'Master Chef',
        dietaryPreferences: ['vegetarian', 'gluten-free'],
        cuisinePreferences: ['italian', 'mexican'],
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Test User',
        dietaryPreferences: ['vegan'],
        cuisinePreferences: ['asian', 'mediterranean'],
      },
    }),
  ]);

  // Create recipes

  for (const recipeData of sampleRecipes) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    if (!randomUser || !randomUser.id) {
      console.warn('⚠️ No valid user found for recipe creation');
      continue;
    }
    await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        cookingTime: recipeData.cookingTime,
        difficulty: recipeData.difficulty as any,
        servings: recipeData.servings,
        mainImage: recipeData.mainImage,
        status: 'PUBLISHED',
        userId: randomUser.id,
        ingredients: {
          create: recipeData.ingredients.map((ing: { name: string; quantity: number; unit: string; wastageReduction: number }) => {
            const ingredientId = ingredientMap.get(ing.name);
            if (!ingredientId) {
              throw new Error(`Ingredient ${ing.name} not found in ingredient map`);
            }
            return {
              ingredientId,
              quantity: ing.quantity,
              unit: ing.unit,
              wastageReduction: ing.wastageReduction,
            };
          }),
        },
        steps: {
          create: recipeData.steps.map((step: { order: number; description: string }, index: number) => ({
            order: step.order || index + 1,
            description: step.description,
          })),
        },
      },
    });

    // Handle tags for each recipe
    for (const tagName of recipeData.tags) {
      let tag = await prisma.tag.findUnique({
        where: { name: tagName.toLowerCase() },
      });
      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: tagName.toLowerCase() },
        });
      }
    }
  }

  console.log('✅ Recipe data seeded successfully!');
  } catch (error) {
    console.error('❌ Error during recipe data seeding:', error);
    throw error;
  }
}