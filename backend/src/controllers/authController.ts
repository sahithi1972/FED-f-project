import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';
import { AuthRequest } from '../types';

// Simple token generation
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    console.log('🔐 Registration attempt:', { email, name });

    // Basic validation
    if (!email || !password || !name) {
      sendError(res, 400, 'Email, password, and name are required');
      return;
    }

    if (password.length < 8) {
      sendError(res, 400, 'Password must be at least 8 characters long');
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      sendError(res, 400, 'User with this email already exists');
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
    email,
    password: hashedPassword,
    name,
    dietaryPreferences: [],
    cuisinePreferences: [],
    healthRestrictions: [],
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate token
    const token = generateToken(user.id);

    console.log('✅ User registered successfully:', user.email);

    sendResponse(res, 201, 'User registered successfully', {
      user: userWithoutPassword,
      token,
      requiresProfileSetup: true,
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    console.log('🔐 Login attempt:', { email });

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for user:', user.email);

    sendResponse(res, 200, 'Login successful', {
  user: userWithoutPassword,
  token,
  requiresProfileSetup: !(user as any).profileCompleted,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      sendError(res, 401, 'Not authenticated');
      return;
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        occupation: true,
        location: true,
        gender: true,
        role: true,
        profileCompleted: true,
        dietaryPreferences: true,
        cuisinePreferences: true,
        healthRestrictions: true,
        recipesCreated: true,
        totalLikes: true,
        impactScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendResponse(res, 200, 'Profile retrieved successfully', userData);
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Internal server error');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { 
      name, 
      occupation, 
      location, 
      gender, 
      profileImage,
      dietaryPreferences, 
      cuisinePreferences, 
      healthRestrictions,
      profileCompleted 
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(occupation !== undefined && { occupation }),
        ...(location !== undefined && { location }),
        ...(gender !== undefined && { gender }),
        ...(profileImage !== undefined && { profileImage }),
        ...(dietaryPreferences !== undefined && { dietaryPreferences }),
        ...(cuisinePreferences !== undefined && { cuisinePreferences }),
        ...(healthRestrictions !== undefined && { healthRestrictions }),
        ...(profileCompleted !== undefined && { profileCompleted }),
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    sendResponse(res, 200, 'Profile updated successfully', userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Failed to update profile');
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Simple refresh token - just generate new token
    const { userId } = req.body;
    
    if (!userId) {
      sendError(res, 400, 'User ID required');
      return;
    }

    const token = generateToken(userId);
    sendResponse(res, 200, 'Token refreshed successfully', { token });
  } catch (error) {
    sendError(res, 401, 'Invalid request');
  }
};