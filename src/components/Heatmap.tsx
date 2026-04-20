import React from 'react';
import { format } from 'date-fns';
import { DayData } from '../hooks/useHeatmap';

interface HeatmapProps {
  weeks: DayData[][];
}

const Heatmap: React.FC<HeatmapProps> = ({ weeks }) => {
  const getColor = (count: number) => {
    if (count === 0) return 'fill-[#EBEDF0]';
    if (count === 1) return 'fill-[#DBEAFE]';
    if (count === 2) return 'fill-[#93C5FD]';
    if (count === 3) return 'fill-[#3B82F6]';
    return 'fill-[#1E3A8A]';
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg width="780" height="110" className="mx-auto">
        {weeks.map((week, wIndex) => (
          <g key={wIndex} transform={`translate(${wIndex * 15}, 0)`}>
            {week.map((day, dIndex) => (
              <rect
                key={dIndex}
                x="0"
                y={dIndex * 15}
                width="12"
                height="12"
                rx="2"
                className={`${getColor(day.count)} transition-all hover:stroke-[#1D4ED8] hover:stroke-2 cursor-pointer`}
              >
                <title>{`${format(day.date, 'MMM d, yyyy')}: ${day.count} log`}</title>
              </rect>
            ))}
          </g>
        ))}
        {/* Month Labels */}
        <text x="0" y="105" fontSize="10" className="fill-text-muted">Jan</text>
        <text x="130" y="105" fontSize="10" className="fill-text-muted">Mar</text>
        <text x="260" y="105" fontSize="10" className="fill-text-muted">Jun</text>
        <text x="390" y="105" fontSize="10" className="fill-text-muted">Sep</text>
        <text x="650" y="105" fontSize="10" className="fill-text-muted">Dec</text>
      </svg>
      <div className="flex justify-end items-center gap-2 mt-2 text-xs text-text-muted px-4">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-[#EBEDF0]"></div>
          <div className="h-3 w-3 rounded-sm bg-[#DBEAFE]"></div>
          <div className="h-3 w-3 rounded-sm bg-[#93C5FD]"></div>
          <div className="h-3 w-3 rounded-sm bg-[#3B82F6]"></div>
          <div className="h-3 w-3 rounded-sm bg-[#1E3A8A]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
