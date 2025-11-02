

import { PrismaClient } from '@prisma/client';
import { seedRecipeData } from './recipeData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed recipe data (includes users, ingredients, categories, and recipes)
    await seedRecipeData();

    // Create additional badges and achievements
    console.log('Creating badges and achievements...');
    
    const badges = await Promise.all([
      prisma.badge.upsert({
        where: { title: 'First Recipe' },
        update: {},
        create: {
          title: 'First Recipe',
          description: 'Create your first recipe',
          icon: '🥘',
          requirement: 1,
        },
      }),
      prisma.badge.upsert({
        where: { title: 'Waste Warrior' },
        update: {},
        create: {
          title: 'Waste Warrior',
          description: 'Reduce 1kg of food waste',
          icon: '🌱',
          requirement: 1000,
        },
      }),
      prisma.badge.upsert({
        where: { title: 'Community Favorite' },
        update: {},
        create: {
          title: 'Community Favorite',
          description: 'Get 50 likes on your recipes',
          icon: '❤️',
          requirement: 50,
        },
      }),
      prisma.badge.upsert({
        where: { title: 'Recipe Master' },
        update: {},
        create: {
          title: 'Recipe Master',
          description: 'Create 10 recipes',
          icon: '👨‍🍳',
          requirement: 10,
        },
      }),
    ]);

    const achievements = await Promise.all([
      prisma.achievement.upsert({
        where: { title: 'Recipe Creator' },
        update: {},
        create: {
          title: 'Recipe Creator',
          description: 'Created your first recipe',
          type: 'RECIPE_CREATOR',
        },
      }),
      prisma.achievement.upsert({
        where: { title: 'Waste Warrior' },
        update: {},
        create: {
          title: 'Waste Warrior',
          description: 'Made significant impact in reducing food waste',
          type: 'WASTE_WARRIOR',
        },
      }),
      prisma.achievement.upsert({
        where: { title: 'Community Builder' },
        update: {},
        create: {
          title: 'Community Builder',
          description: 'Active member of the WasteChef community',
          type: 'COMMUNITY_BUILDER',
        },
      }),
    ]);

    console.log(`✅ Created ${badges.length} badges and ${achievements.length} achievements`);

    console.log('✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });