import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { coffeeShopService } from "../../services/coffeeShopService";

export default function ManageCoffeeShopPage() {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    try {
      const data = await coffeeShopService.getAll();
      setCoffeeShops(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchShops();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Hapus data?",
      text: `Data "${name}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6f4224",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await coffeeShopService.delete(id);
        Swal.fire({
          title: "Terhapus",
          text: "Data berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#6f4224",
        });
        fetchShops();
      } catch {
        Swal.fire("Error", "Gagal menghapus data.", "error");
      }
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-sm font-bold text-stone-500">Memuat data manajemen...</div>;
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">Data master</p>
          <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">Kelola Coffee Shop</h2>
          <p className="mt-2 text-sm text-stone-500">Tambah, ubah, atau hapus data kedai kopi terdaftar.</p>
        </div>
        <Link
          to="/admin/add-coffee-shop"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-coffee-700)] px-4 text-sm font-bold text-white hover:bg-[var(--color-coffee-800)]"
        >
          Tambah Kafe Baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-coffee-100)] bg-white shadow-sm">
        {coffeeShops.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-xl font-black text-[var(--color-coffee-800)]">Belum ada data coffee shop</h3>
            <p className="mt-2 text-sm text-stone-500">Tambahkan data pertama dari tombol di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-coffee-100)] bg-[var(--color-cream-50)] text-[var(--color-coffee-700)]">
                  <th className="px-5 py-4 font-black">Foto</th>
                  <th className="px-5 py-4 font-black">Nama Tempat</th>
                  <th className="px-5 py-4 font-black">Harga</th>
                  <th className="px-5 py-4 font-black">Jam Buka</th>
                  <th className="px-5 py-4 text-center font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-coffee-100)]">
                {coffeeShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-[var(--color-cream-50)]">
                    <td className="px-5 py-4">
                      <img
                        src={shop.imageUrl || "https://placehold.co/120x120/f2e6d6/6f4224?text=Spot"}
                        alt={shop.name}
                        className="size-14 rounded-xl object-cover"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black text-[var(--color-coffee-800)]">{shop.name}</div>
                      <div className="mt-1 line-clamp-1 text-xs font-semibold text-stone-500">{shop.address}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-600">{shop.priceRange}</td>
                    <td className="px-5 py-4 font-semibold text-stone-600">{shop.operatingHours}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/edit-coffee-shop/${shop.id}`}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(shop.id, shop.name)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
