import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";

export default function Profile() {
  const [profile, setProfile] = useState<null | {
    name: string;
    occupation: string;
    cuisines: string[];
    dietary: string[];
  }>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setName(parsed.name);
      setOccupation(parsed.occupation);
      setCuisines(parsed.cuisines || []);
      setDietary(parsed.dietary || []);
    } else {
      setEditMode(true);
    }
  }, []);

  const handleSave = () => {
    const data = { name, occupation, cuisines, dietary };
    setProfile(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
    setEditMode(false);
  };

  const cuisineOptions = ["Indian", "Italian", "Mexican", "Chinese", "Mediterranean"];
  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free"];

  if (editMode || !profile) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Set Up Your Profile</h2>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Occupation</Label>
            <Input value={occupation} onChange={e => setOccupation(e.target.value)} />
          </div>
          <div>
            <Label>Favorite Cuisines</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {cuisineOptions.map(opt => (
                <Button
                  key={opt}
                  type="button"
                  variant={cuisines.includes(opt) ? "default" : "outline"}
                  onClick={() => setCuisines(cuisines.includes(opt) ? cuisines.filter(c => c !== opt) : [...cuisines, opt])}
                  className="px-3 py-1 text-sm"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {dietaryOptions.map(opt => (
                <Button
                  key={opt}
                  type="button"
                  variant={dietary.includes(opt) ? "default" : "outline"}
                  onClick={() => setDietary(dietary.includes(opt) ? dietary.filter(d => d !== opt) : [...dietary, opt])}
                  className="px-3 py-1 text-sm"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
          <Button className="w-full mt-4" onClick={handleSave}>Save Profile</Button>
        </div>
      </div>
    );
  }

  // Profile display
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-2 text-base">
        <div><b>Name:</b> {profile.name}</div>
        <div><b>Occupation:</b> {profile.occupation || <span className="text-muted-foreground">Not set</span>}</div>
        <div><b>Favorite Cuisines:</b> {profile.cuisines.length ? profile.cuisines.join(", ") : <span className="text-muted-foreground">None</span>}</div>
        <div><b>Dietary Restrictions:</b> {profile.dietary.length ? profile.dietary.join(", ") : <span className="text-muted-foreground">None</span>}</div>
      </div>
      <Button className="mt-6 w-full" variant="outline" onClick={() => setEditMode(true)}>
        Edit Profile
      </Button>
    </div>
  );
}