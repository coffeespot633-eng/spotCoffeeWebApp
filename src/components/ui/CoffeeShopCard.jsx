import { Link } from "react-router";
import {
  Star,
  Crown,
  CalendarDays,
  BadgePercent,
  Wifi,
  Plug,
} from "lucide-react";

import {
  glassCard,
  glassHover,
} from "../../utils/uiClasses";

export default function CoffeeShopCard({ shop }) {
  return (
    <article
      className={`${glassCard} ${glassHover} group flex h-full flex-col overflow-hidden`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-coffee-100)]">

        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {shop.featured && (
            <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow">
              <Star size={12} />
              Featured
            </div>
          )}

          {shop.premium && (
            <div className="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow">
              <Crown size={12} />
              Premium
            </div>
          )}

          {shop.hasPromo && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
              <BadgePercent size={12} />
              Promo
            </div>
          )}

          {shop.hasEvent && (
            <div className="flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white shadow">
              <CalendarDays size={12} />
              Event
            </div>
          )}
        </div>

        {shop.imageUrl ? (
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--color-coffee-300)]">
            Tidak ada foto
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-bold text-[var(--color-coffee-700)] backdrop-blur-xl shadow-lg">
          {shop.priceRange || "Harga belum diisi"}
        </div>

      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <Star
            size={16}
            fill="#f59e0b"
            className="text-amber-500"
          />

          <span className="text-sm font-bold text-[var(--color-coffee-800)]">
            {shop.averageRating || 0}
          </span>

          <span className="text-xs text-stone-500">
            ({shop.reviewCount || 0} review)
          </span>
        </div>
        <h3 className="line-clamp-1 text-xl font-extrabold tracking-tight text-[var(--color-coffee-800)]">
          {shop.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
          {shop.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {shop.wifi && (
            <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-bold text-[var(--color-coffee-700)] backdrop-blur-xl">
              <Wifi size={12} />
              WiFi
            </div>
          )}

          {shop.powerSocket && (
            <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-bold text-[var(--color-coffee-700)] backdrop-blur-xl">
              <Plug size={12} />
              Stop Kontak
            </div>
          )}
        </div>

        <div className="mt-5 space-y-2 border-t border-[var(--color-coffee-100)] pt-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-stone-500">Lokasi</span>
            <span className="max-w-[65%] truncate text-right font-bold text-[var(--color-coffee-700)]">
              {shop.address}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-stone-500">Jam buka</span>
            <span className="font-bold text-[var(--color-coffee-700)]">
              {shop.operatingHours || "Hubungi kafe"}
            </span>
          </div>
        </div>

        <Link
          to={`/coffee-shop/${shop.id}`}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-coffee-700)] px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-[var(--color-coffee-800)]"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
