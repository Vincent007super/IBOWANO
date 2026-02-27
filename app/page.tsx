"use client";

import { useState } from "react";
import TaskModal, { PriorityLevel, TaskPayload } from "@/components/TaskModal";

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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestTask, setLatestTask] = useState<TaskPayload | null>(null);

  const readableDeadline = latestTask?.deadline
    ? formatDeadline(latestTask.deadline)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">IBOWANO</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            I'm Behind On Work And Need Organisation
          </h1>
          <p className="max-w-3xl text-base text-slate-200/80">
            You forgot you assignments and deadlines again? No worries, or maybe a little worry. Add your problems and prioritise the correct problem. Tackle them one at a time and get back on track.
          </p>
        </header>
        <div className="grid gap-5 sm:grid-cols-[1.2fr_0.8fr]">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden rounded-3xl border border-cyan-300/50 bg-gradient-to-r cursor-pointer from-cyan-400 via-emerald-400 to-blue-500 px-7 py-8 text-left text-slate-950 shadow-2xl shadow-cyan-400/30 transition hover:-translate-y-1 hover:shadow-cyan-300/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              <div className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                </div>
                <div className="text-3xl font-semibold leading-tight flex justify-center sm:text-4xl">
                  Add a problem
                </div>
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
                <p>Problems get saved locally, so even if you aren't logged in they are still there.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-cyan-500/10 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300">Your biggest problem:</p>
              <h2 className="text-xl font-semibold text-white">{priorityLabels[latestTask?.priority || "soon"]}</h2>
            </div>
          </div>

          {latestTask ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Title</p>
                <p className="text-lg font-semibold text-white">{latestTask.title}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Finish by</p>
                <p className="text-lg font-semibold text-white">{readableDeadline}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Problem</p>
                <p className="whitespace-pre-line text-sm text-slate-200">{latestTask.problem}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Priority</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-cyan-300/60 bg-cyan-400/20 px-3 py-1 text-sm font-semibold text-white">
                    {priorityLabels[latestTask.priority]}
                  </span>
                  <span className="text-sm text-slate-200/85">
                    {priorityNotes[latestTask.priority]}
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
      </main >

      {
        isModalOpen ? (
          <TaskModal
            onClose={() => setIsModalOpen(false)
            }
            onSubmit={(payload) => {
              setLatestTask(payload);
              setIsModalOpen(false);
            }}
          />
        ) : null}
    </div >
  );
}
