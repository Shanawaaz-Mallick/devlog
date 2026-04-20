import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Developer',
      email: user.email,
      createdAt: serverTimestamp(),
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0
    };
    await setDoc(userRef, profile);
  }
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export async function registerWithEmail(email: string, pass: string) {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await createUserProfile(result.user);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string) {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function deleteAccount(uid: string) {
  const user = auth.currentUser;
  if (!user || user.uid !== uid) throw new Error('Unauthorized');

  // Per PRD: Batch delete all log entries first
  const logsRef = collection(db, 'logs', uid, 'entries');
  const logsSnap = await getDocs(logsRef);
  
  const batch = writeBatch(db);
  logsSnap.forEach((logDoc) => {
    batch.delete(logDoc.ref);
  });
  
  // Then delete user doc
  batch.delete(doc(db, 'users', uid));
  
  await batch.commit();
  
  // Finally delete from Firebase Auth
  await deleteUser(user);
}
