import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        title: 'First Recipe',
        description: 'Create your first recipe',
        icon: '🥘',
        requirement: 1,
      },
    }),
    prisma.badge.create({
      data: {
        title: 'Waste Warrior',
        description: 'Reduce 1kg of food waste',
        icon: '🌱',
        requirement: 1000,
      },
    }),
    prisma.badge.create({
      data: {
        title: 'Community Favorite',
        description: 'Get 50 likes on your recipes',
        icon: '❤️',
        requirement: 50,
      },
    }),
    prisma.badge.create({
      data: {
        title: 'Recipe Master',
        description: 'Create 10 recipes',
        icon: '👨‍🍳',
        requirement: 10,
      },
    }),
  ]);

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: 'Recipe Creator',
        description: 'Created your first recipe',
        type: 'RECIPE_CREATOR',
      },
    }),
    prisma.achievement.create({
      data: {
        title: 'Waste Warrior',
        description: 'Made significant impact in reducing food waste',
        type: 'WASTE_WARRIOR',
      },
    }),
    prisma.achievement.create({
      data: {
        title: 'Community Builder',
        description: 'Active member of the WasteChef community',
        type: 'COMMUNITY_BUILDER',
      },
    }),
  ]);

  // Create sample users
  const hashedPassword = await hashPassword('password123');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'chef@wastechef.com',
        password: hashedPassword,
        name: 'Master Chef',
        dietaryPreferences: ['vegetarian', 'gluten-free'],
        cuisinePreferences: ['italian', 'mexican'],
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Test User',
        dietaryPreferences: ['vegan'],
        cuisinePreferences: ['asian', 'mediterranean'],
      },
    }),
  ]);

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'vegetarian' } }),
    prisma.tag.create({ data: { name: 'vegan' } }),
    prisma.tag.create({ data: { name: 'gluten-free' } }),
    prisma.tag.create({ data: { name: 'quick' } }),
    prisma.tag.create({ data: { name: 'healthy' } }),
    prisma.tag.create({ data: { name: 'low-waste' } }),
    prisma.tag.create({ data: { name: 'budget-friendly' } }),
  ]);

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });