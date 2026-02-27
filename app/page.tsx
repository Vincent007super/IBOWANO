"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createTimeline } from "animejs";
import TaskModal, { PriorityLevel, TaskPayload } from "@/components/TaskModal";
import TaskList, { Task } from "@/components/TaskList";

const priorityLabels: Record<PriorityLevel, string> = {
  nit: "Nit",
  soon: "Finish soon",
  asap: "Finish ASAP",
  yesterday: "Needed yesterday",
};

const priorityNotes: Record<PriorityLevel, string> = {
  nit: "Should be done eventually, but no rush. Keep it on the radar without pressure.",
  soon: "When you have a moment, this would be a great one to wrap up.",
  asap: "Get it together, this must be prioritized and finished.",
  yesterday: "STRAIGHT PANIC MODE. Drop everything and fix NOW.",
};

const priorityOrder: Record<PriorityLevel, number> = {
  nit: 0,
  soon: 1,
  asap: 2,
  yesterday: 3,
};

const STORAGE_KEY = "ibowano_tasks";

function formatDeadline(deadline: string) {
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return deadline;
  }

  return parsed.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseDeadline(deadline: string) {
  const time = new Date(deadline).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function pickTopTask(tasks: Task[]) {
  if (!tasks.length) return null;

  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return parseDeadline(a.deadline) - parseDeadline(b.deadline);
  })[0];
}

function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (task) =>
            task &&
            typeof task.title === "string" &&
            typeof task.problem === "string" &&
            typeof task.deadline === "string" &&
            typeof task.priority === "string",
        )
        .map((task) => ({
          ...task,
          id: task.id ?? createTaskId(),
        }));
    } catch (error) {
      console.warn("Could not load stored tasks", error);
      return [];
    }
  });
  const [view, setView] = useState<"home" | "list">("home");
  const frameRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);

  const topTask = useMemo(() => pickTopTask(tasks), [tasks]);
  const readableDeadline = topTask?.deadline ? formatDeadline(topTask.deadline) : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const animateTo = useCallback(
    (target: "home" | "list") => {
      if (!frameRef.current || target === view || isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;
      const translateX = target === "list" ? "-100vw" : "0vw";

      createTimeline({
        onComplete: () => {
          isTransitioningRef.current = false;
          setView(target);
        },
      })
        .add(frameRef.current, {
          scale: 0.92,
          duration: 220,
          easing: "easeInOutQuad",
        })
        .add(frameRef.current, {
          translateX,
          duration: 520,
          easing: "easeInOutCubic",
        })
        .add(frameRef.current, {
          scale: 1,
          duration: 240,
          easing: "easeOutCubic",
        });
    },
    [view],
  );

  const toggleView = useCallback(() => {
    animateTo(view === "home" ? "list" : "home");
  }, [animateTo, view]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        toggleView();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleView]);

  const handleNewTask = (payload: TaskPayload) => {
    const newTask: Task = { ...payload, id: createTaskId() };
    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.07),transparent_30%)]" />

      <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => animateTo("home")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition active:opacity-60 ${
            view === "home"
              ? "border-cyan-300/70 bg-cyan-400/20 text-white"
              : "border-white/20 bg-white/10 text-slate-200 hover:border-white/40"
          }`}
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => animateTo("list")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition active:opacity-60 ${
            view === "list"
              ? "border-cyan-300/70 bg-cyan-400/20 text-white"
              : "border-white/20 bg-white/10 text-slate-200 hover:border-white/40"
          }`}
        >
          List
        </button>
      </div>

      <div className="fixed left-4 top-4 z-40 text-xs text-slate-300">
        Press <span className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px]">D</span> to toggle views
      </div>

      <div
        ref={frameRef}
        className="flex min-h-screen w-[200vw] transform-gpu"
        style={{ transform: "translateX(0vw) scale(1)" }}
      >
        <section className="flex w-screen justify-center">
          <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14">
            <header className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">IBOWANO</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                I am Behind On Work And Need Organisation
              </h1>
              <p className="max-w-3xl text-base text-slate-200/80">
                Launch the fast modal, capture the essentials, then glide over to the list on the right to triage
                everything. Keyboard shortcut: hit D to travel there and back.
              </p>
            </header>

            <div className="grid gap-5 sm:grid-cols-[1.2fr_0.8fr]">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-cyan-300/50 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-7 py-8 text-left text-slate-950 shadow-2xl shadow-cyan-400/30 transition hover:-translate-y-1 hover:shadow-cyan-300/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 active:opacity-80"
              >
                <div className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-cyan-100">Quick modal</span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-slate-950">Title / Problem / Deadline / Priority</span>
                  </div>
                  <div className="text-3xl font-semibold leading-tight sm:text-4xl">Add a problem</div>
                  <p className="max-w-2xl text-sm text-slate-900/80 sm:text-base">
                    One large button, one sleek modal. Add the essentials in under a minute and hand it off with confidence.
                  </p>
                </div>
              </button>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300">Ready-made flow</p>
                    <h2 className="text-xl font-semibold text-white">Stay fast and clear</h2>
                  </div>
                  <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                    30s setup
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-200/85">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                    <p>Quickly add a problem and get it out of your head.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <p>Priority ladder ranges from a tiny nit to a task that should have shipped yesterday.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" />
                    <p>Problems get saved locally, so even if you are not logged in they are still there.</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-cyan-500/10 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300">Highest priority</p>
                  <h2 className="text-xl font-semibold text-white">
                    {priorityLabels[topTask?.priority ?? "soon"]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => animateTo("list")}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/15 active:opacity-70"
                >
                  View list
                </button>
              </div>

              {topTask ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Title</p>
                    <p className="text-lg font-semibold text-white">{topTask.title}</p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Finish by</p>
                    <p className="text-lg font-semibold text-white">{readableDeadline}</p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Problem</p>
                    <p className="whitespace-pre-line text-sm text-slate-200">{topTask.problem}</p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Priority</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-cyan-300/60 bg-cyan-400/20 px-3 py-1 text-sm font-semibold text-white">
                        {priorityLabels[topTask.priority]}
                      </span>
                      <span className="text-sm text-slate-200/85">
                        {priorityNotes[topTask.priority]}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-200/80">
                  No tasks captured yet. Tap the large button above to add a title, problem, deadline, and priority in a single sweep.
                </div>
              )}
            </section>
          </main>
        </section>

        <section className="flex w-screen items-stretch">
          <TaskList tasks={tasks} />
        </section>
      </div>

      {isModalOpen ? (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewTask}
        />
      ) : null}
    </div>
  );
}
