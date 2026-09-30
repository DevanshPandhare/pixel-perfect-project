export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type FoodCategory =
  | "North Indian"
  | "South Indian"
  | "Vegetarian"
  | "High Protein"
  | "Street Food"
  | "Homemade";

export interface FoodItem {
  id: string;
  name: string;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  categories: FoodCategory[];
}

export interface MealLog {
  id: string;
  date: string; // yyyy-MM-dd
  loggedAt: string; // ISO
  mealType: MealType;
  foodId: string;
  foodName: string;
  servings: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type WorkoutType = "Strength" | "Cardio" | "HIIT" | "Yoga" | "Walking";
export type Intensity = "Low" | "Moderate" | "High";

export interface ExercisePreset {
  id: string;
  name: string;
  type: WorkoutType;
  intensity: Intensity;
  defaultDuration: number;
  caloriesPerMinute: number;
  description: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  loggedAt: string;
  name: string;
  type: WorkoutType;
  durationMin: number;
  caloriesBurned: number;
  sets?: number;
  reps?: number;
  weightKg?: number;
  notes?: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
}

export type GoalType = "Fat Loss" | "Muscle Gain" | "Recomposition" | "Maintenance";
export type DietPreference = "Vegetarian" | "Non-Vegetarian" | "Eggetarian" | "Vegan";
export type ActivityLevel =
  | "Sedentary"
  | "Lightly Active"
  | "Moderately Active"
  | "Very Active"
  | "Athlete";

export interface UserGoal {
  name: string;
  age: number;
  gender: "Male" | "Female";
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  dietPreference: DietPreference;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTargetMl: number;
}

export interface GoalRecommendation {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  rationale: string;
}

export interface WaterLog {
  date: string;
  ml: number;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  activeMinutes: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: MealSuggestion[];
  createdAt: string;
}

export interface MealSuggestion {
  name: string;
  detail: string;
  calories: number;
  protein: number;
}

export interface ParsedFoodGuess {
  foodId: string;
  foodName: string;
  servings: number;
  servingUnit: string;
  calories: number;
  protein: number;
}
