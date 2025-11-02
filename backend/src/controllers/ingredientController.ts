import { Request, Response } from 'express';
import prisma from '../config/database';
import { SubstitutionResponse } from '../types/substitution';

/**
 * Gets ingredient substitutions for a given ingredient name.
 * Returns up to 10 substitutions, ordered by confidence score.
 */
export const getIngredientSubstitutions = async (req: Request, res: Response): Promise<Response> => {
  const { ingredient } = req.query;

  if (!ingredient) {
    return res.status(400).json({ message: 'Ingredient parameter is required' });
  }

  try {
    const originalIngredient = await prisma.ingredient.findFirst({
      where: {
        name: {
          contains: ingredient as string,
          mode: 'insensitive',
        },
      },
      include: {
        originalSubstitutions: {
          include: {
            substitute: true,
          },
          orderBy: {
            confidence: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!originalIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const formattedSubstitutions = originalIngredient.originalSubstitutions.map((sub: { substitute: { name: string; }; confidence: number; notes: string | null; }) => ({
      original: originalIngredient.name,
      substitute: sub.substitute.name,
      confidence: sub.confidence,
      notes: sub.notes
    } satisfies SubstitutionResponse));

    return res.status(200).json({ 
      message: 'Substitutions retrieved successfully',
      data: formattedSubstitutions
    });

  } catch (error) {
    console.error('Error getting ingredient substitutions:', error);
    return res.status(500).json({ message: 'Failed to retrieve substitutions' });
  }
};