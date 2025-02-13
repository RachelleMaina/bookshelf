"use client";
import { signInWithPopup,  onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect} from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  // const [user, setUser] = useState(null);

  const router = useRouter()

  useEffect(() => {
    // Auto-check login status
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        };

        // Store in Firestore if not exists
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, { ...userData, subscription: null });
        }

        // localStorage.setItem("user", JSON.stringify(userData));
        // setUser(userData);
      } else {
        // localStorage.removeItem("user");
        // setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
       // Retrieve the previous page from localStorage
       const prevPage = localStorage.getItem("prevPage") || "/";
       router.push(prevPage)
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // const loginWithFacebook = async () => {
  //   try {
  //     await signInWithPopup(auth, facebookProvider);
  //   } catch (error) {
  //     console.error("Facebook login failed:", error);
  //   }
  // };

  // const logout = async () => {
  //   await signOut(auth);
  //   localStorage.removeItem("user");
  //   setUser(null);
  // };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      <button
        onClick={loginWithGoogle}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#39210C] text-[#39210C]hover:bg-opacity-80"
      >
        <Icon icon="flat-color-icons:google" width="24" />
        <span className="font-medium text-gray-700">Sign in with Google</span>
      </button>
    </div>
  );
}
