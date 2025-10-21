import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ChefHat, Search, ListChecks, Clock } from "lucide-react";

const guides = [
  {
    title: "Finding Recipes",
    icon: Search,
    steps: [
      "Enter ingredients you have in your kitchen",
      "Browse suggested recipes based on your ingredients",
      "Filter by cooking time, cuisine, and dietary preferences",
      "Save your favorite recipes for quick access",
    ],
  },
  {
    title: "Smart Cooking",
    icon: ChefHat,
    steps: [
      "Follow step-by-step cooking instructions",
      "Get real-time substitution suggestions",
      "Track cooking progress and timers",
      "Rate and review recipes after cooking",
    ],
  },
  {
    title: "Waste Management",
    icon: ListChecks,
    steps: [
      "Add items to your virtual pantry",
      "Get expiry notifications for ingredients",
      "Find recipes to use up expiring items",
      "Track your waste reduction impact",
    ],
  },
  {
    title: "Time Management",
    icon: Clock,
    steps: [
      "Plan meals in advance",
      "Get estimated cooking times",
      "Set reminders for meal prep",
      "Organize your cooking schedule",
    ],
  },
];

const faqs = [
  {
    question: "How does the ingredient matching work?",
    answer: "Our AI-powered system analyzes your available ingredients and matches them with recipes in our database. It considers ingredient combinations, quantities, and possible substitutions to suggest the most relevant recipes.",
  },
  {
    question: "Can I save my favorite recipes?",
    answer: "Yes! Once you create an account, you can save any recipe to your favorites. You'll also get personalized recipe recommendations based on your cooking history and preferences.",
  },
  {
    question: "How accurate are the expiry notifications?",
    answer: "Our expiry predictions are based on standard food storage guidelines and are regularly updated. However, always use your best judgment and check for signs of spoilage before consuming any food.",
  },
  {
    question: "What if I'm missing an ingredient?",
    answer: "Our smart substitution system will suggest alternative ingredients that you can use based on what's available in your pantry. We also indicate how these substitutions might affect the final dish.",
  },
  {
    question: "How do you calculate food waste savings?",
    answer: "We track the ingredients you use through recipes and compare it with average household food waste statistics. The calculations include both weight and monetary value of ingredients saved.",
  },
];

export default function HowItWorks() {
  return (
    <div className="flex-1 py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
            How Zero Waste Chef Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-[800px]">
            Learn how to make the most of our smart cooking platform and reduce food waste while saving money.
          </p>
        </div>

        {/* Video Tutorial */}
        <div className="mb-12">
          <div className="aspect-video rounded-lg overflow-hidden bg-card border">
            {/* Replace with actual video component */}
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Tutorial Video</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="guides">Step-by-Step Guides</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid gap-6 md:grid-cols-2">
              {guides.map((guide, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <guide.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{guide.title}</h3>
                  </div>
                  <ol className="space-y-3">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {stepIndex + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faqs">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}