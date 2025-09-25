import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, DollarSign, Calendar, Zap, Target, Sparkles } from 'lucide-react';

interface MealPlan {
  day: string;
  breakfast: { name: string; price: number; calories: number };
  lunch: { name: string; price: number; calories: number };
  dinner: { name: string; price: number; calories: number };
}

const SAMPLE_MEAL_PLANS: MealPlan[] = [
  {
    day: 'Monday',
    breakfast: { name: 'Idli Sambar', price: 35, calories: 285 },
    lunch: { name: 'Veg Fried Rice', price: 60, calories: 380 },
    dinner: { name: 'Paneer Butter Masala', price: 75, calories: 450 }
  },
  {
    day: 'Tuesday', 
    breakfast: { name: 'Masala Dosa', price: 45, calories: 320 },
    lunch: { name: 'Chicken Biryani', price: 85, calories: 520 },
    dinner: { name: 'Pav Bhaji', price: 50, calories: 420 }
  },
  {
    day: 'Wednesday',
    breakfast: { name: 'Rava Uttapam', price: 40, calories: 295 },
    lunch: { name: 'Paneer Butter Masala', price: 75, calories: 450 },
    dinner: { name: 'Masala Dosa', price: 45, calories: 320 }
  }
];

export function SmartMealPlanner() {
  const [weeklyBudget, setWeeklyBudget] = useState('1400');
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const healthGoalOptions = [
    { id: 'weight_loss', label: 'Weight Loss', icon: '🎯' },
    { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { id: 'brain_power', label: 'Brain Power', icon: '🧠' },
    { id: 'energy_boost', label: 'Energy Boost', icon: '⚡' },
    { id: 'budget_friendly', label: 'Budget Friendly', icon: '💰' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'high_protein', label: 'High Protein' },
    { id: 'low_calorie', label: 'Low Calorie' },
    { id: 'gluten_free', label: 'Gluten Free' }
  ];

  const handleHealthGoalChange = (goalId: string, checked: boolean) => {
    if (checked) {
      setHealthGoals(prev => [...prev, goalId]);
    } else {
      setHealthGoals(prev => prev.filter(id => id !== goalId));
    }
  };

  const handleDietaryChange = (restrictionId: string, checked: boolean) => {
    if (checked) {
      setDietaryRestrictions(prev => [...prev, restrictionId]);
    } else {
      setDietaryRestrictions(prev => prev.filter(id => id !== restrictionId));
    }
  };

  const generateMealPlan = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setGeneratedPlan(SAMPLE_MEAL_PLANS);
      setIsGenerating(false);
    }, 2000);
  };

  const totalWeeklyCost = generatedPlan.reduce((total, day) => 
    total + day.breakfast.price + day.lunch.price + day.dinner.price, 0
  );

  const totalWeeklyCalories = generatedPlan.reduce((total, day) => 
    total + day.breakfast.calories + day.lunch.calories + day.dinner.calories, 0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Smart Meal Planner
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get personalized meal recommendations based on your goals and budget
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget & Calorie Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Weekly Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value)}
                placeholder="1400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calorie Target</Label>
              <Input
                id="calories"
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                placeholder="2000"
              />
            </div>
          </div>

          {/* Health Goals */}
          <div className="space-y-3">
            <Label>Health Goals</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {healthGoalOptions.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal.id}
                    checked={healthGoals.includes(goal.id)}
                    onCheckedChange={(checked) => handleHealthGoalChange(goal.id, checked as boolean)}
                  />
                  <Label htmlFor={goal.id} className="text-sm flex items-center gap-1">
                    <span>{goal.icon}</span>
                    {goal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietaryRestrictions.includes(option.id)}
                    onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateMealPlan}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Perfect Meal Plan...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate Smart Meal Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Meal Plan */}
      {generatedPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Personalized Meal Plan
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Weekly Cost: ₹{totalWeeklyCost}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Weekly Calories: {totalWeeklyCalories}
              </Badge>
              <Badge 
                variant={totalWeeklyCost <= parseInt(weeklyBudget) ? "default" : "destructive"}
              >
                {totalWeeklyCost <= parseInt(weeklyBudget) ? 'Within Budget ✅' : 'Over Budget ⚠️'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedPlan.map((dayPlan, index) => (
                <Card key={index} className="border border-muted">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3 text-primary">{dayPlan.day}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Breakfast */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">🌅 Breakfast</div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium">{dayPlan.breakfast.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{dayPlan.breakfast.price} • {dayPlan.breakfast.calories} cal
                          </div>
                        </div>
                      </div>
                      
                      {/* Lunch */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">☀️ Lunch</div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium">{dayPlan.lunch.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{dayPlan.lunch.price} • {dayPlan.lunch.calories} cal
                          </div>
                        </div>
                      </div>
                      
                      {/* Dinner */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">🌙 Dinner</div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium">{dayPlan.dinner.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{dayPlan.dinner.price} • {dayPlan.dinner.calories} cal
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-muted flex justify-between text-sm">
                      <span>Daily Total:</span>
                      <span className="font-semibold">
                        ₹{dayPlan.breakfast.price + dayPlan.lunch.price + dayPlan.dinner.price} • 
                        {dayPlan.breakfast.calories + dayPlan.lunch.calories + dayPlan.dinner.calories} cal
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}