export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type FoodTag = "High Protein" | "Vegetarian" | "South Indian" | "North Indian" | "Non-Veg";

export interface FoodItem {
  id: string;
  name: string;
  servingUnit: string; // e.g. "katori", "piece"
  calories: number; // per serving
  protein: number;
  carbs: number;
  fat: number;
  tags: FoodTag[];
}

export interface MealLog {
  id: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  mealType: MealType;
  foodId: string;
  foodName: string;
  servings: number;
  servingUnit: string;
  calories: number;
  protein: number;
}

export type WorkoutType = "Strength" | "Cardio" | "Yoga";

export interface WorkoutLog {
  id: string;
  date: string;
  time: string;
  exercise: string;
  type: WorkoutType;
  sets?: number;
  reps?: number;
  weightKg?: number | undefined;
  durationMin: number;
  caloriesBurned: number;
}

export type GoalType = "Fat Loss" | "Muscle Gain";
export type ActivityLevel = "Sedentary" | "Light" | "Moderate" | "Very Active";

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: GoalType;
}

export interface Targets {
  calories: number;
  protein: number;
  waterMl: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
