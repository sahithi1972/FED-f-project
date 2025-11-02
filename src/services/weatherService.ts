// Simple weather service for demo - in real app, you'd use a weather API
export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

export class WeatherService {
  static async getCurrentWeather(): Promise<WeatherData> {
    // For demo, return mock data
    // In production, integrate with OpenWeatherMap API or similar
    return {
      temperature: 22,
      condition: 'Sunny',
      location: 'Your Location',
      icon: '☀️'
    };
  }

  static getWeatherBasedRecipes(weather: WeatherData): string[] {
    const suggestions: string[] = [];
    
    if (weather.temperature > 25) {
      suggestions.push('Refreshing salads', 'Cold soups', 'Summer smoothies', 'Grilled vegetables');
    } else if (weather.temperature < 15) {
      suggestions.push('Hearty soups', 'Comfort food', 'Hot beverages', 'Oven-baked dishes');
    } else {
      suggestions.push('Balanced meals', 'Quick stir-fries', 'Light pasta dishes');
    }

    if (weather.condition.toLowerCase().includes('rain')) {
      suggestions.push('Comforting stews', 'Hot chocolate', 'Baked goods');
    }

    return suggestions;
  }
}