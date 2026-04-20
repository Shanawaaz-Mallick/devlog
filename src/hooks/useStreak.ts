import { useMemo } from 'react';
import { LogEntry } from '../types';
import { parseISO, differenceInDays, startOfDay } from 'date-fns';

export function useStreak(logs: LogEntry[]) {
  return useMemo(() => {
    if (logs.length === 0) return { current: 0, longest: 0 };

    const sortedDates = logs
      .map(l => startOfDay(parseISO(l.date)).getTime())
      .filter((v, i, a) => a.indexOf(v) === i) // unique dates
      .sort((a, b) => b - a); // descending

    let current = 0;
    const today = startOfDay(new Date());
    const yesterday = startOfDay(new Date(today.getTime() - 86400000));

    // Check if the most recent log is today or yesterday to continue current streak
    const latestLogDate = new Date(sortedDates[0]);
    if (differenceInDays(today, latestLogDate) > 1) {
      current = 0;
    } else {
      current = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentLog = new Date(sortedDates[i]);
        const nextLog = new Date(sortedDates[i + 1]);
        if (differenceInDays(currentLog, nextLog) === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longest = 0;
    let tempStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentLog = new Date(sortedDates[i]);
        const nextLog = new Date(sortedDates[i + 1]);
        if (differenceInDays(currentLog, nextLog) === 1) {
          tempStreak++;
        } else {
          longest = Math.max(longest, tempStreak);
          tempStreak = 1;
        }
    }
    longest = Math.max(longest, tempStreak);

    return { current, longest };
  }, [logs]);
}
