import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: firstError?.msg || 'Invalid input',
    };
    res.status(400).json(response);
    return;
  }
  
  next();
};