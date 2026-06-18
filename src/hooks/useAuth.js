import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

export default function useAuth() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ambil data role pengguna dari Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const role = userDoc.data()?.role || "member";
        
        setUser(firebaseUser, role);
      } else {
        setUser(null, "guest");
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
}