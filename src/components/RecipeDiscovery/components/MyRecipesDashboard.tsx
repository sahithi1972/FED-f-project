import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { badges } from "@/data/badges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeDisplay } from "./BadgeDisplay";
import { EngagementInsights } from "./EngagementInsights";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EnhancedRecipeCard } from "./EnhancedRecipeCard.js";
import { CreatorStats } from "./CreatorStats";
import { UploadRecipeDialog } from "./UploadRecipeDialog";

interface Recipe {
  id: string;
  title: string;
  image: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  status: "published" | "draft" | "saved";
  stats: {
    views: number;
    likes: number;
    saves: number;
  };
  updatedAt: string;
}

interface MyRecipesDashboardProps {
  userId: string;
}

type SortOption = "date" | "popularity" | "cooking-time" | "alphabetical";

export function MyRecipesDashboard({ userId }: MyRecipesDashboardProps) {
  const [activeTab, setActiveTab] = useState("published");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();

  // Mock data - replace with actual API call
  useEffect(() => {
    // Try to load user recipes from localStorage first
    const stored = localStorage.getItem('myRecipes');
    if (stored) {
      try {
        const parsed: Recipe[] = JSON.parse(stored);
        setRecipes(parsed);
        return;
      } catch (e) {
        console.warn('Failed to parse local myRecipes:', e);
      }
    }

    // Fallback to mock data
      const mockRecipes: Recipe[] = [
      {
        id: "1",
        title: "Homemade Pizza",
        image: "/placeholder.svg",
        tags: ["Italian", "Dinner", "Vegetarian"],
        ingredients: ["Flour", "Yeast", "Tomato Sauce", "Cheese"],
        steps: [
          "Make the dough",
          "Prepare the sauce",
          "Add toppings",
          "Bake at 450°F"
        ],
        cookingTime: 45,
        status: "published",
        stats: {
          views: 156,
          likes: 45,
          saves: 23
        },
        updatedAt: "2025-10-15"
      },
    ];

    setRecipes(mockRecipes);
  }, [userId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEdit = (recipeId: string) => {
    const r = recipes.find(r => r.id === recipeId) || null;
    if (r) {
      setEditingRecipe(r);
      setEditDialogOpen(true);
    } else {
      console.warn('Recipe to edit not found:', recipeId);
    }
  };

  const handleDelete = async (recipeId: string) => {
    try {
      // TODO: Implement actual delete API call
      const newList = recipes.filter(recipe => recipe.id !== recipeId);
      setRecipes(newList);
      try {
        localStorage.setItem('myRecipes', JSON.stringify(newList));
      } catch (err) {
        console.warn('Failed to update myRecipes in localStorage', err);
      }
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again."
      });
    }
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesTab = activeTab === recipe.status;
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = tagFilter === "all" || recipe.tags.includes(tagFilter);
      return matchesTab && matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.stats.likes - a.stats.likes;
        case "cooking-time":
          return a.cookingTime - b.cookingTime;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatorStats recipes={recipes} />

      <EngagementInsights
        views={recipes.reduce((total, recipe) => total + recipe.stats.views, 0)}
        completionRate={75} // This should be calculated based on actual data
        comments={recipes.length * 5} // This is a mock value, should be real data
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
        <BadgeDisplay badges={badges} />
      </div>
      
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search recipes by title or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-4">
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {getAllTags().map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest Updated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="cooking-time">Cooking Time</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedRecipes.map((recipe) => (
                <EnhancedRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={handleEdit}
                  onDelete={(id) => {
                    setRecipeToDelete(id);
                    setDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
            {filteredAndSortedRecipes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || tagFilter
                    ? "Try adjusting your search or filters"
                    : `You haven't ${activeTab === "saved" ? "saved" : "created"} any recipes yet`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your recipe
              and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => recipeToDelete && handleDelete(recipeToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit / Upload dialog (re-use upload dialog for editing) */}
      <UploadRecipeDialog
        open={editDialogOpen}
        onClose={() => { setEditDialogOpen(false); setEditingRecipe(null); }}
        initialRecipe={editingRecipe}
        onSave={(updated: any) => {
          try {
            const newList = recipes.map(r => r.id === updated.id ? { ...r, ...updated } : r);
            setRecipes(newList);
            localStorage.setItem('myRecipes', JSON.stringify(newList));
            toast({ title: 'Recipe updated', description: 'Your recipe changes were saved.' });
          } catch (err) {
            console.warn('Failed to persist updated recipe', err);
          }
          setEditDialogOpen(false);
          setEditingRecipe(null);
        }}
      />
    </div>
  );
}