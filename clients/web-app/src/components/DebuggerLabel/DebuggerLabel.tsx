import React, { memo, useEffect } from "react";
import debuggerInstance from "@multiplayer-app/session-recorder-browser";
import {
  triggerMouseDownEvent,
  triggerMouseUpEvent,
} from "utils/triggerMouseEvent";
import "./debuggerLabel.scss";
import { SessionState } from "utils/types";
import { useTimeTravel } from "hooks/useTimeTravel";

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
    el?.classList?.add("no-draggable");

    return () => {
      el?.classList?.remove("no-draggable");
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
