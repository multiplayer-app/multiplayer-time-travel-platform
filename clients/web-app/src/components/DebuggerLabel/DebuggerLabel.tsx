import React, { memo, useEffect } from "react";
import debuggerInstance from "@multiplayer-app/session-debugger";
import {
  triggerMouseDownEvent,
  triggerMouseUpEvent,
} from "utils/triggerMouseEvent";
import "./debuggerLabel.scss";

const DebuggerLabel = () => {
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
      Record your session
    </div>
  );
};

export default memo(DebuggerLabel);
