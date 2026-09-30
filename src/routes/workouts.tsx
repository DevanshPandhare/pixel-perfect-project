import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Plus, Trash2, HeartPulse, Flower2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workout Tracker — NutriPulse AI" },
      { name: "description", content: "Log strength, cardio and yoga sessions and see calories burned." },
      { property: "og:title", content: "Workout Tracker — NutriPulse AI" },
      { property: "og:description", content: "Log strength, cardio and yoga sessions and see calories burned." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workouts,
});

const icons = { Strength: Dumbbell, Cardio: HeartPulse, Yoga: Flower2 };

function Workouts() {
  const { workouts, setWorkoutDialogOpen, removeWorkout } = useStore();
  const sorted = [...workouts].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const week = workouts.filter((w) => Date.now() - new Date(w.date).getTime() < 7 * 864e5);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Workout Tracker" subtitle="Every rep counts." action={<Button onClick={() => setWorkoutDialogOpen(true)}><Plus className="mr-1 size-4" />Log workout</Button>} />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[
          ["Sessions (7d)", week.length],
          ["Active minutes (7d)", week.reduce((a, w) => a + w.durationMin, 0)],
          ["Calories burned (7d)", week.reduce((a, w) => a + w.caloriesBurned, 0)],
        ].map(([l, v]) => (
          <Card key={l as string}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="text-3xl font-bold tabular-nums">{v}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent workouts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sorted.length === 0 ? (
            <EmptyState icon={<Dumbbell className="size-5" />} title="No workouts yet. Log your first session!" cta="Log workout" onClick={() => setWorkoutDialogOpen(true)} />
          ) : sorted.map((w) => {
            const Icon = icons[w.type];
            return (
              <div key={w.id} className="group flex items-center gap-4 rounded-lg border p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-5" /></div>
                <div className="flex-1">
                  <p className="font-medium">{w.exercise} <Badge variant="secondary" className="ml-1 text-[10px]">{w.type}</Badge></p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {w.durationMin} min
                    {w.sets ? ` · ${w.sets}×${w.reps}` : ""}{w.weightKg ? ` @ ${w.weightKg}kg` : ""}
                  </p>
                </div>
                <p className="font-semibold tabular-nums text-primary">{w.caloriesBurned} kcal</p>
                <Button size="icon" variant="ghost" className="size-8 opacity-0 group-hover:opacity-100" onClick={() => removeWorkout(w.id)}><Trash2 className="size-4" /></Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
