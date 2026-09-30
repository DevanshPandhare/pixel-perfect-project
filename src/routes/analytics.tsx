import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { dayOffset } from "@/lib/mock-data";
import { PageHeader } from "@/components/app/ui-bits";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — NutriPulse AI" },
      { name: "description", content: "Weekly trends for calories, protein and calories burned." },
      { property: "og:title", content: "Analytics — NutriPulse AI" },
      { property: "og:description", content: "Weekly trends for calories, protein and calories burned." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Analytics,
});

const tip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" } };

function Analytics() {
  const { meals, workouts, targets } = useStore();
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = dayOffset(6 - i);
    const dm = meals.filter((m) => m.date === d);
    return {
      day: new Date(d).toLocaleDateString("en-IN", { weekday: "short" }),
      calories: dm.reduce((a, m) => a + m.calories, 0),
      protein: dm.reduce((a, m) => a + m.protein, 0),
      burned: workouts.filter((w) => w.date === d).reduce((a, w) => a + w.caloriesBurned, 0),
    };
  });
  const avg = (k: "calories" | "protein" | "burned") => Math.round(data.reduce((a, d) => a + d[k], 0) / 7);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Analytics" subtitle="Last 7 days." />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[["Avg calories", avg("calories"), "kcal"], ["Avg protein", avg("protein"), "g"], ["Avg burned", avg("burned"), "kcal"]].map(([l, v, u]) => (
          <Card key={l}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="text-3xl font-bold tabular-nums">{v}<span className="ml-1 text-sm font-normal text-muted-foreground">{u}</span></p></CardContent></Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Calories vs goal</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><BarChart data={data}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} /><Tooltip {...tip} cursor={{ fill: "var(--muted)" }} /><ReferenceLine y={targets.calories} stroke="var(--warning)" strokeDasharray="4 4" /><Bar dataKey="calories" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Protein & burn trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><LineChart data={data}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} /><Tooltip {...tip} /><Line dataKey="protein" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} /><Line dataKey="burned" stroke="var(--chart-4)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
