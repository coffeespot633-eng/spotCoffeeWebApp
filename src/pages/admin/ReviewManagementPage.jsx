import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { reviewService } from "../../services/reviewService";
import {
  glassCard,
} from "../../utils/uiClasses";

import SectionHeader from "../../components/ui/SectionHeader";

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] =
    useState(true);

 useEffect(() => {
  const loadReviews = async () => {
    try {
      const data =
        await reviewService.getAll();

      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadReviews();
}, []);

  const handleDelete = async (
    reviewId
  ) => {
    const result =
      await Swal.fire({
        title: "Hapus review?",
        icon: "warning",
        showCancelButton: true,
      });

    if (!result.isConfirmed) return;

    try {
      const review =
        reviews.find(
          (item) =>
            item.id === reviewId
        );
        
      await reviewService.delete(
        reviewId
      );

      await reviewService.updateCoffeeShopRating(
        review.coffeeShopId
      );

      setReviews((current) =>
        current.filter(
          (item) =>
            item.id !== reviewId
        )
      );

      Swal.fire(
        "Berhasil",
        "Review dihapus",
        "success"
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
  return (
    <div className="py-10 text-center font-bold text-stone-500">
      Memuat review...
    </div>
  );
}

  return (
    <section>
      <SectionHeader
        subtitle="Admin"
        title="Kelola Review"
      />

      <div className="space-y-4">
        {reviews.length === 0 && (
          <div
            className={`${glassCard} p-10 text-center`}
          >
            <h3 className="text-xl font-black">
              Belum ada review
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Review dari pengguna akan muncul di sini.
            </p>
          </div>
        )}
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`${glassCard} p-5`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
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
                ⭐ {review.rating}
              </span>

                <div className="mt-2">
                  <p className="font-bold text-[var(--color-coffee-800)]">
                    {review.userName}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleDelete(
                    review.id
                  )
                }
                className="
                rounded-2xl
                bg-red-500

                px-4
                py-2

                font-bold
                text-white

                transition
                duration-300

                hover:bg-red-600
                "
              >
                Hapus
              </button>
            </div>

            <p className="mt-3">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}