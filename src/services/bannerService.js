import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const bannerService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "banners"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  getById: async (id) => {
    const docRef = doc(db, "banners", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  },

  create: async (data, imageFile) => {
    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();

      formData.append("file", imageFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const cloudData = await response.json();
      imageUrl = cloudData.secure_url;
    }

    const docRef = await addDoc(collection(db, "banners"), {
      title: data.title,
      description: data.description,
      coffeeShopId: data.coffeeShopId || "",
      imageUrl,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  },

  update: async (id, data) => {
    const docRef = doc(db, "banners", id);
    await updateDoc(docRef, data);
  },

  delete: async (id) => {
    const docRef = doc(db, "banners", id);
    await deleteDoc(docRef);
  },

  getActive: async () => {
    const snapshot = await getDocs(collection(db, "banners"));

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((banner) => banner.isActive);
  },
};
