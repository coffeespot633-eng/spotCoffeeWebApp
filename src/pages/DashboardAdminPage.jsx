import { useEffect, useState } from "react";
import { Link } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Coffee,
  Star,
  Images,
  Users,
  MessageSquare,
  Heart,
  ChartColumn,
} from "lucide-react";
import { glassCard, glassPanel } from "../utils/uiClasses";

import SectionHeader from "../components/ui/SectionHeader";

export default function DashboardAdminPage() {
  const [latestCoffeeShops, setLatestCoffeeShops] = useState([]);

  const [stats, setStats] = useState([
    {
      label: "Coffee Shop",
      value: 0,
      icon: Coffee,
    },
    {
      label: "Featured",
      value: 0,
      icon: Star,
    },
    {
      label: "Banner Aktif",
      value: 0,
      icon: Images,
    },
    {
      label: "User",
      value: 0,
      icon: Users,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coffeeSnapshot = await getDocs(collection(db, "coffeeShops"));

        const bannerSnapshot = await getDocs(collection(db, "banners"));

        const userSnapshot = await getDocs(collection(db, "users"));

        const coffeeShops = coffeeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const latestCoffeeData = [...coffeeShops]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setLatestCoffeeShops(latestCoffeeData);

        const banners = bannerSnapshot.docs.map((doc) => doc.data());

        const featuredCount = coffeeShops.filter(
          (shop) => shop.featured,
        ).length;

        const activeBannerCount = banners.filter(
          (banner) => banner.isActive,
        ).length;

        const reviewSnapshot = await getDocs(collection(db, "reviews"));

        const latestReviewData = reviewSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setLatestReviews(latestReviewData);

        const favoriteSnapshot = await getDocs(collection(db, "favorites"));

        setStats([
          {
            label: "User",
            value: userSnapshot.size,
            icon: Users,
          },
          {
            label: "Coffee Shop",
            value: coffeeSnapshot.size,
            icon: Coffee,
          },

          {
            label: "Featured",
            value: featuredCount,
            icon: Star,
          },

          {
            label: "Banner Aktif",
            value: activeBannerCount,
            icon: Images,
          },

          {
            label: "Review",
            value: reviewSnapshot.size,
            icon: MessageSquare,
          },

          {
            label: "Favorite",
            value: favoriteSnapshot.size,
            icon: Heart,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const [latestReviews, setLatestReviews] = useState([]);

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          const isAnalytics = stat.label === "Visitor";

          return (
            <div key={stat.label} className={`${glassCard} p-5`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-stone-500">{stat.label}</p>

                <Icon size={22} className="text-[var(--color-coffee-600)]" />
              </div>

              <p className="mt-4 text-5xl font-black text-[var(--color-coffee-800)]">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className={`${glassPanel} mt-6`}>
        <SectionHeader subtitle="Analytics" title="Statistik Pengunjung" />

        <p className="mt-2 text-sm text-stone-500">
          Lihat jumlah pengunjung website, halaman populer, device, dan data
          lainnya melalui Google Analytics.
        </p>

        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noreferrer"
          className="
      mt-4
      inline-flex

      items-center
      gap-2

      rounded-2xl

      bg-[var(--color-coffee-700)]

      px-5
      py-3

      text-sm
      font-bold
      text-white
    "
        >
          <ChartColumn size={18} />
          Buka Analytics
        </a>
      </div>

      <div className={`mt-6 ${glassPanel}`}>
        <SectionHeader subtitle="Aksi Cepat" title="Mulai Kelola Rekomendasi" />

        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
          Tambahkan coffee shop baru, lengkapi fasilitas, upload foto, lalu cek
          tampilannya di halaman publik.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/admin/add-coffee-shop"
            className="
            rounded-2xl
            bg-[var(--color-coffee-700)]
            px-5
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            hover:scale-[1.02]
            hover:bg-[var(--color-coffee-800)]
          "
          >
            Tambah Coffee Shop
          </Link>

          <Link
            to="/admin/add-banner"
            className="
            rounded-2xl
            border
            border-amber-100
            bg-white
            px-5
            py-3
            text-sm
            font-bold
            text-[var(--color-coffee-700)]
            transition
            hover:bg-[var(--color-coffee-50)]
          "
          >
            Tambah Banner
          </Link>

          <Link
            to="/admin/coffee-shops"
            className="
            rounded-2xl
            border
            border-amber-100
            bg-white
            px-5
            py-3
            text-sm
            font-bold
            text-[var(--color-coffee-700)]
            transition
            hover:bg-[var(--color-coffee-50)]
          "
          >
            Lihat Data
          </Link>
        </div>
      </div>

      {latestReviews.length > 0 && (
        <div className={`${glassPanel} mt-6`}>
          <SectionHeader subtitle="Aktivitas" title="Review Terbaru" />

          <div className="mt-4 space-y-3">
            {latestReviews.map((review) => (
              <div
                key={review.id}
                className="
                flex
                items-center
                justify-between

                rounded-2xl

                border
                border-white/40

                bg-white/70

                p-4

                backdrop-blur-xl
              "
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                  flex
                  h-12
                  w-12

                  items-center
                  justify-center

                  rounded-2xl

                  bg-amber-100

                  font-black
                  text-amber-600
                  "
                  >
                    ⭐ {review.rating}
                  </div>

                  <div>
                    <p className="font-bold text-[var(--color-coffee-800)]">
                      {review.userName}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      {review.comment}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {latestCoffeeShops.length > 0 && (
        <div className={`mt-6 ${glassPanel}`}>
          <SectionHeader subtitle="Coffee Shop" title="Coffee Shop Terbaru" />

          <div className="mt-4 space-y-3">
            {latestCoffeeShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/coffee-shop/${shop.id}`}
                className="
              flex
              items-center
              justify-between

              rounded-2xl

              border
              border-white/40

              bg-white/70

              p-4

              transition
              hover:scale-[1.01]

              backdrop-blur-xl
            "
              >
                <div className="flex items-center gap-3">
                  {shop.imageUrl ? (
                    <img
                      src={shop.imageUrl}
                      alt={shop.name}
                      className="
                  h-12
                  w-12
                  rounded-xl
                  object-cover
                "
                    />
                  ) : (
                    <div
                      className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-coffee-100)]
                  text-xs
                  font-bold
                  text-[var(--color-coffee-500)]
                "
                    >
                      ☕
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-[var(--color-coffee-800)]">
                      {shop.name}
                    </p>

                    <p className="text-sm text-stone-500 line-clamp-1">
                      {shop.address}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
