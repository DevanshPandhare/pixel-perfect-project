import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, UtensilsCrossed, Dumbbell, Bot, BarChart3, PanelLeftClose, PanelLeftOpen, Plus, Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { dayOffset } from "@/lib/mock-data";
import { LogMealDialog, LogWorkoutDialog } from "./dialogs";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meals", label: "Meal Logger", icon: UtensilsCrossed },
  { to: "/workouts", label: "Workout Tracker", icon: Dumbbell },
  { to: "/coach", label: "AI Coach", icon: Bot },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

function NavList({ collapsed, onNav }: { collapsed?: boolean; onNav?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNav}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          activeProps={{ className: "bg-sidebar-accent !text-sidebar-foreground font-medium" }}
          title={label}
        >
          <Icon className={cn("size-5 shrink-0", to === "/coach" && "text-ai")} />
          {!collapsed && <span>{label}</span>}
        </Link>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex h-16 items-center gap-2 px-5">
      <div className="grid size-8 place-items-center rounded-lg" style={{ background: "var(--gradient-vital)" }}>
        <Activity className="size-4 text-primary-foreground" />
      </div>
      {!collapsed && <span className="font-bold tracking-tight">NutriPulse <span className="text-ai">AI</span></span>}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedDate, setSelectedDate, setMealDialogOpen, setWorkoutDialogOpen, addWater, profile } = useStore();

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all md:flex", collapsed ? "w-[72px]" : "w-60")}>
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <div className="mt-auto p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <PanelLeftOpen className="size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}
          </Button>
        </div>
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="dark w-64 bg-sidebar p-0 text-foreground">
          <Brand />
          <NavList onNav={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></Button>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent className="dark">
              {Array.from({ length: 7 }, (_, i) => {
                const d = dayOffset(i);
                const label = i === 0 ? "Today" : i === 1 ? "Yesterday" : new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                return <SelectItem key={d} value={d}>{label}</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5"><Plus className="size-4" /> Quick Log</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark">
                <DropdownMenuItem onClick={() => setMealDialogOpen(true)}><UtensilsCrossed className="mr-2 size-4" />Log meal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkoutDialogOpen(true)}><Dumbbell className="mr-2 size-4" />Log workout</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addWater(250)}>💧 Add 250 ml water</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="size-9 border"><AvatarFallback className="bg-ai-soft text-ai">{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <LogMealDialog />
      <LogWorkoutDialog />
    </div>
  );
}
