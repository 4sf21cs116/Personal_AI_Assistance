import React from "react";
import PropTypes from "prop-types";

/**
 * @typedef {'general' | 'coding' | 'summarizer' | 'idea_generator' | 'interview_trainer'} ModeType
 */

/**
 * ModeSelector Component
 *
 * A controlled dropdown to select different AI modes.
 *
 * @param {object} props - Component props
 * @param {ModeType} props.mode - Currently selected mode
 * @param {function(ModeType): void} props.setMode - Callback to update the mode
 */
export default function ModeSelector({ mode, setMode }) {
  const modes = [
    "general",
    "coding",
    "summarizer",
    "idea_generator",
    "interview_trainer",
  ];

  const selectId = "mode-selector-dropdown";

  return (
    <div className="control">
      <label htmlFor={selectId}>Mode </label>
      <select
        id={selectId}
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        {modes.map((m) => (
          <option key={m} value={m}>
            {m
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
}

// PropTypes for type checking
ModeSelector.propTypes = {
  mode: PropTypes.oneOf([
    "general",
    "coding",
    "summarizer",
    "idea_generator",
    "interview_trainer",
  ]).isRequired,
  setMode: PropTypes.func.isRequired,
};
