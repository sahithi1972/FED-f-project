import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  ChefHat, 
  BookOpen,
  Leaf,
  Clock,
  DollarSign, 
  Package, 
  Activity, 
  Calendar, 
  Star 
} from "lucide-react";
import { Badge as BadgeType } from "../data/badges";
import { badges } from "../data/badges";

const statistics = [
  {
    icon: Leaf,
    title: "Food Waste Prevented",
    value: "12.5 kg",
    change: "+2.1 kg this month",
    trend: "up",
  },
  {
    icon: DollarSign,
    title: "Money Saved",
    value: "₹2,450",
    change: "+₹350 this month",
    trend: "up",
  },
  {
    icon: Package,
    title: "Ingredients Tracked",
    value: "45",
    change: "8 expiring soon",
    trend: "neutral",
  },
  {
    icon: Activity,
    title: "Recipes Cooked",
    value: "28",
    change: "+5 this month",
    trend: "up",
  }
];

const recentActivities = [
  {
    icon: ChefHat,
    title: "Cooked Butter Chicken",
    time: "2 hours ago",
  },
  {
    icon: BookOpen,
    title: "Added new recipe: Palak Paneer",
    time: "Yesterday",
  },
  {
    icon: ChefHat,
    title: "Cooked Pasta Primavera",
    time: "2 days ago",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xl font-semibold text-muted-foreground">
            {currentUser.name?.[0] || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {currentUser.name || 'User'}!</h2>
          <p className="text-muted-foreground">Here's what's cooking today</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {statistics.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Achievements</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unlocked">Unlocked</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {badges.map((badge: BadgeType, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{badge.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                    <Badge variant={badge.isUnlocked ? "default" : "outline"}>
                      {badge.isUnlocked ? "Unlocked" : "Locked"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}