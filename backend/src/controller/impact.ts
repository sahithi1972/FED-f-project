import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendResponse, sendError } from '../utils/response';
import { AuthRequest } from '../types';
import { ImpactTimespan, ImpactLog, ImpactStats, LeaderboardEntry, CommunityTotal } from '../types/impact';

export const logImpact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      wasteReduced,
      moneySaved,
      co2Reduced,
      waterSaved,
      timespan = 'DAILY'
    } = req.body;

    // Create impact log
    const impactLog = await prisma.impactLog.create({
      data: {
        userId,
        wasteReduced,
        moneySaved,
        co2Reduced,
        waterSaved,
        timespan,
      },
    });

    // Update user impact score (simple sum of all metrics)
    const impactScore = wasteReduced + moneySaved + co2Reduced + waterSaved;
    await prisma.user.update({
      where: { id: userId },
      data: {
        impactScore: { increment: impactScore },
      },
    });

    sendResponse<ImpactLog>(res, 201, 'Impact logged successfully', impactLog);
  } catch (error) {
    console.error('Log impact error:', error);
    sendError(res, 500, 'Failed to log impact');
  }
};

export const getUserImpact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { timespan, startDate, endDate, limit = 30 } = req.query;

    const where: any = { userId };

    if (timespan) {
      where.timespan = timespan;
    }

    if (startDate && endDate) {
      where.loggedAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const impactLogs = await prisma.impactLog.findMany({
      where,
      orderBy: {
        loggedAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    // Calculate totals
    const totals = {
      wasteReduced: impactLogs.reduce((sum, log) => sum + log.wasteReduced, 0),
      moneySaved: impactLogs.reduce((sum, log) => sum + log.moneySaved, 0),
      co2Reduced: impactLogs.reduce((sum, log) => sum + log.co2Reduced, 0),
      waterSaved: impactLogs.reduce((sum, log) => sum + log.waterSaved, 0),
    };

    sendResponse(res, 200, 'User impact retrieved successfully', {
      logs: impactLogs,
      totals,
    });
  } catch (error) {
    console.error('Get user impact error:', error);
    sendError(res, 500, 'Failed to retrieve user impact');
  }
};

export const getUserImpactStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Get user with impact logs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        impactLogs: {
          orderBy: {
            loggedAt: 'desc',
          },
          take: 100, // Last 100 logs for stats
        },
      },
    });

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Calculate various statistics
    const totalImpact = user.impactLogs.reduce(
      (acc, log) => ({
        wasteReduced: acc.wasteReduced + log.wasteReduced,
        moneySaved: acc.moneySaved + log.moneySaved,
        co2Reduced: acc.co2Reduced + log.co2Reduced,
        waterSaved: acc.waterSaved + log.waterSaved,
      }),
      { wasteReduced: 0, moneySaved: 0, co2Reduced: 0, waterSaved: 0 }
    );

    // Calculate weekly impact (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyImpact = user.impactLogs
      .filter(log => log.loggedAt >= oneWeekAgo)
      .reduce(
        (acc, log) => ({
          wasteReduced: acc.wasteReduced + log.wasteReduced,
          moneySaved: acc.moneySaved + log.moneySaved,
          co2Reduced: acc.co2Reduced + log.co2Reduced,
          waterSaved: acc.waterSaved + log.waterSaved,
        }),
        { wasteReduced: 0, moneySaved: 0, co2Reduced: 0, waterSaved: 0 }
      );

    const stats: ImpactStats = {
      total: totalImpact,
      weekly: weeklyImpact,
      impactScore: user.impactScore,
      logCount: user.impactLogs.length,
    };

    sendResponse<ImpactStats>(res, 200, 'User impact stats retrieved successfully', stats);
  } catch (error) {
    console.error('Get user impact stats error:', error);
    sendError(res, 500, 'Failed to retrieve user impact stats');
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 50, timeframe = 'all' } = req.query;
    const limitNum = parseInt(limit as string);

    let where = {};
    if (timeframe !== 'all') {
      const date = new Date();
      
      switch (timeframe) {
        case 'weekly':
          date.setDate(date.getDate() - 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      
      where = {
        impactLogs: {
          some: {
            loggedAt: {
              gte: date,
            },
          },
        },
      };
    }

    const leaderboard = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        profileImage: true,
        impactScore: true,
        recipesCreated: true,
        totalLikes: true,
        _count: {
          select: {
            impactLogs: true,
          },
        },
      },
      orderBy: {
        impactScore: 'desc',
      },
      take: limitNum,
    });

    // Transform response
    const formattedLeaderboard: LeaderboardEntry[] = leaderboard.map(user => ({
      id: user.id,
      name: user.name,
      profileImage: user.profileImage,
      impactScore: user.impactScore,
      recipesCreated: user.recipesCreated,
      totalLikes: user.totalLikes,
      impactLogCount: user._count.impactLogs,
    }));

    sendResponse<LeaderboardEntry[]>(res, 200, 'Leaderboard retrieved successfully', formattedLeaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    sendError(res, 500, 'Failed to retrieve leaderboard');
  }
};

export const getCommunityTotal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { timeframe = 'all' } = req.query;

    let where = {};
    if (timeframe !== 'all') {
      const date = new Date();
      
      switch (timeframe) {
        case 'weekly':
          date.setDate(date.getDate() - 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      
      where = {
        loggedAt: {
          gte: date,
        },
      };
    }

    const communityImpact = await prisma.impactLog.aggregate({
      where,
      _sum: {
        wasteReduced: true,
        moneySaved: true,
        co2Reduced: true,
        waterSaved: true,
      },
      _count: {
        _all: true,
      },
    });

    const totalUsers = await prisma.user.count();

    const result: CommunityTotal = {
      totals: {
        wasteReduced: communityImpact._sum.wasteReduced || 0,
        moneySaved: communityImpact._sum.moneySaved || 0,
        co2Reduced: communityImpact._sum.co2Reduced || 0,
        waterSaved: communityImpact._sum.waterSaved || 0,
      },
      totalLogs: communityImpact._count._all,
      totalUsers,
      averagePerUser: {
        wasteReduced: communityImpact._sum.wasteReduced ? communityImpact._sum.wasteReduced / totalUsers : 0,
        moneySaved: communityImpact._sum.moneySaved ? communityImpact._sum.moneySaved / totalUsers : 0,
        co2Reduced: communityImpact._sum.co2Reduced ? communityImpact._sum.co2Reduced / totalUsers : 0,
        waterSaved: communityImpact._sum.waterSaved ? communityImpact._sum.waterSaved / totalUsers : 0,
      },
    };

    sendResponse<CommunityTotal>(res, 200, 'Community total retrieved successfully', result);
  } catch (error) {
    console.error('Get community total error:', error);
    sendError(res, 500, 'Failed to retrieve community total');
  }
};