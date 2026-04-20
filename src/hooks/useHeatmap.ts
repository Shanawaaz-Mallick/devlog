import { useMemo } from 'react';
import { LogEntry } from '../types';
import { 
  subDays, 
  startOfToday, 
  getDay, 
  format, 
  startOfISOWeek, 
  addDays, 
  isSameDay 
} from 'date-fns';

export interface DayData {
  date: Date;
  count: number;
}

export function useHeatmap(logs: LogEntry[]) {
  return useMemo(() => {
    const today = startOfToday();
    // 52 weeks = 364 days. Let's go 52 full weeks back.
    const weeks: DayData[][] = [];
    
    // Find the start of the week 52 weeks ago
    const totalDays = 52 * 7;
    const startDate = subDays(today, totalDays - 1);
    const startOfGrid = startOfISOWeek(startDate);

    let currentDate = startOfGrid;
    for (let w = 0; w < 52; w++) {
      const week: DayData[] = [];
      for (let d = 0; d < 7; d++) {
        const count = logs.filter(l => isSameDay(new Date(l.date), currentDate)).length;
        week.push({
          date: currentDate,
          count: count
        });
        currentDate = addDays(currentDate, 1);
      }
      weeks.push(week);
    }

    return weeks;
  }, [logs]);
}
