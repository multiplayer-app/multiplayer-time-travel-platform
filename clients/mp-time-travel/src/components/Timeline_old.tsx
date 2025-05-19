import React, { Fragment, useEffect, useRef, useState } from "react";
import timelineDragger from "../assets/timeline-drag.svg";

const START_YEAR = 1840;
const END_YEAR = 2040;
const yearMarks = [];

for (let y = START_YEAR; y <= END_YEAR; y += 20) {
  yearMarks.push(y);
}

const Timeline = ({ selectedYear, setSelectedYear }) => {
  const [draggerPosition, setDraggerPosition] = useState(0);
  const yearRefs = useRef({});

  useEffect(() => {
    requestAnimationFrame(() => {
      const el = yearRefs.current[selectedYear];
      if (el) {
        setDraggerPosition(el.offsetLeft + 30);
      }
    });
  }, [selectedYear]);

  return (
    <div className="mtt-timeline">
      <header className="mtt-timeline-header semibold-text">Timeline</header>

      <div className="mtt-timeline-scroll-container">
        <div className="mtt-timeline-years-container">
          <div className="mtt-timeline-years-ticks">
            {yearMarks.map((year, index) => (
              <Fragment key={year}>
                <div className="mtt-timeline-year-cm">
                  <span
                    className={`mtt-timeline-year ${
                      selectedYear === year ||
                      (selectedYear > year &&
                        selectedYear < yearMarks[index + 1])
                        ? "mtt-year-selected"
                        : ""
                    }`}
                    ref={(el) => (yearRefs.current[year] = el)}
                    onClick={(e) => {
                      setSelectedYear(year);
                      const left = (e.target as HTMLElement)?.offsetLeft;
                      setDraggerPosition(left + 30);
                    }}
                  >
                    {year}
                  </span>
                </div>
                {index !== yearMarks.length - 1 && <YearDivider />}
              </Fragment>
            ))}
          </div>

          {/* Dragger */}
          <div
            className="mtt-timeline-dragger"
            style={{
              left: `${draggerPosition}px`,
            }}
            title={`Year: ${selectedYear}`}
          >
            <img
              src={timelineDragger}
              className="mtt-timeline-dragger-icon"
              alt="Timeline dragger"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const YearDivider = () => (
  <div className="mtt-year-divider">
    <div className="mtt-year-dot" />
    <div className="mtt-year-dot" />
    <div className="mtt-year-h-line" />
    <div className="mtt-year-dot" />
    <div className="mtt-year-dot" />
  </div>
);

export default Timeline;
