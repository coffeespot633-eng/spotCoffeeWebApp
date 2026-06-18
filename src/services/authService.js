import { auth, db } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  sendPasswordResetEmail,
} from "firebase/auth";

export const authService = {
  // Fungsi Login Email
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    return { user: userCredential.user, role: userDoc.data()?.role || "member" };
  },

  // Fungsi Register (Daftar Akun)
  register: async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      role: "member",
      createdAt: new Date().toISOString()
    });

    return { user, role: "member" };
  },

  // Fungsi Login dengan Google
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Cek apakah pengguna Google ini sudah ada di Firestore kita
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let role = "member";

    if (!userSnap.exists()) {
      // Jika belum ada (login pertama kali), daftarkan ke Firestore
      await setDoc(userRef, {
        uid: user.uid,
        fullName: user.displayName, // Ambil nama dari akun Google
        email: user.email,
        role: "member",
        createdAt: new Date().toISOString()
      });
    } else {
      // Jika sudah ada, ambil role aslinya
      role = userSnap.data().role || "member";
    }

    return { user, role };
  },

  resetPassword: async (email) => {
  await sendPasswordResetEmail(
    auth,
    email
  );
},

  // Fungsi Logout
  logout: async () => {
    await signOut(auth);
  }
};