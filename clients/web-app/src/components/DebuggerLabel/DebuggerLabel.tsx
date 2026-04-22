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

    return () => {
      el.classList.remove("bottom-left");
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
