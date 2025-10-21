interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

interface QuickReply {
  id: string;
  label: string;
  message: string;
}

export const quickReplies: QuickReply[] = [
  {
    id: "leftover",
    label: "Leftover Solutions",
    message: "I need ideas for using my leftovers"
  },
  {
    id: "storage",
    label: "Storage Tips",
    message: "How should I store my ingredients?"
  },
  {
    id: "substitutes",
    label: "Substitutes",
    message: "What can I use instead of..."
  },
  {
    id: "cooking",
    label: "Cooking Help",
    message: "I need help with a recipe"
  },
  {
    id: "waste",
    label: "Waste Reduction",
    message: "Tips for reducing food waste"
  },
];