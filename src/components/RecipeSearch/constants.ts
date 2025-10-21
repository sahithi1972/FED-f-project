export const CUISINES = [
  { label: 'Indian', value: 'indian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Thai', value: 'thai' },
  { label: 'Mediterranean', value: 'mediterranean' },
] as const;

export const DIETARY_RESTRICTIONS = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Low-Carb', value: 'low-carb' },
] as const;

export const DIFFICULTY_LEVELS = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
] as const;

export const SORT_OPTIONS = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Cooking Time', value: 'time' },
  { label: 'Difficulty Level', value: 'difficulty' },
  { label: 'Newest First', value: 'newest' },
] as const;