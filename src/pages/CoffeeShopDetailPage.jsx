import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { coffeeShopService } from "../services/coffeeShopService";
import Button from "../components/ui/Button";
import {
  Wifi,
  Plug,
  Star,
  Crown,
  Camera,
  Music2,
  Briefcase,
  Coffee,
  Laptop,
  Heart,
} from "lucide-react";
import { reviewService } from "../services/reviewService";
import useAuthStore from "../store/authStore";
import { favoriteService } from "../services/favoriteService";
import { glassCard, glassPanel } from "../utils/uiClasses";

import SectionHeader from "../components/ui/SectionHeader";

export default function CoffeeShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [favorite, setFavorite] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sendingReview, setSendingReview] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        const data = await coffeeShopService.getById(id);
        setShop(data);
        if (user) {
          const fav = await favoriteService.getFavorite(user.uid, id);

          setFavorite(fav);
        }

        const reviewData = await reviewService.getByCoffeeShop(id);

        setReviews(reviewData);
      } catch {
        setError("Gagal memuat data tempat ngopi atau data tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user]);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-[var(--color-coffee-100)] border-t-[var(--color-coffee-700)]" />
          <p className="mt-4 text-sm font-bold text-stone-500">
            Memuat detail tempat...
          </p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-[var(--color-coffee-100)] bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-red-600">
            Data tidak tersedia
          </p>
          <h1 className="mt-2 text-2xl font-black text-[var(--color-coffee-800)]">
            Coffee shop tidak ditemukan
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            {error || "Data tidak ditemukan."}
          </p>
          <Button className="mt-6" onClick={() => navigate("/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    if (!comment.trim()) {
      alert("Review tidak boleh kosong.");
      return;
    }

    try {
      setSendingReview(true);
      await reviewService.create({
        coffeeShopId: shop.id,

        userId: user.uid,

        userName: user.displayName || user.email,

        rating,

        comment,
      });

      await reviewService.updateCoffeeShopRating(shop.id);

      const latestShop = await coffeeShopService.getById(shop.id);

      setShop(latestShop);

      const updatedReviews = await reviewService.getByCoffeeShop(shop.id);

      setReviews(updatedReviews);

      setComment("");
      setRating(5);
    } catch (error) {
      console.error(error);
    } finally {
      setSendingReview(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Silakan login dahulu");
      return;
    }

    try {
      if (favorite) {
        await favoriteService.remove(favorite.id);

        setFavorite(null);
      } else {
        await favoriteService.add(user.uid, shop.id);

        const fav = await favoriteService.getFavorite(user.uid, shop.id);

        setFavorite(fav);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-2xl px-3 py-2 text-sm font-bold text-[var(--color-coffee-600)] hover:bg-[var(--color-coffee-100)]"
      >
        Kembali
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className={`${glassPanel} overflow-hidden p-0`}>
          <div className="aspect-[16/10] bg-[var(--color-coffee-100)]">
            {shop.imageUrl ? (
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="
                h-full
                w-full
                object-cover
                transition
                duration-700
                hover:scale-105
                "
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-[var(--color-coffee-400)]">
                Tidak ada foto
              </div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
              Detail coffee shop
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-black tracking-tight text-[var(--color-coffee-800)]">
                {shop.name}
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <Star size={18} fill="#f59e0b" className="text-amber-500" />

                <span className="font-bold">{shop.averageRating || 0}</span>

                <span className="text-sm text-stone-500">
                  ({shop.reviewCount || 0} review)
                </span>
              </div>

              {shop.featured && (
                <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  <Star size={12} />
                  Featured
                </div>
              )}

              {shop.premium && (
                <div className="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                  <Crown size={12} />
                  Premium
                </div>
              )}
            </div>

            <p className="mt-3 text-sm font-semibold text-stone-500">
              {shop.address}
            </p>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-stone-600">
              {shop.description}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className={`${glassCard} p-4 text-center`}>
                <Star
                  size={24}
                  className="mx-auto text-amber-500"
                  fill="#f59e0b"
                />

                <p className="mt-2 text-2xl font-black">
                  {shop.averageRating || 0}
                </p>

                <p className="text-xs text-stone-500">Rating</p>
              </div>

              <div className={`${glassCard} p-4 text-center`}>
                <Coffee
                  size={24}
                  className="mx-auto text-[var(--color-coffee-700)]"
                />

                <p className="mt-2 text-2xl font-black">
                  {shop.reviewCount || 0}
                </p>

                <p className="text-xs text-stone-500">Review</p>
              </div>

              <div className={`${glassCard} p-4 text-center`}>
                <Heart size={24} className="mx-auto text-red-500" />

                <p className="mt-2 text-2xl font-black">{favorite ? 1 : 0}</p>

                <p className="text-xs text-stone-500">Favorit</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-black text-[var(--color-coffee-800)]">
                Cocok Untuk
              </h3>

              <div className="flex flex-wrap gap-2">
                {shop.suitableFor?.map((item) => {
                  const Icon =
                    item === "Nugas"
                      ? Laptop
                      : item === "Meeting"
                        ? Briefcase
                        : Coffee;

                  return (
                    <div
                      className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full
                    border
                    border-amber-100

                    bg-white

                    px-3
                    py-1.5

                    text-xs
                    font-bold
                    text-[var(--color-coffee-700)]
                  "
                    >
                      <Icon size={16} />
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {shop.favoriteMenus?.length > 0 && (
            <section className="mt-10">
              <div className="mb-4">
                <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
                  Menu Unggulan
                </p>

                <h2 className="text-2xl font-black text-[var(--color-coffee-800)]">
                  Menu Favorit
                </h2>
              </div>

              <div
                className="
                grid
                gap-4

                sm:grid-cols-2
                lg:grid-cols-3
                "
              >
                {shop.favoriteMenus.map((menu, index) => (
                  <div
                    key={index}
                    className="
            overflow-hidden

            rounded-3xl

            border
            border-white/40

            bg-white/70

            shadow-lg

            backdrop-blur-xl
            "
                  >
                    <img
                      src={menu.imageUrl || "/placeholder-food.jpg"}
                      alt={menu.name}
                      className="
              h-48
              w-full

              object-cover
              "
                    />

                    <div className="p-4">
                      <h3
                        className="
                text-lg
                font-black

                text-[var(--color-coffee-800)]
                "
                      >
                        {menu.name}
                      </h3>

                      <p
                        className="
                mt-1

                text-sm
                font-semibold

                text-[var(--color-coffee-600)]
                "
                      >
                        {menu.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={`${glassPanel} h-fit`}>
          <div className="grid gap-3">
            <div className="grid gap-3">
              <Info
                label="Range harga"
                value={shop.priceRange || "Belum diisi"}
              />

              <Info
                label="Jam operasional"
                value={shop.operatingHours || "Hubungi kafe terkait"}
              />

              <Info label="Suasana" value={shop.atmosphere || "Belum diisi"} />

              <Info label="Alamat" value={shop.address || "Belum diisi"} />

              <Info
                label="Tingkat Keramaian"
                value={shop.crowdLevel || "Belum diisi"}
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-black text-[var(--color-coffee-800)]">
              Fasilitas
            </h2>

            {shop.facilities && shop.facilities.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {shop.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="
                      rounded-full
                      border
                      border-amber-100

                      bg-white

                      px-3
                      py-1.5

                      text-xs
                      font-bold
                      text-[var(--color-coffee-700)]
                      "
                  >
                    {facility}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-500">
                Belum ada informasi fasilitas.
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-black text-[var(--color-coffee-800)]">
              Fasilitas Utama
            </h2>

            <div className="mt-3 flex flex-wrap gap-3">
              {shop.wifi && (
                <div className={`${glassCard} mt-3 p-4`}>
                  <div className="flex items-center gap-2">
                    <Wifi size={18} />
                    <span className="font-bold">WiFi</span>
                  </div>

                  <p className="mt-2 text-sm text-stone-600">
                    {shop.wifiProvider || "Belum diisi"}
                  </p>
                </div>
              )}

              {shop.powerSocket && (
                <div className={`${glassCard} mt-3 p-4`}>
                  <div className="flex items-center gap-2">
                    <Plug size={18} />
                    <span className="font-bold">Stop Kontak</span>
                  </div>

                  <p className="mt-2 text-sm text-stone-600">
                    {shop.socketCount || 0} Titik
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={toggleFavorite}
              className={`
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl
                  px-4
                  py-3

                  font-bold

                  shadow-md
                  transition
                  duration-300

                  ${
                    favorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  }
                  `}
            >
              <Heart size={18} fill={favorite ? "currentColor" : "none"} />

              {favorite ? "Tersimpan" : "Simpan Favorit"}
            </button>

            {shop.mapsLink && (
              <a
                href={shop.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-coffee-700)] px-4 text-sm font-bold text-white hover:bg-[var(--color-coffee-800)]"
              >
                Buka Google Maps
              </a>
            )}

            {shop.instagramLink && (
              <a
                href={shop.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-pink-300 bg-pink-50 px-4 text-sm font-bold text-pink-700"
              >
                <Camera size={18} />
                Instagram
              </a>
            )}

            {shop.tiktokLink && (
              <a
                href={shop.tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-bold text-white"
              >
                <Music2 size={18} />
                TikTok
              </a>
            )}
          </div>
          <div className="mt-8 border-t border-[var(--color-coffee-100)] pt-6">
            <SectionHeader subtitle="Review" title="Tulis Review" />

            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={24}
                    fill={star <= rating ? "#f59e0b" : "none"}
                    className="text-amber-500"
                  />
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Bagikan pengalamanmu..."
              className="
              mt-4
              w-full
              rounded-2xl
              border
              border-amber-100
              bg-white
              p-4
              outline-none
              transition
              focus:ring-4
              focus:ring-[rgba(143,90,47,0.12)]
              "
            />

            <button
              onClick={handleSubmitReview}
              disabled={sendingReview}
              className="
                mt-4

                rounded-2xl

                bg-[var(--color-coffee-700)]

                px-5
                py-3

                font-bold
                text-white

                shadow-lg

                transition
                duration-300

                hover:scale-[1.02]
                hover:bg-[var(--color-coffee-800)]
                "
            >
              {sendingReview ? "Mengirim..." : "Kirim Review"}
            </button>
            <div className="mt-8">
              <SectionHeader subtitle="Ulasan" title="Review Pengguna" />

              {reviews.length === 0 ? (
                <div className={`${glassCard} p-4`}>Belum ada review.</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className={`${glassCard} p-4`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[var(--color-coffee-800)]">
                          {review.userName}
                        </h4>

                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              fill="#f59e0b"
                              className="text-amber-500"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-amber-100
      bg-white
      p-4
      "
    >
      <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-6 text-[var(--color-coffee-800)]">
        {value}
      </p>
    </div>
  );
}
