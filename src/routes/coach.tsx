import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Wand2, Loader2, Send, Bot, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/app/ui-bits";
import type { ActivityLevel, ChatMessage, GoalType } from "@/types";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — NutriPulse AI" },
      { name: "description", content: "Generate a personalised calorie and protein plan and chat with your AI nutrition coach." },
      { property: "og:title", content: "AI Coach — NutriPulse AI" },
      { property: "og:description", content: "Generate a personalised calorie and protein plan and chat with your AI nutrition coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Coach,
});

const MULT: Record<ActivityLevel, number> = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, "Very Active": 1.725 };

function mockReply(q: string) {
  const s = q.toLowerCase();
  if (s.includes("dinner") || s.includes("veg")) return "Try **Soya Chunks Curry (1 katori) + 2 Rotis + Cucumber Raita** — about 450 kcal and 32g protein. Or Paneer Bhurji with a Moong Dal Chilla for ~35g protein.";
  if (s.includes("breakfast")) return "A strong desi breakfast: **2 Moong Dal Chillas + 1 katori Dahi** ≈ 380 kcal, 24g protein. South Indian? Go for Pesarattu with peanut chutney.";
  if (s.includes("protein")) return "Top vegetarian protein sources: paneer (18g/100g), soya chunks (52g/100g dry), Greek dahi, moong dal and chana. Spread 25–30g across each meal.";
  return "Great question! Aim for balanced thalis: half plate sabzi, a quarter dal/paneer, a quarter roti or rice. Want me to suggest meals for a specific time of day?";
}

function Coach() {
  const { profile, setProfile, targets, setTargets } = useStore();
  const [form, setForm] = useState({ age: String(profile.age), weight: String(profile.weightKg), height: String(profile.heightCm), activity: profile.activity, goal: profile.goal });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ calories: number; protein: number } | null>(null);

  const generate = () => {
    const a = Number(form.age), w = Number(form.weight), h = Number(form.height);
    const e: Record<string, string> = {};
    if (!a || a < 14 || a > 90) e.age = "14–90";
    if (!w || w < 30 || w > 250) e.weight = "30–250 kg";
    if (!h || h < 120 || h > 230) e.height = "120–230 cm";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true); setPlan(null);
    setTimeout(() => {
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      const tdee = bmr * MULT[form.activity];
      const calories = Math.round((form.goal === "Fat Loss" ? tdee - 450 : tdee + 300) / 10) * 10;
      const protein = Math.round(w * (form.goal === "Fat Loss" ? 1.8 : 2));
      setPlan({ calories, protein });
      setProfile({ ...profile, age: a, weightKg: w, heightCm: h, activity: form.activity, goal: form.goal });
      setLoading(false);
    }, 1600);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="AI Coach" subtitle="Personal targets and desi nutrition advice." />
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Your goals</CardTitle><CardDescription>We'll compute calorie and protein targets.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {([["age", "Age"], ["weight", "Weight (kg)"], ["height", "Height (cm)"]] as const).map(([k, l]) => (
                <div key={k} className="grid gap-1.5"><Label className="text-xs">{l}</Label><Input type="number" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />{errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}</div>
              ))}
            </div>
            <div className="grid gap-1.5"><Label className="text-xs">Activity level</Label>
              <Select value={form.activity} onValueChange={(v) => setForm({ ...form, activity: v as ActivityLevel })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(MULT).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["Fat Loss", "Muscle Gain"] as GoalType[]).map((g) => (
                <Button key={g} type="button" variant={form.goal === g ? "default" : "secondary"} onClick={() => setForm({ ...form, goal: g })}>{g}</Button>
              ))}
            </div>
            <Button className="w-full border-0 text-ai-foreground" style={{ background: "var(--gradient-ai)" }} onClick={generate} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Analysing your profile…</> : <><Wand2 className="mr-2 size-4" />Generate AI Plan</>}
            </Button>
            {plan && (
              <div className="rounded-xl border border-ai/40 bg-ai-soft/40 p-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs uppercase tracking-wider text-ai">Your AI plan</p>
                <p className="mt-1 text-xl font-bold">Target: {plan.calories} kcal, {plan.protein}g Protein</p>
                <p className="mt-1 text-xs text-muted-foreground">Currently: {targets.calories} kcal, {targets.protein}g</p>
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => { setTargets({ ...targets, ...plan }); toast.success("Targets updated on your dashboard"); }}><Check className="mr-1 size-4" />Apply to dashboard</Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Chat />
      </div>
    </div>
  );
}

function Chat() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([{ id: "0", role: "assistant", content: "Hi! I'm your NutriPulse coach. Ask me anything about Indian meals, protein or workouts." }]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [msgs, typing]);

  const send = (q: string) => {
    const v = q.trim();
    if (!v || typing) return;
    setMsgs((p) => [...p, { id: crypto.randomUUID(), role: "user", content: v }]);
    setText(""); setTyping(true);
    setTimeout(() => { setMsgs((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: mockReply(v) }]); setTyping(false); input.current?.focus(); }, 1100);
  };

  const render = (s: string) => s.split(/(\*\*[^*]+\*\*)/).map((p, i) => p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p);

  return (
    <Card className="flex h-[640px] flex-col">
      <CardHeader className="flex-row items-center gap-3 space-y-0 border-b">
        <div className="grid size-9 place-items-center rounded-full text-ai-foreground" style={{ background: "var(--gradient-ai)" }}><Bot className="size-5" /></div>
        <div><CardTitle className="text-base">Coach Priya</CardTitle><CardDescription className="text-xs">AI nutrition coach · demo replies</CardDescription></div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <div className={m.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground" : "max-w-[85%] text-sm leading-relaxed"}>{render(m.content)}</div>
          </div>
        ))}
        {typing && <div className="flex gap-1 py-2">{[0, 1, 2].map((i) => <span key={i} className="size-2 animate-bounce rounded-full bg-ai" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
        <div ref={end} />
      </CardContent>
      <div className="space-y-2 border-t p-3">
        <div className="flex flex-wrap gap-2">
          {["What's a high-protein veg Indian dinner?", "Best desi breakfast?", "Veg protein sources"].map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-ai/40 px-3 py-1 text-xs text-ai hover:bg-ai-soft/40">{s}</button>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <Input ref={input} autoFocus placeholder="Ask your coach…" value={text} onChange={(e) => setText(e.target.value)} maxLength={500} />
          <Button type="submit" size="icon" disabled={!text.trim() || typing}><Send className="size-4" /></Button>
        </form>
      </div>
    </Card>
  );
}
