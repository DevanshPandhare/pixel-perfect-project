import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, SearchX, UtensilsCrossed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FOODS } from "@/lib/mock-data";
import { useStore, useDayTotals } from "@/lib/store";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";
import type { FoodTag } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/meals")({
  head: () => ({
    meta: [
      { title: "Meal Logger — NutriPulse AI" },
      { name: "description", content: "Search Indian foods and log meals with instant calorie and protein math." },
      { property: "og:title", content: "Meal Logger — NutriPulse AI" },
      { property: "og:description", content: "Search Indian foods and log meals with instant calorie and protein math." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Meals,
});

const CHIPS: FoodTag[] = ["High Protein", "Vegetarian", "South Indian", "North Indian", "Non-Veg"];

function Meals() {
  const [q, setQ] = useState("");
  const [tags, setTags] = useState<FoodTag[]>([]);
  const { openMeal, removeMeal } = useStore();
  const { meals } = useDayTotals();

  const list = FOODS.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()) && tags.every((t) => f.tags.includes(t)));
  const toggle = (t: FoodTag) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Meal Logger" subtitle="Desi food database with katori-level precision." action={<Button onClick={() => openMeal()}><Plus className="mr-1 size-4" />Log food</Button>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search paneer, dosa, dal…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((t) => (
              <button key={t} onClick={() => toggle(t)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", tags.includes(t) ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{t}</button>
            ))}
          </div>
          {list.length === 0 ? (
            <EmptyState icon={<SearchX className="size-5" />} title="No dishes match. Try a different search or clear filters." cta="Clear filters" onClick={() => { setQ(""); setTags([]); }} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((f) => (
                <Card key={f.id} className="transition-colors hover:border-primary/50">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex-1">
                      <p className="font-semibold">{f.name}</p>
                      <p className="text-xs text-muted-foreground">per {f.servingUnit}</p>
                      <div className="mt-2 flex gap-3 text-xs tabular-nums">
                        <span><b>{f.calories}</b> kcal</span>
                        <span className="text-protein"><b>{f.protein}g</b> P</span>
                        <span className="text-carbs">{f.carbs}g C</span>
                        <span className="text-fat">{f.fat}g F</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">{f.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                    </div>
                    <Button size="icon" variant="secondary" onClick={() => openMeal(f.id)} aria-label={`Log ${f.name}`}><Plus className="size-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Logged this day</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {meals.length === 0 ? (
              <EmptyState icon={<UtensilsCrossed className="size-5" />} title="No meals logged yet today. Click here to add one!" cta="Add meal" onClick={() => openMeal()} />
            ) : meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
                <div><p className="font-medium">{m.foodName}</p><p className="text-xs text-muted-foreground">{m.mealType} · {m.servings} {m.servingUnit}</p></div>
                <div className="text-right"><p className="tabular-nums">{m.calories} kcal</p><button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => removeMeal(m.id)}>Remove</button></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
