import { useState, useEffect } from 'react';
import { query, orderBy, onSnapshot } from 'firebase/firestore';
import { getLogsCollection } from '../services/logService';
import { LogEntry } from '../types';

export function useLogs(uid: string | undefined) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const colRef = getLogsCollection(uid);
    const q = query(colRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as LogEntry));
      setLogs(data);
      setLoading(false);
    }, (err) => {
      console.error("Logs fetch error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { logs, loading, error };
}
