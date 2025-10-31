import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { Recipe } from '@prisma/client';
import { RecipeFilters, CreateRecipeInput, UpdateRecipeInput } from '../types/recipe';
import { RecipeDifficulty, RecipeStatus } from '../types/enums';
import { RecipeResponse, PaginatedRecipeResponse } from '../types/responses';
import { sendResponse, sendError } from '../utils/response';

const validateRecipeId = (id: string | undefined, res: Response): id is string => {
  if (!id) {
    sendError(res, 400, 'Recipe ID is required');
    return false;
  }
  return true;
};

export const createRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, ingredients, steps, cookingTime, difficulty, servings, tags } = req.body;
    const userId = req.user!.id;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        cookingTime,
        difficulty,
        servings,
        userId,
        ingredients: {
          create: ingredients.map((ing: any) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            wastageReduction: ing.wastageReduction || 0,
          })),
        },
        steps: {
          create: steps.map((step: any, index: number) => ({
            order: step.order || index + 1,
            description: step.description,
            image: step.image,
          })),
        },
        tags: {
          create: (tags || []).map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { recipesCreated: { increment: 1 } },
    });

    sendResponse(res, 201, 'Recipe created successfully', recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    sendError(res, 500, 'Failed to create recipe');
  }
};

export const getRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = String(req.query.sortBy || 'createdAt');
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const userId = req.user?.id;

    const filters: RecipeFilters = {};
    if (req.query.difficulty) filters.difficulty = String(req.query.difficulty);
    if (req.query.cookingTime) filters.cookingTime = Number(req.query.cookingTime);
    if (req.query.tags) filters.tags = (req.query.tags as string).split(',');
    if (req.query.ingredients) filters.ingredients = (req.query.ingredients as string).split(',');

    const where = {
      status: RecipeStatus.PUBLISHED,
      ...(filters.difficulty && { difficulty: filters.difficulty as RecipeDifficulty }),
      ...(filters.cookingTime && { cookingTime: { lte: filters.cookingTime } }),
      ...(filters.tags && {
        tags: {
          some: {
            tag: {
              name: {
                in: filters.tags,
              },
            },
          },
        },
      }),
      ...(filters.ingredients && {
        ingredients: {
          some: {
            name: {
              in: filters.ingredients,
            },
          },
        },
      }),
    };

    const recipes = await prisma.recipe.findMany({
      where,
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
        _count: {
          select: {
            likesRelation: true,
            savesRelation: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Add liked/saved status if user is authenticated
    const recipesWithUserInteraction = recipes.map((recipe) => ({
      ...recipe,
      isLiked: false,
      isSaved: false,
      stats: {
        views: recipe.views,
        likes: recipe._count.likesRelation,
        saves: recipe._count.savesRelation,
        completions: recipe.completions,
      },
    }));

    if (userId) {
      const userLikes = await prisma.recipeLike.findMany({
        where: {
          userId,
          recipeId: {
            in: recipes.map((r) => r.id),
          },
        },
      });

      const userSaves = await prisma.recipeSave.findMany({
        where: {
          userId,
          recipeId: {
            in: recipes.map((r) => r.id),
          },
        },
      });

      recipesWithUserInteraction.forEach((recipe) => {
        recipe.isLiked = userLikes.some((like) => like.recipeId === recipe.id);
        recipe.isSaved = userSaves.some((save) => save.recipeId === recipe.id);
      });
    }

    const total = await prisma.recipe.count({ where });

    sendResponse(res, 200, 'Recipes retrieved successfully', {
      recipes: recipesWithUserInteraction,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    sendError(res, 500, 'Failed to retrieve recipes');
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
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
        _count: {
          select: {
            likesRelation: true,
            savesRelation: true,
          },
        },
      },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    // Increment views
    await prisma.recipe.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const recipeWithStats = {
      ...recipe,
      isLiked: false,
      isSaved: false,
      stats: {
        views: recipe.views + 1, // Include the view we just added
        likes: recipe._count.likesRelation,
        saves: recipe._count.savesRelation,
        completions: recipe.completions,
      },
    };

    if (userId) {
      const [userLike, userSave] = await Promise.all([
        prisma.recipeLike.findUnique({
          where: {
            userId_recipeId: {
              userId,
              recipeId: id,
            },
          },
        }),
        prisma.recipeSave.findUnique({
          where: {
            userId_recipeId: {
              userId,
              recipeId: id,
            },
          },
        }),
      ]);

      recipeWithStats.isLiked = !!userLike;
      recipeWithStats.isSaved = !!userSave;
    }

    sendResponse(res, 200, 'Recipe retrieved successfully', recipeWithStats);
  } catch (error) {
    console.error('Get recipe error:', error);
    sendError(res, 500, 'Failed to retrieve recipe');
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    const updates = req.body;

    // Check if recipe exists and belongs to user
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    if (recipe.userId !== userId) {
      sendError(res, 403, 'Not authorized to update this recipe');
      return;
    }

    // Prepare update data
    const updateData: any = { ...updates };

    // Handle ingredients update
    if (updates.ingredients) {
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId: id },
      });

      updateData.ingredients = {
        create: updates.ingredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          wastageReduction: ing.wastageReduction || 0,
        })),
      };
    }

    // Handle steps update
    if (updates.steps) {
      await prisma.recipeStep.deleteMany({
        where: { recipeId: id },
      });

      updateData.steps = {
        create: updates.steps.map((step: any, index: number) => ({
          order: step.order || index + 1,
          description: step.description,
          image: step.image,
        })),
      };
    }

    // Handle tags update
    if (updates.tags) {
      await prisma.recipeTag.deleteMany({
        where: { recipeId: id },
      });

      updateData.tags = {
        create: updates.tags.map((tagName: string) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      };
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
      include: {
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    sendResponse(res, 200, 'Recipe updated successfully', updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    sendError(res, 500, 'Failed to update recipe');
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    // Check if recipe exists and belongs to user
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    if (recipe.userId !== userId) {
      sendError(res, 403, 'Not authorized to delete this recipe');
      return;
    }

    await prisma.recipe.delete({
      where: { id },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { recipesCreated: { decrement: 1 } },
    });

    sendResponse(res, 200, 'Recipe deleted successfully');
  } catch (error) {
    console.error('Delete recipe error:', error);
    sendError(res, 500, 'Failed to delete recipe');
  }
};

export const likeRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    await prisma.recipeLike.create({
      data: {
        userId,
        recipeId: id,
      },
    });

    await prisma.$transaction([
      prisma.recipe.update({
        where: { id },
        data: { likes: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: recipe.userId },
        data: { totalLikes: { increment: 1 } },
      }),
    ]);

    sendResponse(res, 200, 'Recipe liked successfully');
  } catch (error) {
    if ((error as any).code === 'P2002') {
      sendError(res, 400, 'Recipe already liked');
      return;
    }
    console.error('Like recipe error:', error);
    sendError(res, 500, 'Failed to like recipe');
  }
};

