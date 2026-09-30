import { createContext, useContext, useState, type ReactNode } from "react";
import type { MealLog, WorkoutLog, Targets, UserProfile } from "@/types";
import { INITIAL_MEALS, INITIAL_WORKOUTS, dayOffset } from "./mock-data";

interface Store {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  meals: MealLog[];
  addMeal: (m: Omit<MealLog, "id">) => void;
  removeMeal: (id: string) => void;
  clearMeals: (date: string) => void;
  workouts: WorkoutLog[];
  addWorkout: (w: Omit<WorkoutLog, "id">) => void;
  removeWorkout: (id: string) => void;
  water: Record<string, number>;
  addWater: (ml: number) => void;
  targets: Targets;
  setTargets: (t: Targets) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  mealDialogOpen: boolean;
  setMealDialogOpen: (o: boolean) => void;
  prefillFoodId?: string;
  openMeal: (foodId?: string) => void;
  workoutDialogOpen: boolean;
  setWorkoutDialogOpen: (o: boolean) => void;
}

const Ctx = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(dayOffset(0));
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [water, setWater] = useState<Record<string, number>>({ [dayOffset(0)]: 1250, [dayOffset(1)]: 2500 });
  const [targets, setTargets] = useState<Targets>({ calories: 2000, protein: 110, waterMl: 3000 });
  const [profile, setProfile] = useState<UserProfile>({ name: "Devansh", age: 26, weightKg: 72, heightCm: 175, activity: "Moderate", goal: "Muscle Gain" });
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [prefillFoodId, setPrefill] = useState<string>();

  const value: Store = {
    selectedDate, setSelectedDate,
    meals,
    addMeal: (m) => setMeals((p) => [...p, { ...m, id: uid() }]),
    removeMeal: (id) => setMeals((p) => p.filter((x) => x.id !== id)),
    clearMeals: (date) => setMeals((p) => p.filter((x) => x.date !== date)),
    workouts,
    addWorkout: (w) => setWorkouts((p) => [...p, { ...w, id: uid() }]),
    removeWorkout: (id) => setWorkouts((p) => p.filter((x) => x.id !== id)),
    water,
    addWater: (ml) => setWater((p) => ({ ...p, [selectedDate]: (p[selectedDate] ?? 0) + ml })),
    targets, setTargets, profile, setProfile,
    mealDialogOpen, setMealDialogOpen, prefillFoodId,
    openMeal: (f) => { setPrefill(f); setMealDialogOpen(true); }, workoutDialogOpen, setWorkoutDialogOpen,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function useDayTotals(date?: string) {
  const s = useStore();
  const d = date ?? s.selectedDate;
  const meals = s.meals.filter((m) => m.date === d);
  const workouts = s.workouts.filter((w) => w.date === d);
  return {
    meals, workouts,
    calories: meals.reduce((a, m) => a + m.calories, 0),
    protein: meals.reduce((a, m) => a + m.protein, 0),
    burned: workouts.reduce((a, w) => a + w.caloriesBurned, 0),
    activeMin: workouts.reduce((a, w) => a + w.durationMin, 0),
    water: s.water[d] ?? 0,
  };
}
