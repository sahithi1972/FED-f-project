import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, ChefHat, Star, Timer, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartRecipe } from '../services/edamamService';
import { getRecipeImage } from '@/lib/utils';

interface RecipeDetailModalProps {
  recipe: SmartRecipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [currentStep, setCurrentStep] = useState(0);
  const [cookingMode, setCookingMode] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  if (!recipe) return null;

  const startCookingMode = () => {
    setCookingMode(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < recipe.ingredientLines.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTimer = (minutes: number) => {
    setTimerActive(true);
    setTimeout(() => {
      setTimerActive(false);
      new Audio('/notification.mp3').play().catch(() => {});
    }, minutes * 60 * 1000);
  };

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Motion variants for ingredient list stagger
  const listVariants = {
    hidden: { opacity: 0 },
    show: { transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto recipe-detail-content bg-background text-foreground"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style>{`.recipe-detail-content::-webkit-scrollbar{display:none}`}</style>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-foreground leading-tight pt-2">
            {recipe.label}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">By {recipe.source}</p>
        </DialogHeader>

        {!cookingMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={getRecipeImage(recipe)}
                  alt={recipe.label}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 text-white px-3 py-1 rounded-full shadow">{recipe.matchScore}% Match</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Clock className="w-5 h-5 text-emerald-400" />, title: `${recipe.totalTime} min`, subtitle: 'Cook Time' },
                    { icon: <Users className="w-5 h-5 text-emerald-400" />, title: `${recipe.yield}`, subtitle: 'Servings' },
                    { icon: <ChefHat className="w-5 h-5 text-emerald-400" />, title: recipe.difficulty, subtitle: 'Difficulty' },
                    { icon: <Star className="w-5 h-5 text-emerald-400" />, title: `${Math.round(recipe.calories / recipe.yield)}`, subtitle: 'Calories' },
                  ].map((box, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">{box.icon}</div>
                      <div>
                        <p className="font-semibold text-foreground">{box.title}</p>
                        <p className="text-sm text-muted-foreground">{box.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {recipe.dietLabels.map((label) => (
                    <Badge key={label} variant="secondary">{label}</Badge>
                  ))}
                  {recipe.healthLabels.slice(0, 3).map((label) => (
                    <Badge key={label} variant="outline">{label}</Badge>
                  ))}
                </div>

                <Button
                  onClick={startCookingMode}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 transform transition-all hover:-translate-y-0.5"
                >
                  🍳 Start Cooking Mode
                </Button>
              </div>
            </div>

            <div className="border-b">
              <nav className="flex space-x-6">
                {['ingredients', 'instructions', 'nutrition', 'tips'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-emerald-500 text-emerald-300 shadow-[0_6px_24px_rgba(16,185,129,0.06)]'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'ingredients' && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Ingredients</h3>
                      <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-2">
                        {recipe.ingredientLines.map((ingredient, index) => (
                          <motion.li key={index} variants={itemVariants} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-foreground">{ingredient}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  )}

                  {activeTab === 'instructions' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Instructions</h3>
                      <ol className="space-y-3 list-decimal list-inside">
                        {recipe.ingredientLines.map((step, index) => (
                          <li key={index} className="text-foreground pb-2 border-b border-border">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeTab === 'nutrition' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Nutrition Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-card rounded-lg">
                          <p className="font-bold text-lg">{Math.round(recipe.calories / recipe.yield)}</p>
                          <p className="text-sm text-muted-foreground">Calories</p>
                        </div>
                        <div className="text-center p-3 bg-card rounded-lg">
                          <p className="font-bold text-lg">{Math.round(recipe.totalWeight / recipe.yield)}g</p>
                          <p className="text-sm text-muted-foreground">Weight</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tips' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">♻️ Waste Reduction Tips</h3>
                      <ul className="space-y-2">
                        {recipe.wasteReductionTips?.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Cooking Mode</h3>
              <Button 
                variant="outline" 
                onClick={() => setCookingMode(false)}
              >
                Exit Cooking
              </Button>
            </div>

            <div className="text-center py-8">
              <h4 className="text-2xl font-bold mb-4">Step {currentStep + 1}</h4>
              <p className="text-lg text-gray-700 mb-6">
                {recipe.ingredientLines[currentStep]}
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => speakInstruction(recipe.ingredientLines[currentStep])}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Speak Step
                </Button>
                
                {recipe.totalTime > 10 && (
                  <Button
                    onClick={() => startTimer(recipe.totalTime)}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={timerActive}
                  >
                    <Timer className="w-4 h-4" />
                    Set Timer ({recipe.totalTime}min)
                  </Button>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                <Button
                  onClick={nextStep}
                  disabled={currentStep === recipe.ingredientLines.length - 1}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {currentStep === recipe.ingredientLines.length - 1 ? 'Finish' : 'Next Step'}
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentStep + 1) / recipe.ingredientLines.length) * 100}%` 
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Step {currentStep + 1} of {recipe.ingredientLines.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};