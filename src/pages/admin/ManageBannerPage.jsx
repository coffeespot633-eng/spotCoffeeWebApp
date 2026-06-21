import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { bannerService } from "../../services/bannerService";

export default function ManageBannerPage() {
  const [banners, setBanners] = useState([]);

  const fetchData = async () => {
    const data = await bannerService.getAll();
    setBanners(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Banner?",
      text: "Banner yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    await bannerService.delete(id);

    await fetchData();

    Swal.fire({
      title: "Berhasil",
      text: "Banner berhasil dihapus.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <section>
      {banners.length === 0 ? (
        <div
          className="
      mt-10
      rounded-3xl
      border
      border-dashed
      border-[var(--color-coffee-200)]
      bg-white
      p-10
      text-center
    "
        >
          <h3 className="text-xl font-black text-[var(--color-coffee-700)]">
            Belum Ada Banner
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Tambahkan banner promo atau event pertama.
          </p>

          <Link
            to="/admin/add-banner"
            className="
        mt-4
        inline-flex
        rounded-xl
        bg-[var(--color-coffee-700)]
        px-4
        py-2
        text-white
        font-bold
      "
          >
            Tambah Banner
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="
        flex
        items-center
        justify-between

        rounded-3xl

        border
        border-white/40

        bg-white/70

        p-4

        transition
        hover:bg-white

        backdrop-blur-xl
      "
            >
              <div className="flex items-center gap-4">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="
            h-20
            w-32

            rounded-2xl

            object-cover

            shadow-sm
          "
                />

                <div>
                  <h3 className="font-black text-[var(--color-coffee-800)]">
                    {banner.title}
                  </h3>

                  <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                    {banner.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`
            rounded-full
            px-3
            py-1

            text-xs
            font-bold

            ${
              banner.isActive
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }
          `}
                >
                  {banner.isActive ? "Aktif" : "Nonaktif"}
                </span>

                <Link
                  to={`/admin/edit-banner/${banner.id}`}
                  className="
            rounded-xl
            border
            border-amber-100

            px-4
            py-2

            text-sm
            font-bold

            text-[var(--color-coffee-700)]
          "
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(banner.id)}
                  className="
            rounded-xl

            bg-red-500

            px-4
            py-2

            text-sm
            font-bold
            text-white
          "
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
