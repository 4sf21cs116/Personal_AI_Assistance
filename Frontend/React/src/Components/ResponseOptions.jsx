import React from "react";

export default function ResponseOptions({ style, setStyle }) {
  const styles = ["short", "detailed", "formal", "casual", "beginner", "expert"];
  return (
    <div className="control">
      <label>Response Style </label>
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
