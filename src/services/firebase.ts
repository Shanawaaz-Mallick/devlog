import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection as suggested in guidelines
async function testConnection() {
  try {
    // Attempting a read to verify connection
    await getDocFromServer(doc(db, 'system', 'health'));
  } catch (error: any) {
    if (error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network.");
    }
    // Expected error if 'system/health' doesn't exist, but connection works
  }
}

testConnection();
