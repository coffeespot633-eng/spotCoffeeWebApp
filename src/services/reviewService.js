import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export const reviewService = {
  create: async (data) => {
    const docRef = await addDoc(
      collection(db, "reviews"),
      {
        ...data,
        createdAt: new Date().toISOString(),
      }
    );

    return docRef.id;
  },

  getByCoffeeShop: async (coffeeShopId) => {
    const q = query(
      collection(db, "reviews"),
      where("coffeeShopId", "==", coffeeShopId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  updateCoffeeShopRating: async (coffeeShopId) => {
  const q = query(
    collection(db, "reviews"),
    where("coffeeShopId", "==", coffeeShopId)
  );

  const snapshot = await getDocs(q);

  const reviews = snapshot.docs.map((doc) => doc.data());

  const reviewCount = reviews.length;

  const averageRating =
  reviewCount > 0
    ? reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      ) / reviewCount
    : 0;

  await updateDoc(
    doc(db, "coffeeShops", coffeeShopId),
    {
      averageRating: Number(
        averageRating.toFixed(1)
      ),
      reviewCount,
    }
  );
},

getAll: async () => {
  const snapshot = await getDocs(
    collection(db, "reviews")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
},

delete: async (reviewId) => {
  await deleteDoc(
    doc(db, "reviews", reviewId)
  );
},
};

