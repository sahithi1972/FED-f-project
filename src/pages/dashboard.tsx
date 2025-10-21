import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  ChefHat, 
  Leaf, 
  DollarSign, 
  Package, 
  Activity, 
  Clock, 
  Calendar, 
  Star 
} from "lucide-react";
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
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pantry">Pantry</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {/* Activity Items */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ChefHat className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Cooked Pasta Primavera</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Expiring Soon */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tomatoes</span>
                      </div>
                      <Badge variant="secondary">2 days left</Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pantry" className="space-y-4">
          {/* Pantry Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Pantry</CardTitle>
                <Button>Add Items</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Pantry Items */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Rice</p>
                        <p className="text-xs text-muted-foreground">500g remaining</p>
                      </div>
                    </div>
                    <Badge>Expires in 30 days</Badge>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Activity History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activity History</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="waste">Waste Prevention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Made vegetable stir-fry</p>
                      <p className="text-xs text-muted-foreground">Used 5 ingredients • Saved ₹120</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {/* Achievements and Badges */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <Card key={badge.id} className={!badge.isUnlocked ? "opacity-50" : undefined}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{badge.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{badge.currentProgress} / {badge.requirement}</span>
                      {badge.isUnlocked && (
                        <Badge>
                          <Star className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <div className="h-2 rounded-full bg-primary/20">
                      <div 
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ 
                          width: `${(badge.currentProgress / badge.requirement) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}