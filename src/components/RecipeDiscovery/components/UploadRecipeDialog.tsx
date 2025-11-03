import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ImagePlus, X } from 'lucide-react';

interface UploadRecipeFormProps {
  open: boolean;
  onClose: () => void;
  // optional initial data for editing an existing recipe
  initialRecipe?: any;
  // optional callback when a recipe is saved/updated
  onSave?: (recipe: any) => void;
}

interface RecipeFormData {
  title: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  budget: string;
  tags: string[];
  image: File | null;
}

const BUDGET_OPTIONS = [
  { label: "Budget Friendly (Under ₹100)", value: "budget" },
  { label: "Mid-Range (₹100-₹300)", value: "mid" },
  { label: "Premium (₹300+)", value: "premium" }
];

const AVAILABLE_TAGS = [
  "Vegetarian", "Quick & Easy", "Healthy", "Spicy",
  "Breakfast", "Lunch", "Dinner", "Dessert",
  "Indian", "Chinese", "Italian", "Mexican"
];

export function UploadRecipeDialog({ open, onClose, initialRecipe, onSave }: UploadRecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    ingredients: [],
    steps: [""],
    cookingTime: 30,
    budget: "",
    tags: [],
    image: null
  });
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDraft, setIsDraft] = useState(false);

  const handleIngredientAdd = () => {
    if (currentIngredient.trim() && !formData.ingredients.includes(currentIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient("");
    }
  };

  const handleIngredientRemove = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const handleRemoveStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Populate form when editing an existing recipe
  useEffect(() => {
    if (initialRecipe) {
      const r = initialRecipe;
      setFormData({
        title: r.title || "",
        ingredients: r.ingredients || [],
        steps: r.steps && r.steps.length ? r.steps : [""],
        cookingTime: r.cookingTime || 30,
        budget: r.budget || "",
        tags: r.tags || [],
        image: null,
      });
      if (r.image) {
        setImagePreview(r.image);
      } else {
        setImagePreview("");
      }
    } else {
      // reset when opening empty dialog
      setFormData({ title: "", ingredients: [], steps: [""], cookingTime: 30, budget: "", tags: [], image: null });
      setImagePreview("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecipe, open]);

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({ title: "❌ Error", description: "Please enter a recipe title" });
      return;
    }
    if (formData.ingredients.length === 0) {
      toast({ title: "❌ Error", description: "Please add at least one ingredient" });
      return;
    }
    if (!formData.steps[0].trim()) {
      toast({ title: "❌ Error", description: "Please add cooking instructions" });
      return;
    }

    try {
      // Persist to localStorage for now (namespaced per user if available)
      const saveRecipe = async () => {
        let imageData = "";
        if (formData.image) {
          // convert to data URL (base64) so it can be persisted in localStorage
          imageData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = reject;
            reader.readAsDataURL(formData.image as Blob);
          });
        }

        const stored = localStorage.getItem('myRecipes');
        const list = stored ? JSON.parse(stored) : [];

  // If editing an existing recipe (initialRecipe provided), update it
  const initial = initialRecipe;
        if (initial && initial.id) {
          const updated = {
            ...initial,
            title: formData.title,
            ingredients: formData.ingredients,
            steps: formData.steps,
            cookingTime: formData.cookingTime,
            budget: formData.budget,
            tags: formData.tags,
            image: imageData || initial.image,
            status: isDraft ? 'draft' : initial.status || 'published',
            updatedAt: new Date().toISOString()
          };
          const idx = list.findIndex((r: any) => r.id === initial.id);
          if (idx !== -1) list[idx] = updated;
          else list.unshift(updated);
          localStorage.setItem('myRecipes', JSON.stringify(list));
          return updated;
        }

        const newRecipe = {
          id: `local-${Date.now()}`,
          title: formData.title,
          ingredients: formData.ingredients,
          steps: formData.steps,
          cookingTime: formData.cookingTime,
          budget: formData.budget,
          tags: formData.tags,
          image: imageData,
          status: isDraft ? 'draft' : 'published',
          stats: { views: 0, likes: 0, saves: 0 },
          updatedAt: new Date().toISOString()
        };

        list.unshift(newRecipe);
        localStorage.setItem('myRecipes', JSON.stringify(list));
        return newRecipe;
      };

      const saved = await saveRecipe();
      // call parent callback if provided
      try { if (onSave) onSave(saved); } catch (e) { /* ignore */ }
      toast({
        title: isDraft ? "✨ Draft Saved" : "🎉 Recipe Published!",
        description: isDraft 
          ? "Your recipe draft has been saved. You can edit it from My Recipes." 
          : "Your recipe is now live in My Recipes."
      });
      // Close dialog after save
      onClose();
      console.log('Saved recipe locally', saved);
    } catch (error) {
      console.error('Failed to save recipe locally:', error);
      toast({
        title: "❌ Error",
        description: "Failed to save recipe. Please try again."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto upload-dialog-content"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {/* Hide webkit scrollbar for this dialog only */}
        <style>{`.upload-dialog-content::-webkit-scrollbar{display:none}`}</style>
        <DialogHeader>
          <DialogTitle>Upload New Recipe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="E.g., Creamy Garlic Pasta"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label>Ingredients</Label>
            <div className="flex gap-2">
              <Input
                value={currentIngredient}
                onChange={e => setCurrentIngredient(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleIngredientAdd())}
                placeholder="Add ingredient and press Enter"
              />
              <Button type="button" onClick={handleIngredientAdd}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredients.map(ingredient => (
                <Badge key={ingredient} variant="secondary">
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => handleIngredientRemove(ingredient)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <Label>Cooking Steps</Label>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={step}
                  onChange={e => handleStepChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                  disabled={formData.steps.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddStep}>
              Add Step
            </Button>
          </div>

          {/* Cooking Time and Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
              <Input
                id="cookingTime"
                type="number"
                min="1"
                value={formData.cookingTime}
                onChange={e => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <select
                id="budget"
                className="w-full p-2 rounded-md border bg-white text-black"
                value={formData.budget}
                onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              >
                <option value="">Select budget range</option>
                {BUDGET_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Recipe Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('recipe-image')?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              <input
                id="recipe-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-md hover:bg-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDraft(true);
                handleSubmit(new Event('submit') as any);
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit" onClick={() => setIsDraft(false)}>
              Publish Recipe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}