"use client";

import { PriorityLevel, TaskPayload } from "@/components/TaskModal";

type TaskDetailsModalProps = {
  task: (TaskPayload & { id: string }) | null;
  onClose: () => void;
  formatDeadline: (deadline: string) => string;
  priorityLabels: Record<PriorityLevel, string>;
  priorityNotes: Record<PriorityLevel, string>;
};

export default function TaskDetailsModal({
  task,
  onClose,
  formatDeadline,
  priorityLabels,
  priorityNotes,
}: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">Task details</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-white/35 hover:bg-white/15"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Problem</p>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-100">{task.problem}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Finish by</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatDeadline(task.deadline)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Priority</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/60 bg-cyan-400/20 px-3 py-1 text-sm font-semibold text-white">
                  {priorityLabels[task.priority]}
                </span>
                <span className="text-sm text-slate-200/85">{priorityNotes[task.priority]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
