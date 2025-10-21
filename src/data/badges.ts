export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
};

export const badges: Badge[] = [
  {
    id: "waste-warrior",
    title: "Waste Warrior",
    description: "Prevent 5kg of food waste",
    icon: "🗑️",
    requirement: 5,
    currentProgress: 3.2,
    isUnlocked: false,
  },
  {
    id: "money-master",
    title: "Money Master",
    description: "Save ₹1000 through smart cooking",
    icon: "💰",
    requirement: 1000,
    currentProgress: 1200,
    isUnlocked: true,
  },
  {
    id: "water-savior",
    title: "Water Savior",
    description: "Save 100L of water through eco-cooking",
    icon: "💧",
    requirement: 100,
    currentProgress: 85,
    isUnlocked: false,
  },
  {
    id: "eco-champion",
    title: "Eco Champion",
    description: "Reduce CO2 emissions by 10kg",
    icon: "🌱",
    requirement: 10,
    currentProgress: 10,
    isUnlocked: true,
  },
];