import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";
import { WeatherType } from "../types";

interface WeatherCardProps {
  weather: WeatherType;
  temperature: number;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

export function WeatherCard({ weather, temperature }: WeatherCardProps) {
  const Icon = weatherIcons[weather];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-lg 
        border border-emerald-500/20 rounded-xl p-4 shadow-lg hover:shadow-emerald-500/10
        transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="p-2 rounded-full bg-emerald-500/20"
        >
          <Icon className="w-6 h-6 text-emerald-500" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Perfect for today</h3>
          <p className="text-sm text-muted-foreground">
            {temperature}°C • {weather.charAt(0).toUpperCase() + weather.slice(1)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}