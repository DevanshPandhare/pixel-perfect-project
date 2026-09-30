import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { FOODS, estimateCalories } from "@/lib/mock-data";
import type { MealType, WorkoutType } from "@/types";

const nowTime = () => new Date().toTimeString().slice(0, 5);

export function LogMealDialog() {
  const { mealDialogOpen, setMealDialogOpen, addMeal, selectedDate, prefillFoodId: foodId } = useStore();
  const [fid, setFid] = useState(foodId ?? "");
  const [mealType, setMealType] = useState<MealType | "">("");
  const [servings, setServings] = useState("1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (mealDialogOpen) { setFid(foodId ?? ""); setServings("1"); setErrors({}); } }, [mealDialogOpen, foodId]);

  const food = FOODS.find((f) => f.id === fid);
  const s = parseFloat(servings);
  const valid = !isNaN(s) && s > 0;
  const kcal = food && valid ? Math.round(food.calories * s) : 0;
  const prot = food && valid ? Math.round(food.protein * s) : 0;

  const save = () => {
    const e: Record<string, string> = {};
    if (!food) e.food = "Choose a food";
    if (!mealType) e.meal = "Pick a meal type";
    if (!valid || s > 10) e.servings = "Enter a serving between 0.25 and 10";
    setErrors(e);
    if (Object.keys(e).length || !food || !mealType) return;
    addMeal({ date: selectedDate, time: nowTime(), mealType, foodId: food.id, foodName: food.name, servings: s, servingUnit: food.servingUnit, calories: kcal, protein: prot });
    toast.success(`${food.name} logged`, { description: `${kcal} kcal · ${prot}g protein added to ${mealType}` });
    setMealDialogOpen(false);
  };

  return (
    <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log food</DialogTitle>
          <DialogDescription>Calories and protein update as you adjust the serving.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Food</Label>
            <Select value={fid} onValueChange={setFid}>
              <SelectTrigger><SelectValue placeholder="Select a dish" /></SelectTrigger>
              <SelectContent>{FOODS.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
            {errors.food && <p className="text-xs text-destructive">{errors.food}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Meal</Label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                <SelectTrigger><SelectValue placeholder="Meal type" /></SelectTrigger>
                <SelectContent>{(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              {errors.meal && <p className="text-xs text-destructive">{errors.meal}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label>Servings {food && <span className="text-muted-foreground">({food.servingUnit})</span>}</Label>
              <Input type="number" step="0.25" min="0.25" value={servings} onChange={(e) => setServings(e.target.value)} />
              {errors.servings && <p className="text-xs text-destructive">{errors.servings}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {[0.5, 1, 1.5, 2].map((v) => (
              <Button key={v} type="button" size="sm" variant={s === v ? "default" : "secondary"} onClick={() => setServings(String(v))}>{v}×</Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-4">
            <div><p className="text-xs text-muted-foreground">Calories</p><p className="text-2xl font-bold tabular-nums">{kcal}<span className="ml-1 text-sm font-normal text-muted-foreground">kcal</span></p></div>
            <div><p className="text-xs text-muted-foreground">Protein</p><p className="text-2xl font-bold tabular-nums text-protein">{prot}<span className="ml-1 text-sm font-normal text-muted-foreground">g</span></p></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setMealDialogOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save meal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LogWorkoutDialog() {
  const { workoutDialogOpen, setWorkoutDialogOpen, addWorkout, selectedDate } = useStore();
  const [exercise, setExercise] = useState("");
  const [type, setType] = useState<WorkoutType>("Strength");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("30");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (workoutDialogOpen) { setExercise(""); setErrors({}); } }, [workoutDialogOpen]);

  const est = useMemo(() => estimateCalories(type, Number(duration) || 0, Number(weight) || 0), [type, duration, weight]);

  const save = () => {
    const e: Record<string, string> = {};
    if (exercise.trim().length < 2) e.exercise = "Name the exercise";
    const d = Number(duration);
    if (!d || d < 1 || d > 300) e.duration = "1–300 minutes";
    if (type === "Strength") {
      if (!Number(sets) || Number(sets) < 1) e.sets = "Min 1";
      if (!Number(reps) || Number(reps) < 1) e.reps = "Min 1";
      if (weight && (Number(weight) < 0 || Number(weight) > 500)) e.weight = "0–500 kg";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    addWorkout({
      date: selectedDate, time: nowTime(), exercise: exercise.trim(), type, durationMin: d, caloriesBurned: est,
      ...(type === "Strength" ? { sets: Number(sets), reps: Number(reps), weightKg: weight ? Number(weight) : undefined } : {}),
    });
    toast.success(`${exercise.trim()} logged`, { description: `${d} min · ~${est} kcal burned` });
    setWorkoutDialogOpen(false);
  };

  const Err = ({ k }: { k: string }) => errors[k] ? <p className="text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <Dialog open={workoutDialogOpen} onOpenChange={setWorkoutDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log workout</DialogTitle>
          <DialogDescription>Calories burned are estimated from type and duration.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Exercise</Label>
              <Input placeholder="e.g. Deadlift" value={exercise} onChange={(e) => setExercise(e.target.value)} maxLength={60} />
              <Err k="exercise" />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as WorkoutType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Strength", "Cardio", "Yoga"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {type === "Strength" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5"><Label>Sets</Label><Input type="number" value={sets} onChange={(e) => setSets(e.target.value)} /><Err k="sets" /></div>
              <div className="grid gap-1.5"><Label>Reps</Label><Input type="number" value={reps} onChange={(e) => setReps(e.target.value)} /><Err k="reps" /></div>
              <div className="grid gap-1.5"><Label>Weight (kg)</Label><Input type="number" value={weight} placeholder="0" onChange={(e) => setWeight(e.target.value)} /><Err k="weight" /></div>
            </div>
          )}
          <div className="grid gap-1.5"><Label>Duration (min)</Label><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /><Err k="duration" /></div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">Estimated burn</p>
            <p className="text-2xl font-bold tabular-nums text-primary">~{est} <span className="text-sm font-normal text-muted-foreground">kcal</span></p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setWorkoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save workout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
