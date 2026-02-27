"use client";

import { useMemo } from "react";
import { PriorityLevel, TaskPayload } from "@/components/TaskModal";

export type Task = TaskPayload & { id: string };

const priorityOrder: Record<PriorityLevel, number> = {
  nit: 0,
  soon: 1,
  asap: 2,
  yesterday: 3,
};

const startColor = { r: 125, g: 211, b: 252 }; // light blue
const endColor = { r: 234, g: 88, b: 12 }; // dark orange

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function mixColor(ratio: number) {
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

function urgencyGradient(deadline: string) {
  const target = new Date(deadline).getTime();
  const now = Date.now();
  const week = 1000 * 60 * 60 * 24 * 7;
  const ratio = clamp(1 - (target - now) / week, 0, 1);
  const mixed = mixColor(ratio);
  return `linear-gradient(135deg, ${mixed} 0%, rgba(8, 47, 73, 0.75) 80%)`;
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        const aTime = new Date(a.deadline).getTime();
        const bTime = new Date(b.deadline).getTime();
        return aTime - bTime;
      }),
    [tasks],
  );

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-4 px-6 py-14">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">Task list</p>
          <h2 className="text-3xl font-semibold text-white">What needs attention</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {tasks.length} item{tasks.length === 1 ? "" : "s"}
        </span>
      </header>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-200/80">
          No tasks saved yet. Add one from the start view to see it appear here instantly.
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-white/10 p-5 text-white shadow-lg shadow-black/30"
              style={{ background: urgencyGradient(task.deadline) }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {task.priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/85">
                {new Date(task.deadline).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