export const unlikeRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    const like = await prisma.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId: id,
        },
      },
    });

    if (!like) {
      sendError(res, 400, 'Recipe not liked');
      return;
    }

    await prisma.recipeLike.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId: id,
        },
      },
    });

    await prisma.$transaction([
      prisma.recipe.update({
        where: { id },
        data: { likes: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: recipe.userId },
        data: { totalLikes: { decrement: 1 } },
      }),
    ]);

    sendResponse(res, 200, 'Recipe unliked successfully');
  } catch (error) {
    console.error('Unlike recipe error:', error);
    sendError(res, 500, 'Failed to unlike recipe');
  }
};

export const saveRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    await prisma.recipeSave.create({
      data: {
        userId,
        recipeId: id,
      },
    });

    await prisma.recipe.update({
      where: { id },
      data: { saves: { increment: 1 } },
    });

    sendResponse(res, 200, 'Recipe saved successfully');
  } catch (error) {
    if ((error as any).code === 'P2002') {
      sendError(res, 400, 'Recipe already saved');
      return;
    }
    console.error('Save recipe error:', error);
    sendError(res, 500, 'Failed to save recipe');
  }
};

export const unsaveRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      sendError(res, 404, 'Recipe not found');
      return;
    }

    const save = await prisma.recipeSave.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId: id,
        },
      },
    });

    if (!save) {
      sendError(res, 400, 'Recipe not saved');
      return;
    }

    await prisma.recipeSave.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId: id,
        },
      },
    });

    await prisma.recipe.update({
      where: { id },
      data: { saves: { decrement: 1 } },
    });

    sendResponse(res, 200, 'Recipe unsaved successfully');
  } catch (error) {
    console.error('Unsave recipe error:', error);
    sendError(res, 500, 'Failed to unsave recipe');
  }
};

