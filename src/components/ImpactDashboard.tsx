import { useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Confetti from "react-confetti";
import { badges } from "../data/badges";
import { wasteData } from "../data/waste-data";
import { Scale, Droplets, DollarSign, Leaf } from "lucide-react";

const stats = [
  {
    title: "Waste Prevented",
    value: "32.4",
    unit: "kg",
    icon: Scale,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Money Saved",
    value: "₹1,240",
    unit: "",
    icon: DollarSign,
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Water Saved",
    value: "850",
    unit: "L",
    icon: Droplets,
    change: "+15.3%",
    trend: "up",
  },
  {
    title: "CO2 Reduced",
    value: "12.8",
    unit: "kg",
    icon: Leaf,
    change: "+10.1%",
    trend: "up",
  },
];

const ImpactDashboard = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null);

  const handleBadgeClick = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge && badge.currentProgress >= badge.requirement && !badge.isUnlocked) {
      setShowConfetti(true);
      setRecentlyUnlocked(badgeId);
      setTimeout(() => {
        setShowConfetti(false);
        setRecentlyUnlocked(null);
      }, 5000);
    }
  };

  return (
    <section id="impact" className="py-20 bg-muted/30">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Your Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your contribution to a more sustainable future
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stat.value}
                    <span className="text-lg font-medium ml-1">{stat.unit}</span>
                  </h3>
                  <p className={`text-sm mt-2 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                badge.isUnlocked || badge.currentProgress >= badge.requirement
                  ? "bg-primary/5"
                  : "opacity-75"
              } ${recentlyUnlocked === badge.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleBadgeClick(badge.id)}
            >
              <div className="text-center">
                <span className="text-4xl mb-4 block">{badge.icon}</span>
                <h4 className="font-bold mb-2">{badge.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                <Progress
                  value={(badge.currentProgress / badge.requirement) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {badge.currentProgress} / {badge.requirement}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Waste Reduction Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="waste"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ImpactDashboard;