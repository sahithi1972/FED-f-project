import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendResponse, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const searchRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      q = '',
      page = 1,
      limit = 10,
      tags,
      ingredients,
      difficulty,
      maxCookingTime,
      minRating
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build search conditions
    const where: any = {
      status: 'PUBLISHED',
      OR: [
        {
          title: {
            contains: q as string,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: q as string,
            mode: 'insensitive',
          },
        },
      ],
    };

    // Add filters
    if (tags) {
      const tagArray = (Array.isArray(tags) ? tags : [tags]) as string[];
      where.tags = {
        some: {
          tag: {
            name: {
              in: tagArray.map(tag => tag.toLowerCase()),
            },
          },
        },
      };
    }

    if (ingredients) {
      const ingredientArray = (Array.isArray(ingredients) ? ingredients : [ingredients]) as string[];
      where.ingredients = {
        some: {
          name: {
            in: ingredientArray.map(ing => ing.toLowerCase()),
          },
        },
      };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (maxCookingTime) {
      where.cookingTime = {
        lte: parseInt(maxCookingTime as string),
      };
    }

    // Execute search
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
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
          likesRelation: userId ? {
            where: { userId },
            select: { userId: true },
          } : false,
          savesRelation: userId ? {
            where: { userId },
            select: { userId: true },
          } : false,
        },
        orderBy: [
          {
            title: q ? 'desc' : 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        skip,
        take: limitNum,
      }),
      prisma.recipe.count({ where }),
    ]);

    // Transform response
    const recipesWithInteractions = recipes.map(recipe => {
      const { likesRelation, savesRelation, ...recipeData } = recipe as any;
      return {
        ...recipeData,
        isLiked: userId ? (likesRelation?.length ?? 0) > 0 : false,
        isSaved: userId ? (savesRelation?.length ?? 0) > 0 : false,
        tags: recipe.tags?.map((rt: { tag: any }) => rt.tag) ?? [],
        stats: {
          views: recipe.views ?? 0,
          likes: recipe.likes ?? 0,
          saves: recipe.saves ?? 0,
          completions: recipe.completions ?? 0,
        },
      };
    });

    sendResponse(res, 200, 'Search completed successfully', {
      recipes: recipesWithInteractions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      query: q,
      filters: {
        tags,
        ingredients,
        difficulty,
        maxCookingTime,
      },
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    sendError(res, 500, 'Failed to search recipes');
  }
};

export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, limit = 50 } = req.query;
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      take: limitNum,
    });

    sendResponse(res, 200, 'Tags retrieved successfully', tags);
  } catch (error) {
    console.error('Get tags error:', error);
    sendError(res, 500, 'Failed to retrieve tags');
  }
};

export const getPopularTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20 } = req.query;
    const limitNum = parseInt(limit as string);

    const popularTags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
      orderBy: {
        recipes: {
          _count: 'desc',
        },
      },
      take: limitNum,
    });

    const formattedTags = popularTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      recipeCount: tag._count.recipes,
    }));

    sendResponse(res, 200, 'Popular tags retrieved successfully', formattedTags);
  } catch (error) {
    console.error('Get popular tags error:', error);
    sendError(res, 500, 'Failed to retrieve popular tags');
  }
};

export const suggestIngredients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 10 } = req.query;
    const limitNum = parseInt(limit as string);

    if (!q) {
      sendResponse(res, 200, 'Ingredients suggested successfully', []);
      return;
    }

    const ingredients = await prisma.recipeIngredient.findMany({
      where: {
        name: {
          contains: q as string,
          mode: 'insensitive',
        },
      },
      distinct: ['name'],
      select: {
        name: true,
      },
      take: limitNum,
    });

    const suggestions = ingredients.map(ing => ing.name);

    sendResponse(res, 200, 'Ingredients suggested successfully', suggestions);
  } catch (error) {
    console.error('Suggest ingredients error:', error);
    sendError(res, 500, 'Failed to suggest ingredients');
  }
};