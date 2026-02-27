"use client";

import { FormEvent, useState } from "react";

export type PriorityLevel = "nit" | "soon" | "asap" | "yesterday";

export type TaskPayload = {
  title: string;
  problem: string;
  deadline: string;
  priority: PriorityLevel;
};

type TaskModalProps = {
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => void;
};

const priorityOptions: Array<{
  value: PriorityLevel;
  label: string;
  hint: string;
}> = [
  {
    value: "nit",
    label: "Nit",
    hint: "Should be done eventually, but no rush. Keep it on the radar without pressure.",
  },
  {
    value: "soon",
    label: "Finish this soon",
    hint: "When you have a moment, this would be a great one to wrap up.",
  },
  {
    value: "asap",
    label: "Finish this ASAP",
    hint: "Get it together, this must be prioritized and finished.",
  },
  {
    value: "yesterday",
    label: "Needed yesterday",
    hint: "STRAIGHT PANIC MODE. Drop everything and fix NOW.",
  },
];

const blankForm: TaskPayload = {
  title: "",
  problem: "",
  deadline: "",
  priority: "soon",
};

export default function TaskModal({ onClose, onSubmit }: TaskModalProps) {
  const [form, setForm] = useState<TaskPayload>(blankForm);

  const updateField = (key: keyof TaskPayload, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">
              Quick intake
            </p>
            <h2 className="text-2xl font-semibold text-white">Draft the task brief</h2>
            <p className="text-sm text-slate-200/80">
              Keep it tight, obvious, and ready for a fast handoff.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-100">Title</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                One line
              </span>
            </div>
            <input
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Example: Ship the new onboarding checklist"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/60"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-100">Problem</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                What hurts
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={form.problem}
              onChange={(event) => updateField("problem", event.target.value)}
              placeholder="Describe the issue, who is blocked, and what success looks like."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/60"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
            <label className="block space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-100">Finish by</span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  Deadline
                </span>
              </div>
              <input
                required
                type="datetime-local"
                value={form.deadline}
                onChange={(event) => updateField("deadline", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/60"
              />
            </label>

            <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <legend className="text-sm font-medium text-slate-100">Priority</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {priorityOptions.map((option) => {
                  const isActive = option.value === form.priority;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("priority", option.value)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "border-cyan-300/70 bg-cyan-400/20 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                          : "border-white/10 bg-white/5 text-slate-200 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs text-slate-200/80">{option.hint}</div>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="text-xs text-slate-300/80">
              Ready to hand this off? Everything here fits on one Slack message.
            </div>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:shadow-cyan-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Save task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
