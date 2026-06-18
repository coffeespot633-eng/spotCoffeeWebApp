import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

// DATA KONFIGURASI CLOUDINARY
const CLOUDINARY_CLOUD_NAME = "ddbalrkqf"; 
const CLOUDINARY_UPLOAD_PRESET = "spot_coffee_preset";

export const coffeeShopService = {
  // 1. Fungsi mengambil semua data Coffee Shop
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coffeeShops"));
      
      const shops = querySnapshot.docs.map((doc) => ({
        id: doc.id,         // Mengambil ID asli dari dokumen Firestore
        ...doc.data(),      // Mengambil seluruh field data di dalamnya
      }));
      
      return shops;
    } catch (error) {
      console.error("Gagal mengambil daftar coffee shop:", error);
      throw error;
    }
  },

  // 2. Fungsi mengambil detail satu Coffee Shop berdasarkan ID
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error("ID yang dikirim ke service kosong/tidak valid.");
      }

      const docRef = doc(db, "coffeeShops", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // 3. Fungsi menambah data Coffee Shop baru (Admin)
  create: async (data, imageFile) => {
    let imageUrl = "";
    
    // Proses upload gambar ke Cloudinary jika ada file yang dipilih
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const cloudData = await response.json();
        imageUrl = cloudData.secure_url; 
      } catch (error) {
        console.error("Gagal mengunggah gambar ke Cloudinary:", error);
        throw new Error("Gagal mengunggah gambar ke server.", { cause: error });
      }
    }

    // Simpan data lengkap ke Firebase Firestore
const docRef = await addDoc(
  collection(db, "coffeeShops"),
  {
    name: data.name,

    description: data.description,

    atmosphere:
      data.atmosphere || "",

    favoriteMenu:
      data.favoriteMenu || "",

    address: data.address,

    operatingHours:
      data.operatingHours,

    mapsLink: data.mapsLink,

    instagramLink:
      data.instagramLink || "",

    tiktokLink:
      data.tiktokLink || "",

    priceRange:
      data.priceRange,

    facilities:
      data.facilities || [],

    suitableFor:
      data.suitableFor || [],

    wifi:
      data.wifi || false,

    powerSocket:
      data.powerSocket || false,

    crowdLevel:
      data.crowdLevel || "tenang",

    featured:
      data.featured || false,

    premium:
      data.premium || false,

    hasPromo:
      data.hasPromo || false,

    hasEvent:
      data.hasEvent || false,

    imageUrl:
      imageUrl || "",

    createdAt:
      new Date().toISOString(),
  }
);

    return docRef.id;
  },

  // 4. Fungsi Mengubah/Edit Data Coffee Shop
update: async (
  id,
  updatedData,
  imageFile
) => {
  try {
    let imageUrl =
      updatedData.imageUrl || "";

    if (imageFile) {
      const formData =
        new FormData();

      formData.append(
        "file",
        imageFile
      );

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      const response =
        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const cloudData =
        await response.json();

      imageUrl =
        cloudData.secure_url;
    }

    const docRef = doc(
      db,
      "coffeeShops",
      id
    );

    await updateDoc(docRef, {
      ...updatedData,
      imageUrl,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
},

  // 5. Fungsi Menghapus Data Coffee Shop
  delete: async (id) => {
    try {
      const docRef = doc(db, "coffeeShops", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      throw error;
    }
  }

};
