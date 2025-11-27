import React from "react";

export default function TaskTemplates({ task, setTask }) {
  const tasks = ["email", "resume", "study_plan", "explain_code"];
  return (
    <div className="control">
      <label>Task Template </label>
      <select value={task || ""} onChange={(e) => setTask(e.target.value || null)}>
        <option value="">None</option>
        {tasks.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