export const getUserRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const currentUserId = req.user?.id;

    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
        status: currentUserId === userId ? undefined : 'PUBLISHED',
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
        _count: {
          select: {
            likesRelation: true,
            savesRelation: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const recipesWithStats = await Promise.all(
      recipes.map(async (recipe) => {
        const recipeWithStats = {
          ...recipe,
          isLiked: false,
          isSaved: false,
          stats: {
            views: recipe.views,
            likes: recipe._count.likesRelation,
            saves: recipe._count.savesRelation,
            completions: recipe.completions,
          },
        };

        if (currentUserId) {
          const [userLike, userSave] = await Promise.all([
            prisma.recipeLike.findUnique({
              where: {
                userId_recipeId: {
                  userId: currentUserId,
                  recipeId: recipe.id,
                },
              },
            }),
            prisma.recipeSave.findUnique({
              where: {
                userId_recipeId: {
                  userId: currentUserId,
                  recipeId: recipe.id,
                },
              },
            }),
          ]);

          recipeWithStats.isLiked = !!userLike;
          recipeWithStats.isSaved = !!userSave;
        }

        return recipeWithStats;
      })
    );

    const total = await prisma.recipe.count({
      where: {
        userId,
        status: currentUserId === userId ? undefined : 'PUBLISHED',
      },
    });

    sendResponse(res, 200, 'User recipes retrieved successfully', {
      recipes: recipesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    sendError(res, 500, 'Failed to retrieve user recipes');
  }
};

export const getTrendingRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const limit = Number(req.query.limit) || 10;

    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: [
        { likes: 'desc' },
        { views: 'desc' },
      ],
      take: limit,
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
        _count: {
          select: {
            likesRelation: true,
            savesRelation: true,
          },
        },
      },
    });

    const recipesWithStats = await Promise.all(
      recipes.map(async (recipe) => {
        const recipeWithStats = {
          ...recipe,
          isLiked: false,
          isSaved: false,
          stats: {
            views: recipe.views,
            likes: recipe._count.likesRelation,
            saves: recipe._count.savesRelation,
            completions: recipe.completions,
          },
        };

        if (userId) {
          const [userLike, userSave] = await Promise.all([
            prisma.recipeLike.findUnique({
              where: {
                userId_recipeId: {
                  userId,
                  recipeId: recipe.id,
                },
              },
            }),
            prisma.recipeSave.findUnique({
              where: {
                userId_recipeId: {
                  userId,
                  recipeId: recipe.id,
                },
              },
            }),
          ]);

          recipeWithStats.isLiked = !!userLike;
          recipeWithStats.isSaved = !!userSave;
        }

        return recipeWithStats;
      })
    );

    sendResponse(res, 200, 'Trending recipes retrieved successfully', recipesWithStats);
  } catch (error) {
    console.error('Get trending recipes error:', error);
    sendError(res, 500, 'Failed to retrieve trending recipes');
  }
};

export const getRecommendedRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const limit = Number(req.query.limit) || 10;

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dietaryPreferences: true,
        cuisinePreferences: true,
      },
    });

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Get recipes matching user preferences
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'PUBLISHED',
        userId: { not: userId }, // Exclude user's own recipes
        OR: [
          {
            tags: {
              some: {
                tag: {
                  name: {
                    in: [...user.dietaryPreferences, ...user.cuisinePreferences],
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: [
        { likes: 'desc' },
        { views: 'desc' },
      ],
      take: limit,
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
        _count: {
          select: {
            likesRelation: true,
            savesRelation: true,
          },
        },
      },
    });

    const recipesWithStats = await Promise.all(
      recipes.map(async (recipe) => {
        const [userLike, userSave] = await Promise.all([
          prisma.recipeLike.findUnique({
            where: {
              userId_recipeId: {
                userId,
                recipeId: recipe.id,
              },
            },
          }),
          prisma.recipeSave.findUnique({
            where: {
              userId_recipeId: {
                userId,
                recipeId: recipe.id,
              },
            },
          }),
        ]);

        return {
          ...recipe,
          isLiked: !!userLike,
          isSaved: !!userSave,
          stats: {
            views: recipe.views,
            likes: recipe._count.likesRelation,
            saves: recipe._count.savesRelation,
            completions: recipe.completions,
          },
        };
      })
    );

    sendResponse(res, 200, 'Recommended recipes retrieved successfully', recipesWithStats);
  } catch (error) {
    console.error('Get recommended recipes error:', error);
    sendError(res, 500, 'Failed to retrieve recommended recipes');
  }
};