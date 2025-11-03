import { WeatherData } from '../services/weatherService';

const WeatherCard = ({ weather, temperature }: { weather: WeatherData | null; temperature: number }) => {
  return (
    <div className="bg-blue-500 rounded-xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-2">Current Weather</h3>
      <p className="text-sm mb-4">Your Location</p>
      <div className="flex items-center justify-between">
        <div className="text-4xl font-bold">{temperature}°C</div>
        <div className="text-xl">{weather?.condition || 'Sunny'}</div>
      </div>
    </div>
  );
};

export default WeatherCard;