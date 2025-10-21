import { useState, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Search, Clock, ChefHat, Filter, AlertCircle } from 'lucide-react';
import { Recipe, SearchFilters, SearchState } from './types';
import { CUISINES, DIETARY_RESTRICTIONS, DIFFICULTY_LEVELS, SORT_OPTIONS } from './constants';

const RecipeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    cuisine: [],
    cookingTime: null,
    dietary: [],
    difficulty: [],
  });
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    try {
      setSearchState('loading');
      setError(null);
      
      // TODO: Replace with actual API call
      const mockApiCall = new Promise<Recipe[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              title: 'Vegetable Stir Fry',
              description: 'A quick and healthy stir fry with seasonal vegetables',
              cookingTime: 20,
              cuisine: 'chinese',
              ingredients: ['vegetables', 'soy sauce', 'ginger'],
              dietary: ['vegetarian', 'vegan'],
              difficulty: 'easy',
              imageUrl: '/images/stir-fry.jpg'
            },
            // Add more mock recipes as needed
          ]);
        }, 1500);
      });

      const results = await mockApiCall;
      setRecipes(results);
      setSearchState('success');
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      setSearchState('error');
    }
  }, [searchQuery, filters, sortBy]);

  const handleFilterChange = (type: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Loading states for recipe cards
  const RecipeCardSkeleton = () => (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[120px] w-full" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Sort Select */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Recipes</SheetTitle>
              <SheetDescription>
                Refine your search with these filters
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-full">
              <div className="space-y-6 py-4">
                {/* Cuisine Filter */}
                <div className="space-y-4">
                  <h4 className="font-medium">Cuisine</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {CUISINES.map(cuisine => (
                      <div key={cuisine.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine.value}
                          checked={filters.cuisine.includes(cuisine.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('cuisine', [...filters.cuisine, cuisine.value]);
                            } else {
                              handleFilterChange('cuisine', filters.cuisine.filter(c => c !== cuisine.value));
                            }
                          }}
                        />
                        <label htmlFor={cuisine.value}>{cuisine.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-4">
                  <h4 className="font-medium">Dietary Restrictions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {DIETARY_RESTRICTIONS.map(restriction => (
                      <div key={restriction.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={restriction.value}
                          checked={filters.dietary.includes(restriction.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('dietary', [...filters.dietary, restriction.value]);
                            } else {
                              handleFilterChange('dietary', filters.dietary.filter(d => d !== restriction.value));
                            }
                          }}
                        />
                        <label htmlFor={restriction.value}>{restriction.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-4">
                  <h4 className="font-medium">Difficulty Level</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {DIFFICULTY_LEVELS.map(level => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={level.value}
                          checked={filters.difficulty.includes(level.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('difficulty', [...filters.difficulty, level.value]);
                            } else {
                              handleFilterChange('difficulty', filters.difficulty.filter(d => d !== level.value));
                            }
                          }}
                        />
                        <label htmlFor={level.value}>{level.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Button onClick={handleSearch} disabled={searchState === 'loading'}>
          {searchState === 'loading' ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Active Filters */}
      {(filters.cuisine.length > 0 || filters.dietary.length > 0 || filters.difficulty.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.cuisine.map(cuisine => (
            <Badge key={cuisine} variant="secondary" className="cursor-pointer hover:bg-destructive/50">
              {CUISINES.find(c => c.value === cuisine)?.label}
            </Badge>
          ))}
          {filters.dietary.map(diet => (
            <Badge key={diet} variant="secondary" className="cursor-pointer hover:bg-destructive/50">
              {DIETARY_RESTRICTIONS.find(d => d.value === diet)?.label}
            </Badge>
          ))}
          {filters.difficulty.map(diff => (
            <Badge key={diff} variant="secondary" className="cursor-pointer hover:bg-destructive/50">
              {DIFFICULTY_LEVELS.find(d => d.value === diff)?.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchState === 'loading' ? (
          // Loading state
          Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))
        ) : recipes.length > 0 ? (
          // Results
          recipes.map(recipe => (
            <Card key={recipe.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                  <img src={recipe.imageUrl} alt={recipe.title} className="object-cover w-full h-full" />
                </div>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {recipe.cookingTime} mins
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="h-4 w-4 mr-1" />
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.dietary.map(diet => (
                    <Badge key={diet} variant="outline">
                      {diet}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Recipe</Button>
              </CardFooter>
            </Card>
          ))
        ) : searchState === 'success' ? (
          // No results
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No recipes found. Try adjusting your search or filters.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeSearch;