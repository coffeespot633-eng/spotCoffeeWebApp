import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { Navigate } from "react-router";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

import { favoriteService } from "../services/favoriteService";

import {
  Heart,
  MessageSquare,
} from "lucide-react";

import {
  glassCard,
  glassPanel,
} from "../utils/uiClasses";

import SectionHeader from "../components/ui/SectionHeader";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const [loading, setLoading] =
    useState(true);

  const [reviewCount, setReviewCount] =
    useState(0);

  const [favoriteCount, setFavoriteCount] =
    useState(0);

  const [myReviews, setMyReviews] =
    useState([]);

  const [isEditing, setIsEditing] =
  useState(false);

  const [displayName, setDisplayName] =
    useState("");

  const [photoURL, setPhotoURL] =
    useState("");  

  useEffect(() => {
    if (!user) return;

    setDisplayName(
      user.displayName || ""
      );

    setPhotoURL(
      user.photoURL || ""
      );
      }, [user]);  

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user) return;

        const reviewQuery = query(
          collection(db, "reviews"),
          where(
            "userId",
            "==",
            user.uid
          )
        );

        const reviewSnapshot =
          await getDocs(reviewQuery);

        const reviews =
          reviewSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setReviewCount(
          reviewSnapshot.size
        );

        setMyReviews(
            reviews.sort(
                (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            );

        const favorites =
          await favoriteService.getUserFavorites(
            user.uid
          );

        setFavoriteCount(
          favorites.length
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);


  const handleSaveProfile =
  async () => {
    try {
      await updateProfile(
        auth.currentUser,
        {
          displayName,
          photoURL,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil berhasil diperbarui",
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat memperbarui profil",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center font-bold text-stone-500">
        Memuat profil...
      </div>
    );
  }

  if (!user) {
  return <Navigate to="/login" />;
}

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <SectionHeader
        subtitle="Profile"
        title="Profil Pengguna"
      />

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Profile Card */}
        <div className={glassPanel}>
          <div className="text-center">
            <div
              className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center

              rounded-full

              bg-[var(--color-coffee-700)]

              text-3xl
              font-black
              text-white
            "
            >
              {user?.displayName
                ?.charAt(0)
                ?.toUpperCase() ||
                user?.email
                  ?.charAt(0)
                  ?.toUpperCase() ||
                "U"}
            </div>

            <h2 className="mt-4 text-2xl font-black text-[var(--color-coffee-800)]">
              {user?.displayName ||
                "Pengguna"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {user?.email}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white p-4">
              <MessageSquare
                size={20}
              />

              <div>
                <p className="text-xs text-stone-500">
                  Total Review
                </p>

                <p className="font-black">
                  {reviewCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white p-4">
              <Heart size={20} />

              <div>
                <p className="text-xs text-stone-500">
                  Total Favorit
                </p>

                <p className="font-black">
                  {favoriteCount}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setIsEditing(!isEditing)
            }
            className="
              w-full
              rounded-2xl
              bg-[var(--color-coffee-700)]
              px-5
              py-3
              font-bold
              text-white
              transition
              hover:bg-[var(--color-coffee-800)]
            "
          >
            {isEditing
              ? "Tutup Edit Profil"
              : "Edit Profil"}
          </button>

          {isEditing && (
            <div className={`${glassPanel} mt-6`}>
              <SectionHeader
                subtitle="Profile"
                title="Edit Profil"
              />

              <div className="mt-6 grid gap-4">
                <input
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(
                      e.target.value
                    )
                  }
                  placeholder="Nama Lengkap"
                  className="
                    rounded-2xl
                    border
                    border-amber-100
                    bg-white
                    px-4
                    py-4
                    outline-none
                    transition
                    focus:ring-4
                    focus:ring-[rgba(143,90,47,0.12)]
                  "
                />

                <input
                  value={photoURL}
                  onChange={(e) =>
                    setPhotoURL(
                      e.target.value
                    )
                  }
                  placeholder="URL Foto Profil"
                  className="
                    rounded-2xl
                    border
                    border-amber-100
                    bg-white
                    px-4
                    py-4
                    outline-none
                    transition
                    focus:ring-4
                    focus:ring-[rgba(143,90,47,0.12)]
                  "
                />

                <button
                  onClick={handleSaveProfile}
                  className="
                    rounded-2xl
                    bg-emerald-600
                    px-5
                    py-4
                    font-bold
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Review History */}
        <div>
          <SectionHeader
            subtitle="Aktivitas"
            title="Review Saya"
          />

          {myReviews.length ===
          0 ? (
            <div
              className={`${glassCard} p-10 text-center`}
            >
              <h3 className="text-xl font-black text-[var(--color-coffee-800)]">
                Belum Ada Review
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Review yang kamu kirim
                akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map(
                (review) => (
                  <div
                    key={review.id}
                    className={`${glassCard} p-5`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="
                        inline-flex
                        items-center
                        gap-1

                        rounded-full
                        bg-amber-500

                        px-3
                        py-1

                        text-xs
                        font-bold
                        text-white
                      "
                      >
                        ⭐{" "}
                        {
                          review.rating
                        }
                      </span>

                      <span className="text-xs text-stone-500">
                        {review.createdAt
                          ? new Date(
                              review.createdAt
                            ).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-stone-600">
                      {
                        review.comment
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}