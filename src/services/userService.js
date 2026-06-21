import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const userService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "users"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
