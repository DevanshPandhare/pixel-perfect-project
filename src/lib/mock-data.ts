import type { FoodItem, MealLog, WorkoutLog } from "@/types";

export const FOODS: FoodItem[] = [
  { id: "f1", name: "Paneer Tikka", servingUnit: "plate (6 pcs)", calories: 290, protein: 18, carbs: 8, fat: 20, tags: ["High Protein", "Vegetarian", "North Indian"] },
  { id: "f2", name: "Dal Makhani", servingUnit: "katori", calories: 230, protein: 9, carbs: 24, fat: 11, tags: ["Vegetarian", "North Indian"] },
  { id: "f3", name: "Roti (Phulka)", servingUnit: "piece", calories: 85, protein: 3, carbs: 17, fat: 0.5, tags: ["Vegetarian", "North Indian"] },
  { id: "f4", name: "Masala Dosa", servingUnit: "piece", calories: 330, protein: 7, carbs: 48, fat: 12, tags: ["Vegetarian", "South Indian"] },
  { id: "f5", name: "Idli with Sambar", servingUnit: "2 idlis + katori", calories: 210, protein: 8, carbs: 38, fat: 3, tags: ["Vegetarian", "South Indian"] },
  { id: "f6", name: "Chicken Tikka", servingUnit: "plate (6 pcs)", calories: 260, protein: 32, carbs: 5, fat: 12, tags: ["High Protein", "Non-Veg", "North Indian"] },
  { id: "f7", name: "Rajma Chawal", servingUnit: "plate", calories: 420, protein: 14, carbs: 72, fat: 8, tags: ["Vegetarian", "North Indian"] },
  { id: "f8", name: "Moong Dal Chilla", servingUnit: "piece", calories: 140, protein: 9, carbs: 18, fat: 4, tags: ["High Protein", "Vegetarian"] },
  { id: "f9", name: "Egg Bhurji", servingUnit: "2 eggs", calories: 210, protein: 14, carbs: 4, fat: 15, tags: ["High Protein", "Non-Veg"] },
  { id: "f10", name: "Curd (Dahi)", servingUnit: "katori", calories: 100, protein: 6, carbs: 7, fat: 5, tags: ["Vegetarian"] },
  { id: "f11", name: "Upma", servingUnit: "katori", calories: 190, protein: 5, carbs: 30, fat: 6, tags: ["Vegetarian", "South Indian"] },
  { id: "f12", name: "Soya Chunks Curry", servingUnit: "katori", calories: 180, protein: 22, carbs: 12, fat: 5, tags: ["High Protein", "Vegetarian"] },
  { id: "f13", name: "Fish Curry (Kerala)", servingUnit: "katori", calories: 240, protein: 26, carbs: 6, fat: 12, tags: ["High Protein", "Non-Veg", "South Indian"] },
  { id: "f14", name: "Poha", servingUnit: "plate", calories: 250, protein: 5, carbs: 45, fat: 6, tags: ["Vegetarian"] },
];

export const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
export const dayOffset = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return fmtDate(d); };

const today = dayOffset(0);
const yday = dayOffset(1);

const m = (id: string, date: string, time: string, mealType: MealLog["mealType"], foodId: string, servings: number): MealLog => {
  const f = FOODS.find((x) => x.id === foodId)!;
  return { id, date, time, mealType, foodId, foodName: f.name, servings, servingUnit: f.servingUnit, calories: Math.round(f.calories * servings), protein: Math.round(f.protein * servings) };
};

export const INITIAL_MEALS: MealLog[] = [
  m("m1", today, "08:15", "Breakfast", "f8", 2),
  m("m2", today, "13:30", "Lunch", "f2", 1),
  m("m3", today, "13:30", "Lunch", "f3", 2),
  m("m4", today, "20:30", "Dinner", "f1", 1),
  m("m5", yday, "09:00", "Breakfast", "f5", 1),
  m("m6", yday, "14:00", "Lunch", "f7", 1),
  m("m7", yday, "21:00", "Dinner", "f6", 1),
  ...Array.from({ length: 5 }, (_, i) => m(`mh${i}`, dayOffset(i + 2), "13:00", "Lunch", "f7", 1 + (i % 3) * 0.5)),
  ...Array.from({ length: 5 }, (_, i) => m(`md${i}`, dayOffset(i + 2), "20:00", "Dinner", i % 2 ? "f12" : "f6", 1.5)),
];

export const INITIAL_WORKOUTS: WorkoutLog[] = [
  { id: "w1", date: today, time: "07:00", exercise: "Bench Press", type: "Strength", sets: 4, reps: 10, weightKg: 50, durationMin: 35, caloriesBurned: 210 },
  { id: "w2", date: yday, time: "18:30", exercise: "Running", type: "Cardio", durationMin: 30, caloriesBurned: 320 },
  { id: "w3", date: dayOffset(2), time: "06:30", exercise: "Surya Namaskar", type: "Yoga", durationMin: 25, caloriesBurned: 110 },
  { id: "w4", date: dayOffset(3), time: "07:00", exercise: "Squats", type: "Strength", sets: 5, reps: 8, weightKg: 60, durationMin: 40, caloriesBurned: 260 },
  { id: "w5", date: dayOffset(5), time: "18:00", exercise: "Cycling", type: "Cardio", durationMin: 45, caloriesBurned: 400 },
];

export function estimateCalories(type: WorkoutLog["type"], durationMin: number, weightKg = 0) {
  const perMin = type === "Cardio" ? 10 : type === "Strength" ? 6 : 4;
  return Math.round(durationMin * perMin + weightKg * 0.3);
}
