import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { hashPassword, comparePassword, generateToken, generateRefreshToken } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, dietaryPreferences = [], cuisinePreferences = [] } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      sendError(res, 400, 'User with this email already exists');
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        dietaryPreferences,
        cuisinePreferences,
      },
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
      },
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    sendResponse(res, 201, 'User registered successfully', {
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      role: user.role,
      dietaryPreferences: user.dietaryPreferences,
      cuisinePreferences: user.cuisinePreferences,
      recipesCreated: user.recipesCreated,
      totalLikes: user.totalLikes,
      impactScore: user.impactScore,
      createdAt: user.createdAt,
    };

    sendResponse(res, 200, 'Login successful', {
      user: userData,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, 401, 'Refresh token required');
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    
    // Generate new tokens
    const newToken = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    sendResponse(res, 200, 'Token refreshed successfully', {
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    sendError(res, 401, 'Invalid refresh token');
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    // Get user badges and achievements
    const userWithStats = await prisma.user.findUnique({
      where: { id: user!.id },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    sendResponse(res, 200, 'Profile retrieved successfully', userWithStats);
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, dietaryPreferences, cuisinePreferences } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(dietaryPreferences && { dietaryPreferences }),
        ...(cuisinePreferences && { cuisinePreferences }),
      },
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
      },
    });

    sendResponse(res, 200, 'Profile updated successfully', updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};