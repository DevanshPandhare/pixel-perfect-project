import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Flame, Timer, Dumbbell, Coffee, Sun, Moon, Cookie, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore, useDayTotals } from "@/lib/store";
import { PageHeader, Ring, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NutriPulse AI" },
      { name: "description", content: "Your daily calories, protein, workouts and water at a glance." },
      { property: "og:title", content: "Dashboard — NutriPulse AI" },
      { property: "og:description", content: "Your daily calories, protein, workouts and water at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const mealIcon = { Breakfast: Coffee, Lunch: Sun, Dinner: Moon, Snack: Cookie };

function Dashboard() {
  const { targets, addWater, openMeal, setWorkoutDialogOpen, removeMeal, removeWorkout, clearMeals, selectedDate, profile } = useStore();
  const t = useDayTotals();
  const remaining = Math.max(targets.calories - t.calories + t.burned, 0);

  const timeline = [
    ...t.meals.map((m) => ({ kind: "meal" as const, time: m.time, m })),
    ...t.workouts.map((w) => ({ kind: "workout" as const, time: w.time, w })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={`Namaste, ${profile.name} 👋`} subtitle="Here's how your day is shaping up." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Calorie budget</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-6">
            <Ring value={t.calories} max={targets.calories + t.burned} color="var(--primary)">
              <div><p className="text-3xl font-extrabold tabular-nums">{remaining}</p><p className="text-xs text-muted-foreground">kcal left</p></div>
            </Ring>
            <dl className="grid flex-1 gap-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Goal</dt><dd className="font-semibold tabular-nums">{targets.calories}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Consumed</dt><dd className="font-semibold tabular-nums">{t.calories}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Burned</dt><dd className="font-semibold tabular-nums text-primary">+{t.burned}</dd></div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Protein target</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-6">
            <Ring value={t.protein} max={targets.protein} color="var(--ai)">
              <div><p className="text-3xl font-extrabold tabular-nums">{t.protein}<span className="text-base text-muted-foreground">g</span></p><p className="text-xs text-muted-foreground">of {targets.protein}g</p></div>
            </Ring>
            <div className="flex-1 space-y-2 text-sm">
              <p className="text-muted-foreground">{t.protein >= targets.protein ? "Target hit — great job!" : `${targets.protein - t.protein}g to go. Try paneer, soya or dal.`}</p>
              <Button size="sm" variant="secondary" onClick={() => openMeal()}>Log a meal</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-12 place-items-center rounded-xl bg-accent text-primary"><Timer className="size-6" /></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Workouts logged</p>
              <p className="text-2xl font-bold tabular-nums">{t.workouts.length} <span className="text-sm font-normal text-muted-foreground">· {t.activeMin} active min</span></p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setWorkoutDialogOpen(true)}>Log</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-12 place-items-center rounded-xl bg-muted text-water"><Droplets className="size-6" /></div>
            <div className="flex-1 space-y-1.5">
              <p className="text-sm text-muted-foreground">Water intake</p>
              <p className="text-2xl font-bold tabular-nums">{(t.water / 1000).toFixed(2)}L <span className="text-sm font-normal text-muted-foreground">/ {targets.waterMl / 1000}L</span></p>
              <Progress value={(t.water / targets.waterMl) * 100} className="h-1.5" />
            </div>
            <Button size="sm" onClick={() => { addWater(250); toast.success("+250 ml water"); }}>+250ml</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Today's timeline</CardTitle>
          {t.meals.length > 0 && <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => { clearMeals(selectedDate); toast("Meals cleared for this day"); }}>Clear meals</Button>}
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <EmptyState icon={<Flame className="size-5" />} title="No meals logged yet today. Click here to add one!" cta="Log a meal" onClick={() => openMeal()} />
          ) : (
            <ol className="relative space-y-1 border-l pl-6">
              {timeline.map((e) => {
                const Icon = e.kind === "meal" ? mealIcon[e.m.mealType] : Dumbbell;
                return (
                  <li key={e.kind + (e.kind === "meal" ? e.m.id : e.w.id)} className="group relative flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
                    <span className={`absolute -left-[37px] grid size-6 place-items-center rounded-full border bg-card ${e.kind === "workout" ? "text-ai" : "text-primary"}`}><Icon className="size-3.5" /></span>
                    <span className="w-12 text-xs tabular-nums text-muted-foreground">{e.time}</span>
                    {e.kind === "meal" ? (
                      <div className="flex-1"><p className="text-sm font-medium">{e.m.foodName} <span className="text-muted-foreground">· {e.m.servings} {e.m.servingUnit}</span></p><p className="text-xs text-muted-foreground">{e.m.mealType} · {e.m.calories} kcal · {e.m.protein}g protein</p></div>
                    ) : (
                      <div className="flex-1"><p className="text-sm font-medium">{e.w.exercise}</p><p className="text-xs text-muted-foreground">{e.w.type} · {e.w.durationMin} min · −{e.w.caloriesBurned} kcal</p></div>
                    )}
                    <Button size="icon" variant="ghost" className="size-8 opacity-0 group-hover:opacity-100" onClick={() => (e.kind === "meal" ? removeMeal(e.m.id) : removeWorkout(e.w.id))}><Trash2 className="size-4" /></Button>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
