import React, { memo, useEffect } from "react";
import debuggerInstance from "@multiplayer-app/session-recorder-react";
import {
  triggerMouseDownEvent,
  triggerMouseUpEvent,
} from "utils/triggerMouseEvent";
import { useTimeTravel } from "hooks/useTimeTravel";
import { SessionState } from "utils/types";
import "./debuggerLabel.scss";

const DebuggerLabel = () => {
  const { recordingState } = useTimeTravel();

  const onTriggerMouseDown = (e) => {
    e.preventDefault();
    triggerMouseDownEvent(debuggerInstance?.sessionWidgetButtonElement);
  };

  const onTriggerMouseUp = (e) => {
    e.preventDefault();
    triggerMouseUpEvent(debuggerInstance?.sessionWidgetButtonElement);
  };

  useEffect(() => {
    const el = debuggerInstance?.sessionWidgetButtonElement;
    if (!el) return;

    el.classList.add("bottom-left");

    const stopDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("mousedown", stopDrag);
    el.addEventListener("pointerdown", stopDrag);
    el.addEventListener("dragstart", stopDrag);

    return () => {
      el.classList.remove("bottom-left");
      el.removeEventListener("mousedown", stopDrag);
      el.removeEventListener("pointerdown", stopDrag);
      el.removeEventListener("dragstart", stopDrag);
    };
  }, []);

  return (
    <div
      className="mtt-debugger-label"
      onMouseDown={onTriggerMouseDown}
      onMouseUp={onTriggerMouseUp}
      onClick={(e) => e.stopPropagation()}
    >
      {recordingState !== SessionState.started
        ? "Record a new session"
        : "Stop recording"}
    </div>
  );
};

export default memo(DebuggerLabel);
