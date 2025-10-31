import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendResponse, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        dietaryPreferences: true,
        cuisinePreferences: true,
        recipesCreated: true,
        totalLikes: true,
        impactScore: true,
        createdAt: true,
        updatedAt: true,
        recipes: {
          where: {
            status: 'PUBLISHED',
          },
          include: {
            ingredients: true,
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
          take: 10,
        },
      },
    });

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Transform recipes
    const transformedRecipes = user.recipes.map(recipe => ({
      ...recipe,
      tags: recipe.tags.map(rt => rt.tag),
      stats: {
        views: recipe.views,
        likes: recipe.likes,
        saves: recipe.saves,
        completions: recipe.completions,
      },
    }));

    const userProfile = {
      ...user,
      recipes: transformedRecipes,
      stats: {
        recipesCreated: user.recipesCreated,
        totalLikes: user.totalLikes,
        impactScore: user.impactScore,
        totalRecipes: user.recipes.length,
      },
    };

    sendResponse(res, 200, 'User profile retrieved successfully', userProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    sendError(res, 500, 'Failed to retrieve user profile');
  }
};

export const getUserBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: [
        { unlocked: 'desc' },
        { progress: 'desc' },
      ],
    });

    const badges = userBadges.map(ub => ({
      id: ub.badge.id,
      title: ub.badge.title,
      description: ub.badge.description,
      icon: ub.badge.icon,
      requirement: ub.badge.requirement,
      currentProgress: ub.progress,
      isUnlocked: ub.unlocked,
      unlockedAt: ub.unlockedAt,
    }));

    sendResponse(res, 200, 'User badges retrieved successfully', badges);
  } catch (error) {
    console.error('Get user badges error:', error);
    sendError(res, 500, 'Failed to retrieve user badges');
  }
};

export const getUserAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    const achievements = userAchievements.map(ua => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      type: ua.achievement.type,
      unlockedAt: ua.unlockedAt,
    }));

    sendResponse(res, 200, 'User achievements retrieved successfully', achievements);
  } catch (error) {
    console.error('Get user achievements error:', error);
    sendError(res, 500, 'Failed to retrieve user achievements');
  }
};

export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const [user, recipes, impactLogs, badges, achievements] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          recipesCreated: true,
          totalLikes: true,
          impactScore: true,
        },
      }),
      prisma.recipe.findMany({
        where: { userId },
        select: {
          views: true,
          likes: true,
          saves: true,
          completions: true,
        },
      }),
      prisma.impactLog.findMany({
        where: { userId },
        select: {
          wasteReduced: true,
          moneySaved: true,
          co2Reduced: true,
          waterSaved: true,
        },
      }),
      prisma.userBadge.count({
        where: {
          userId,
          unlocked: true,
        },
      }),
      prisma.userAchievement.count({
        where: { userId },
      }),
    ]);

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Calculate recipe stats
    const recipeStats = recipes.reduce(
      (acc, recipe) => ({
        totalViews: acc.totalViews + recipe.views,
        totalLikes: acc.totalLikes + recipe.likes,
        totalSaves: acc.totalSaves + recipe.saves,
        totalCompletions: acc.totalCompletions + recipe.completions,
      }),
      { totalViews: 0, totalLikes: 0, totalSaves: 0, totalCompletions: 0 }
    );

    // Calculate impact stats
    const impactStats = impactLogs.reduce(
      (acc, log) => ({
        totalWasteReduced: acc.totalWasteReduced + log.wasteReduced,
        totalMoneySaved: acc.totalMoneySaved + log.moneySaved,
        totalCO2Reduced: acc.totalCO2Reduced + log.co2Reduced,
        totalWaterSaved: acc.totalWaterSaved + log.waterSaved,
      }),
      { totalWasteReduced: 0, totalMoneySaved: 0, totalCO2Reduced: 0, totalWaterSaved: 0 }
    );

    const stats = {
      basic: {
        recipesCreated: user.recipesCreated,
        totalLikesReceived: user.totalLikes,
        impactScore: user.impactScore,
      },
      recipes: recipeStats,
      impact: impactStats,
      achievements: {
        badgesUnlocked: badges,
        achievementsUnlocked: achievements,
      },
    };

    sendResponse(res, 200, 'User stats retrieved successfully', stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    sendError(res, 500, 'Failed to retrieve user stats');
  }
};

export const updateUserPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { dietaryPreferences, cuisinePreferences } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(dietaryPreferences && { dietaryPreferences }),
        ...(cuisinePreferences && { cuisinePreferences }),
      },
      select: {
        id: true,
        dietaryPreferences: true,
        cuisinePreferences: true,
      },
    });

    sendResponse(res, 200, 'Preferences updated successfully', updatedUser);
  } catch (error) {
    console.error('Update user preferences error:', error);
    sendError(res, 500, 'Failed to update preferences');
  }
};