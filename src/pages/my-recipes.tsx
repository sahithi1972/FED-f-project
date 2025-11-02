import { useAuth } from "@/contexts/auth-context";
import { MyRecipesDashboard } from "../components/RecipeDiscovery/components/MyRecipesDashboard";
import { PageTransition } from "@/components/PageTransition";
import { Spinner } from "@/components/ui/spinner";


export default function MyRecipesPage() {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }


  if (!user) {
    return null; // ProtectedRoute will handle the redirect
  }

  return (
    <PageTransition>
      <MyRecipesDashboard userId={user.email} />
    </PageTransition>
  );
}