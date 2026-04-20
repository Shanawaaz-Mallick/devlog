import { useMemo } from 'react';
import { LogEntry, FilterState } from '../types';
import { isWithinInterval, parseISO } from 'date-fns';

export function useFilter(logs: LogEntry[], filters: FilterState) {
  return useMemo(() => {
    return logs.filter(log => {
      // 1. Tag Filter (multi-select)
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => log.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      // 2. Date Range Filter
      if (filters.dateRange) {
        const logDate = parseISO(log.date);
        const start = parseISO(filters.dateRange.from);
        const end = parseISO(filters.dateRange.to);
        if (!isWithinInterval(logDate, { start, end })) return false;
      }

      // 3. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesDid = log.did.toLowerCase().includes(q);
        const matchesBlockers = log.blockers?.toLowerCase().includes(q);
        const matchesNext = log.next?.toLowerCase().includes(q);
        if (!matchesDid && !matchesBlockers && !matchesNext) return false;
      }

      return true;
    });
  }, [logs, filters]);
}
