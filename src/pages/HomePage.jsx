import { useEffect, useMemo, useState } from "react";
import { coffeeShopService } from "../services/coffeeShopService";
import CoffeeShopCard from "../components/ui/CoffeeShopCard";
import logo from "../assets/logo.png";
import BannerSlider from "../components/home/BannerSlider";
import SectionHeader from "../components/ui/SectionHeader";
import { Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  glassCard,
  glassHover,
} from "../utils/uiClasses";


const filters = ["Nugas", "Meeting", "Nongkrong", "WiFi", "Stop Kontak", "Outdoor"];
function shuffleArray(array) {
  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

export default function HomePage() {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] =
  useState([]);
  const navigate = useNavigate();
  const featuredShop =
  coffeeShops.find((shop) => shop.featured) ||
  coffeeShops[0];
  const featuredShops = coffeeShops.filter(
  (shop) => shop.featured
  );

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await coffeeShopService.getAll();
        setCoffeeShops(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const keyword =
      search.toLowerCase();

    const result = coffeeShops.filter(
      (shop) => {
        const content = [
          shop.name,
          shop.address,
          shop.description,

          ...(shop.facilities || []),
          ...(shop.suitableFor || []),

          shop.crowdLevel || "",

          shop.wifi ? "wifi" : "",
          shop.powerSocket
            ? "stop kontak"
            : "",
        ]
          .join(" ")
          .toLowerCase();

        return content.includes(
          keyword
        );
      }
    );

    setSuggestions(
      result.slice(0, 5)
    );
  }, [search, coffeeShops]);

  const topRatedShops = useMemo(() => {
  return [...coffeeShops]
    .filter(
      (shop) =>
        shop.averageRating &&
        shop.reviewCount >= 1
    )
    .sort((a, b) => {
      if (
        b.averageRating ===
        a.averageRating
      ) {
        return (
          b.reviewCount -
          a.reviewCount
        );
      }

      return (
        b.averageRating -
        a.averageRating
      );
    })
    .slice(0, 3);
}, [coffeeShops]);

  const filteredShops = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  let shops = coffeeShops;

  if (keyword) {
    shops = coffeeShops.filter((shop) => {
      const content = [
        shop.name,
        shop.address,
        shop.description,

        ...(shop.facilities || []),

        ...(shop.suitableFor || []),

        shop.crowdLevel || "",

        shop.wifi ? "wifi" : "",
        shop.powerSocket ? "stop kontak" : "",
      ]
      .join(" ")
      .toLowerCase();

      return content.includes(keyword);
    });
  }

 const priorityShops = shops
  .filter(
    (shop) =>
      !shop.featured &&
      (
        shop.premium ||
        shop.hasPromo ||
        shop.hasEvent
      )
  )
  .sort((a, b) => {
    const scoreA =
      (a.featured ? 100 : 0) +
      (a.hasPromo ? 50 : 0) +
      (a.hasEvent ? 40 : 0) +
      (a.premium ? 30 : 0);

    const scoreB =
      (b.featured ? 100 : 0) +
      (b.hasPromo ? 50 : 0) +
      (b.hasEvent ? 40 : 0) +
      (b.premium ? 30 : 0);

    return scoreB - scoreA;
  });
  const normalShops =
  shuffleArray(
    shops.filter(
      (shop) =>
        !shop.featured &&
        !shop.premium &&
        !shop.hasPromo &&
        !shop.hasEvent
    )
  );

    

  return [...priorityShops, ...normalShops];
}, [coffeeShops, search]);

  return (
    <div>
      <section className="border-b border-[var(--color-coffee-100)] pt-6">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:py-16">
          <div>
            <img src={logo} alt="Spot Coffee" className="mb-6 h-24 w-80 max-w-full object-contain object-left" />
            <span className="inline-flex rounded-full bg-[var(--color-coffee-100)] px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-[var(--color-coffee-700)]">
              Rekomendasi coffee shop
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[var(--color-coffee-800)] md:text-6xl">
              Temukan spot ngopi yang pas untuk kerja, nugas, meeting, atau santai.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              Cari coffee shop berdasarkan suasana, fasilitas, harga, jam operasional, dan lokasi sebelum kamu datang.
            </p>

            <div className={`mt-8 p-4 ${glassCard}`}>
              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Cari nama, area, WiFi, outdoor..."
                    className="
                    h-14
                    w-full

                    rounded-2xl

                    border
                    border-[var(--color-coffee-100)]

                    bg-white

                    px-5

                    text-sm
                    font-medium

                    outline-none

                    transition

                    focus:border-[var(--color-coffee-400)]
                    focus:ring-4
                    focus:ring-[rgba(143,90,47,0.08)]
                    "
                  />

                  {suggestions.length > 0 && (
                    <div
                      className="
                      absolute
                      left-0
                      right-0
                      top-16

                      z-50

                      overflow-hidden

                      rounded-2xl

                      border
                      border-[var(--color-coffee-100)]

                      bg-white

                      shadow-xl
                      "
                    >
                      {suggestions.map((shop) => (
                        <button
                          key={shop.id}
                          onClick={() => {
                            navigate(
                              `/coffee-shop/${shop.id}`
                            );
                          }}
                          className="
                          flex
                          w-full
                          items-center
                          gap-3

                          p-4

                          text-left

                          hover:bg-[var(--color-coffee-50)]
                          "
                        >
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

                          <div>
                            <p className="font-bold text-[var(--color-coffee-800)]">
                              {shop.name}
                            </p>

                            <p className="text-xs text-stone-500">
                              {shop.address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                <button
                  onClick={() => {
                    const first =
                      suggestions[0];

                    if (first) {
                      navigate(
                        `/coffee-shop/${first.id}`
                      );
                    }
                  }}
                  className="
                  h-14

                  rounded-2xl

                  bg-[var(--color-coffee-700)]

                  px-8

                  text-sm
                  font-bold

                  text-white

                  transition

                  hover:bg-[var(--color-coffee-800)]
                  "
                >
                  Cari Spot
                </button>

              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSearch(filter)}
                    className="rounded-full border border-[var(--color-coffee-100)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-coffee-600)] hover:bg-[var(--color-coffee-50)]"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Link  to={featuredShop ? `/coffee-shop/${featuredShop.id}` : "#"}
    className={`block p-4 ${glassCard} ${glassHover}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--color-coffee-100)]">
              {featuredShop?.imageUrl ? (
                <img src={featuredShop.imageUrl} alt={featuredShop.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-[var(--color-coffee-400)]">
                  Foto coffee shop akan tampil di sini
                </div>
              )}
            </div>
            <div className="p-2 pt-5">
              <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
                Featured Coffee Shop
              </p>

              {featuredShop?.featured && (
                <span className="mt-2 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  <Star size={14} /> Featured
                </span>
              )}

              <h2 className="mt-3 text-2xl font-black text-[var(--color-coffee-800)]">
                {featuredShop?.name || "Tambahkan data coffee shop pertama"}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                {featuredShop?.description ||
                  "Data dari Firestore akan muncul otomatis setelah admin menambahkan coffee shop."}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <BannerSlider />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 md:px-8">
  {featuredShops.length > 0 && (
    <>
      <div className="mb-6">
        <SectionHeader
          subtitle="Featured Collection"
          title="Coffee Shop Unggulan"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {featuredShops.slice(0, 2).map((shop) => (
          <Link
            key={shop.id}
            to={`/coffee-shop/${shop.id}`}
           className={`${glassCard} ${glassHover} overflow-hidden`}
          >
            <div className="aspect-[16/9] overflow-hidden rounded-t-3xl">
              <img
                src={
                  shop.imageUrl ||
                  "/placeholder-coffee.jpg"
                }
                alt={shop.name}
                className="
                h-full
                w-full
                rounded-xl
                object-cover
                "
              />
            </div>

            <div className="p-6">
              <span className="inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                Featured
              </span>

              <h3 className="mt-3 text-2xl font-black text-[var(--color-coffee-800)]">
                {shop.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                {shop.description}
              </p>
              <div className="mt-5 inline-flex items-center rounded-2xl bg-[var(--color-coffee-700)] px-4 py-2 text-sm font-bold text-white">
                Lihat Detail
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )}
</section>

<section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
  <SectionHeader
    subtitle="Top Rated"
    title="Coffee Shop Rating Tertinggi"
  />

  {topRatedShops.length > 0 && (
    <div className="grid gap-6 md:grid-cols-3">
      {topRatedShops.map(
        (shop, index) => (
          <Link
            key={shop.id}
            to={`/coffee-shop/${shop.id}`}
            className={`${glassCard} ${glassHover} group p-6`}>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-amber-500">
                #{index + 1}
              </span>

              <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white">
                ⭐ {shop.averageRating}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-black text-[var(--color-coffee-800)]">
              {shop.name}
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              {shop.reviewCount} review
            </p>

            <p className="mt-3 line-clamp-2 text-sm text-stone-600">
              {shop.description}
            </p>

            <div className="mt-4 text-sm font-bold text-[var(--color-coffee-700)]">
              Lihat Detail →
            </div>
          </Link>
        )
      )}
    </div>
  )}
</section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            subtitle="Daftar Rekomendasi"
            title="Coffee Shop Tersedia"
          />
          <p className="text-sm font-semibold text-stone-500">{filteredShops.length} tempat ditemukan</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredShops.map((shop) => (
              <CoffeeShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className={`${glassCard} p-10 text-center`}>
            <h3 className="text-xl font-black text-[var(--color-coffee-800)]">Belum ada hasil</h3>
            <p className="mt-2 text-sm text-stone-500">Coba kata kunci lain atau hapus filter pencarian.</p>
          </div>
        )}
      </section>
    </div>
  );
}
