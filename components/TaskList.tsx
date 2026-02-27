"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PriorityLevel, TaskPayload } from "@/components/TaskModal";

export type Task = TaskPayload & { id: string };

type TaskListProps = {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onComplete: (taskId: string) => void;
};

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

export default function TaskList({ tasks, onSelect, onComplete }: TaskListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const confirmingButtonRef = useRef<HTMLButtonElement | null>(null);

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

  const handleConfirm = (taskId: string) => {
    if (exitingId) return;
    if (confirmingId === taskId) {
      setExitingId(taskId);
      setTimeout(() => {
        onComplete(taskId);
        setExitingId(null);
        if (confirmingId === taskId) {
          setConfirmingId(null);
        }
      }, 520);
    } else {
      setConfirmingId(taskId);
    }
  };

  useEffect(() => {
    if (!confirmingId) {
      confirmingButtonRef.current = null;
      return;
    }

    const handleClickAway = (event: MouseEvent) => {
      const btn = confirmingButtonRef.current;
      if (btn && btn.contains(event.target as Node)) {
        return;
      }
      setConfirmingId(null);
    };

    document.addEventListener("mousedown", handleClickAway, true);
    return () => document.removeEventListener("mousedown", handleClickAway, true);
  }, [confirmingId]);

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
          {sorted.map((task) => {
            const isConfirming = confirmingId === task.id;
            const isExiting = exitingId === task.id;

            return (
              <article
                key={task.id}
                onClick={() => onSelect(task)}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-5 text-white shadow-lg shadow-black/30 transition-all duration-500 ${isExiting ? "translate-y-2 scale-95 opacity-0" : "hover:-translate-y-0.5 hover:shadow-cyan-400/20"
                  }`}
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
                <div className="relative bottom-8 right-0 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleConfirm(task.id);
                    }}
                    ref={(node) => {
                      if (isConfirming) {
                        confirmingButtonRef.current = node;
                      } else if (confirmingButtonRef.current === node) {
                        confirmingButtonRef.current = null;
                      }
                    }}
                    className={`absolute right-4 top-4 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                      isConfirming
                        ? "w-auto border-emerald-200/60 bg-emerald-300/25 text-emerald-50"
                        : "w-[44px] justify-center border-white/30 bg-black/25 text-white hover:border-white/50"
                    } ${isExiting ? "opacity-30" : ""}`}
                  >
                    <span><img src="https://avatars.githubusercontent.com/u/41039781?s=200&v=4" alt="Krull" width="16" height="16" className="rounded-full" /></span>
                    {isConfirming ? <span>confirm?</span> : null}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
