import React, { useRef, useEffect, useCallback, memo } from "react";
import { useTimeTravel } from "hooks/useTimeTravel";
import "./bugometer.scss";

export const BugOMeter = () => {
  const { errorRate, setErrorRate, setIsManualRate } = useTimeTravel();
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.round((x / rect.width) * 100);
      setErrorRate(Math.max(0, Math.min(100, percent)) / 100);
      setIsManualRate(true);
    },
    [setErrorRate, setIsManualRate]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateValueFromPosition(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      updateValueFromPosition(e.clientX);
    },
    [updateValueFromPosition]
  );

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateValueFromPosition(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      updateValueFromPosition(e.touches[0].clientX);
    },
    [updateValueFromPosition]
  );

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleTouchMove]);

  return (
    <div className="mtt-bugometer">
      <div className="mtt-bugometer__header">
        <span>Bug-O-Meter</span>
        <span>{Math.round(errorRate * 100)}%</span>
      </div>
      <p className="mtt-bugometer__description">
        Chance of a bug in the next message
      </p>

      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="mtt-bugometer__bar"
      >
        <div
          className="mtt-bugometer__bar-gradient"
          style={{
            width: `${Math.round(errorRate * 100)}%`,
            transition: isDraggingRef.current ? "none" : "width 0.2s ease",
          }}
        />
      </div>
    </div>
  );
};

export default memo(BugOMeter);
