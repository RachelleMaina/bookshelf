import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export interface Subscription {
  plan: string;
  method: "mpesa" | "card";
  expiresAt: number; // Timestamp (milliseconds)
}

// Function to Fetch Subscription Data
export async function getSubscription(userId: string): Promise<Subscription | null> {
  if (!userId) return null;

  try {
    const subRef = doc(db, "subscriptions", userId);
    const subSnap = await getDoc(subRef);

    if (subSnap.exists()) {
      return subSnap.data() as Subscription;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

// Function to Save Subscription After Payment
export async function updateSubscription(userId: string, plan: string) {
  try {
    const expiresAt = new Date().getTime() + (plan === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000;

    await setDoc(doc(db, "subscriptions", userId), {
      plan,
      expiresAt,
    });

    console.log("Subscription updated successfully");
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
} 


export async function saveLastPosition(userId: string, slug: string, location: string) {
  if (!userId || !slug || !location) return;
  const userRef = doc(db, "readingProgress", userId);
  await setDoc(userRef, { [slug]: location }, { merge: true });
}

export async function getLastPosition(userId: string, slug: string): Promise<string | null> {
  if (!userId || !slug) return null;
  const userRef = doc(db, "readingProgress", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data()[slug] || null : null;
}

export async function trackReadingTime(userId: string, slug: string, duration: number) {
  if (!userId || !slug || !duration) return;
  const userRef = doc(db, "readingTime", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    await updateDoc(userRef, { [slug]: (userSnap.data()[slug] || 0) + duration });
  } else {
    await setDoc(userRef, { [slug]: duration });
  }
}

export async function saveOpenedBook(userId: string, slug: string) {
  if (!userId || !slug) return;
  const historyRef = doc(db, "readingHistory", userId);
  await setDoc(historyRef, { books: arrayUnion(slug) }, { merge: true });
}

export async function getOpenedBooks(userId: string): Promise<string[]> {
  if (!userId) return [];
  const historyRef = doc(db, "readingHistory", userId);
  const historySnap = await getDoc(historyRef);
  return historySnap.exists() ? historySnap.data().books || [] : [];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

