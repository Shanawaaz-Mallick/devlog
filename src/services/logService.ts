import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  increment,
  writeBatch,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { LogEntry } from '../types';

export function getLogsCollection(uid: string) {
  return collection(db, 'logs', uid, 'entries');
}

export async function createLog(uid: string, entry: Partial<LogEntry>) {
  const colRef = getLogsCollection(uid);
  const data = {
    ...entry,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  const newDocRef = doc(colRef);
  batch.set(newDocRef, { ...data, id: newDocRef.id });
  
  // Recalculate streak (simplified: check if yesterday had a log)
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  let newCurrentStreak = 1;
  let newLongestStreak = userData?.longestStreak || 0;

  // We check the most recent log before this one
  const q = query(colRef, orderBy('date', 'desc'), limit(1));
  const lastLogs = await getDocs(q);
  
  if (!lastLogs.empty) {
    const lastLog = lastLogs.docs[0].data();
    const lastDate = new Date(lastLog.date);
    const currDate = new Date(entry.date!);
    const diff = Math.floor((currDate.getTime() - lastDate.getTime()) / 86400000);
    
    if (diff === 1) {
      newCurrentStreak = (userData?.currentStreak || 0) + 1;
    } else if (diff <= 0) {
      // Log for same day or past? Keep current streak
      newCurrentStreak = userData?.currentStreak || 1;
    } else {
      newCurrentStreak = 1;
    }
  }

  newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

  batch.update(userRef, {
    totalEntries: increment(1),
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak
  });

  await batch.commit();
  return newDocRef.id;
}

export async function updateLog(uid: string, entryId: string, entry: Partial<LogEntry>) {
  const docRef = doc(db, 'logs', uid, 'entries', entryId);
  await updateDoc(docRef, {
    ...entry,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLog(uid: string, entryId: string) {
  const docRef = doc(db, 'logs', uid, 'entries', entryId);
  
  const batch = writeBatch(db);
  batch.delete(docRef);
  
  // Decrement totalEntries
  batch.update(doc(db, 'users', uid), {
    totalEntries: increment(-1)
  });

  await batch.commit();
}

export async function getLogById(uid: string, entryId: string) {
  const docRef = doc(db, 'logs', uid, 'entries', entryId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as LogEntry;
  }
  return null;
}

export async function getLogByDate(uid: string, date: string) {
  const colRef = getLogsCollection(uid);
  const q = query(colRef, where('date', '==', date));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data() as LogEntry;
  }
  return null;
}
