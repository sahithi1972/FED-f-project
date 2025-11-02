import prisma from '../config/database';

export interface RecipeRecommendation {
  recipe: any;
  matchScore: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutions: Array<{
    original: string;
    substitute: string;
    confidence: number;
  }>;
}

export class RecipeRecommendationService {
  /**
   * Find recipes based on available ingredients with smart matching
   */
  async recommendRecipes(
    availableIngredients: string[],
    filters: {
      maxCookingTime?: number;
      difficulty?: string;
      dietary?: string[];
      cuisine?: string[];
    } = {},
    limit: number = 10
  ): Promise<RecipeRecommendation[]> {
    // Normalize ingredient names
    const normalizedIngredients = availableIngredients.map(ing => ing.toLowerCase().trim());

    // Get all published recipes with their ingredients
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'PUBLISHED',
        ...(filters.maxCookingTime && { cookingTime: { lte: filters.maxCookingTime } }),
        ...(filters.difficulty && { difficulty: filters.difficulty as any }), // Cast to enum if needed
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Score and rank recipes
    const scoredRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const recommendation = await this.scoreRecipe(
          recipe,
          normalizedIngredients,
          filters
        );
        return recommendation;
      })
    );

    // Filter out very low matches and sort by score
    return scoredRecipes
      .filter(rec => rec.matchScore > 0.2) // At least 20% match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Score a single recipe against available ingredients
   */
  private async scoreRecipe(
    recipe: any,
    availableIngredients: string[],
    filters: any
  ): Promise<RecipeRecommendation> {
    // Use ingredient.ingredient.name for normalized names
    const recipeIngredients = recipe.ingredients.map((ing: any) =>
      (ing.ingredient?.name || ing.name).toLowerCase().trim()
    );

    // Find exact matches
    const matchedIngredients: string[] = recipeIngredients.filter((ing: string) =>
      availableIngredients.includes(ing)
    );

    // Find potential substitutions
    const missingIngredients: string[] = recipeIngredients.filter((ing: string) =>
      !availableIngredients.includes(ing)
    );

    const substitutions = await this.findSubstitutions(missingIngredients, availableIngredients);

    // Calculate match score
    const baseScore = matchedIngredients.length / recipeIngredients.length;

    // Bonus for recipes that use more of available ingredients
    const utilizationBonus = matchedIngredients.length / availableIngredients.length * 0.3;

    // Bonus for waste reduction potential
    const wasteReductionBonus = recipe.ingredients.length > 0
      ? recipe.ingredients.reduce(
          (sum: number, ing: any) => sum + (ing.wastageReduction || 0), 0
        ) / recipe.ingredients.length * 0.2
      : 0;

    let dietaryBonus = 0;
    if (filters.dietary && filters.dietary.length > 0) {
      // Check if recipe tags match dietary preferences
      const recipeTags = recipe.tags.map((rt: any) => rt.tag.name);
      const dietaryMatches = filters.dietary.filter((pref: string) =>
        recipeTags.includes(pref.toLowerCase())
      );
      dietaryBonus = dietaryMatches.length / filters.dietary.length * 0.3;
    }

    const totalScore = baseScore + utilizationBonus + wasteReductionBonus + dietaryBonus;

    return {
      recipe: {
        ...recipe,
        tags: recipe.tags.map((rt: any) => rt.tag),
        stats: {
          views: recipe.views,
          likes: recipe.likes,
          saves: recipe.saves,
          completions: recipe.completions,
        },
      },
      matchScore: Math.min(totalScore, 1), // Cap at 1
      matchedIngredients,
      missingIngredients: missingIngredients.filter((ing: string) =>
        !substitutions.some((sub) => sub.original === ing)
      ),
      substitutions,
    };
  }

  /**
   * Find possible substitutions for missing ingredients
   */
  private async findSubstitutions(
    missingIngredients: string[],
    availableIngredients: string[]
  ): Promise<Array<{ original: string; substitute: string; confidence: number }>> {
    const substitutions: Array<{ original: string; substitute: string; confidence: number }> = [];

    for (const missingIng of missingIngredients) {
      // Find substitution suggestions from database
      const subs = await prisma.ingredientSubstitution.findMany({
        where: {
          original: {
            name: missingIng,
          },
        },
        include: {
          substitute: true,
        },
      });

      // Check if any substitutes are available
      for (const sub of subs) {
        if (availableIngredients.includes(sub.substitute.name.toLowerCase())) {
          substitutions.push({
            original: missingIng,
            substitute: sub.substitute.name,
            confidence: sub.confidence,
          });
        }
      }
    }

    return substitutions;
  }

  /**
   * Get recipes that help reduce specific ingredients (those about to expire)
   */
  async recipesForExpiringIngredients(
    expiringIngredients: string[],
    limit: number = 5
  ): Promise<RecipeRecommendation[]> {
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'PUBLISHED',
        ingredients: {
          some: {
            name: {
              in: expiringIngredients.map((ing) => ing.toLowerCase()),
            },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Score recipes based on how many expiring ingredients they use
    const scoredRecipes = recipes.map(recipe => {
      const expiringIngsUsed = recipe.ingredients.filter((ing: any) =>
        expiringIngredients.includes((ing.name || '').toLowerCase())
      );

      const score = expiringIngsUsed.length / expiringIngredients.length;

      return {
        recipe: {
          ...recipe,
          tags: recipe.tags.map((rt: any) => rt.tag),
          stats: {
            views: recipe.views,
            likes: recipe.likes,
            saves: recipe.saves,
            completions: recipe.completions,
          },
        },
        matchScore: score,
        matchedIngredients: expiringIngsUsed.map((ing: any) => ing.name),
        missingIngredients: [],
        substitutions: [],
        urgency: 'high', // Flag for UI to highlight these recipes
      };
    });

    return scoredRecipes
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Get trending recipes based on engagement
   */
  async getTrendingRecipes(limit: number = 10): Promise<any[]> {
    return await prisma.recipe.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { likes: 'desc' },
        { saves: 'desc' },
        { views: 'desc' },
      ],
      take: limit,
    });
  }
}

export const recommendationService = new RecipeRecommendationService();