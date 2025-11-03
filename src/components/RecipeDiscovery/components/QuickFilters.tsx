import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const quickFilters = [
  "All Recipes",
  "Quick & Easy",
  "Healthy",
  "Vegetarian",
  "Popular",
  "New"
];

export function QuickFilters() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="flex items-center gap-2">
        {quickFilters.map((filter, index) => (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className={cn(
                "whitespace-nowrap border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500",
                index === 0 && "bg-emerald-500/20 text-emerald-500"
              )}
            >
              {filter}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}