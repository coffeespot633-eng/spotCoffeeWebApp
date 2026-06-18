import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { favoriteService } from "../services/favoriteService";
import { coffeeShopService } from "../services/coffeeShopService";
import CoffeeShopCard from "../components/ui/CoffeeShopCard";

export default function FavoritesPage() {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!user) return;

        const favorites =
          await favoriteService.getUserFavorites(
            user.uid
          );

        const coffeeShopIds = favorites.map(
          (item) => item.coffeeShopId
        );

        const allCoffeeShops =
          await coffeeShopService.getAll();

        const favoriteShops =
          allCoffeeShops.filter((shop) =>
            coffeeShopIds.includes(shop.id)
          );

        setShops(favoriteShops);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <p className="text-sm font-extrabold uppercase tracking-widest text-red-500">
          Favorite Collection
        </p>

        <h1 className="text-4xl font-black text-[var(--color-coffee-800)]">
          Coffee Shop Favorit
        </h1>
      </div>

      {loading ? (
        <div className="text-center">
          Memuat favorit...
        </div>
      ) : shops.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <CoffeeShopCard
              key={shop.id}
              shop={shop}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-coffee-200)] bg-white p-10 text-center">
          <h3 className="text-xl font-black text-[var(--color-coffee-800)]">
            Belum ada favorit
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Simpan coffee shop favoritmu
            terlebih dahulu.
          </p>
        </div>
      )}
    </div>
  );
}