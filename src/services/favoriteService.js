import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export const favoriteService = {
  add: async (userId, coffeeShopId) => {
    await addDoc(
      collection(db, "favorites"),
      {
        userId,
        coffeeShopId,
        createdAt: new Date().toISOString(),
      }
    );
  },

  remove: async (favoriteId) => {
    await deleteDoc(
      doc(db, "favorites", favoriteId)
    );
  },

  getUserFavorites: async (userId) => {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  getFavorite: async (
    userId,
    coffeeShopId
  ) => {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("coffeeShopId", "==", coffeeShopId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  },
  
};