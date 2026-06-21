import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { bannerService } from "../../services/bannerService";
import { coffeeShopService } from "../../services/coffeeShopService";
import ImageUpload from "../../components/ui/ImageUpload";

export default function EditBannerPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [coffeeShops, setCoffeeShops] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coffeeShopId: "",
    isActive: true,
    imageUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shops = await coffeeShopService.getAll();

        setCoffeeShops(shops);

        const banner = await bannerService.getById(id);

        if (!banner) {
          setError("Data banner tidak ditemukan.");
          return;
        }

        setFormData({
          title: banner.title || "",
          description: banner.description || "",
          coffeeShopId: banner.coffeeShopId || "",
          isActive: banner.isActive ?? true,
          imageUrl: banner.imageUrl || "",
        });

        setPreviewImage(banner.imageUrl || "");
      } catch (err) {
        console.error(err);

        setError("Gagal memuat data banner.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await bannerService.update(id, formData, imageFile);

      setSuccess("Banner berhasil diperbarui.");

      setTimeout(() => {
        navigate("/admin/banners");
      }, 1200);
    } catch (err) {
      console.error(err);

      setError("Gagal memperbarui banner.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <section>
        <h2 className="text-3xl font-black">Memuat data banner...</h2>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
          Banner Management
        </p>

        <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">
          Edit Banner
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          Perbarui informasi banner promo atau event.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--color-coffee-100)] bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <Input
            label="Judul Banner"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Deskripsi
            </span>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="rounded-xl border border-[var(--color-coffee-200)] p-4 outline-none focus:border-[var(--color-coffee-500)]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Coffee Shop Terkait
            </span>

            <select
              name="coffeeShopId"
              value={formData.coffeeShopId}
              onChange={handleChange}
              className="rounded-xl border border-[var(--color-coffee-200)] p-3"
            >
              <option value="">Pilih Coffee Shop</option>

              {coffeeShops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3">
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Gambar Banner
            </span>

            <ImageUpload
              id="banner-image"
              label="Gambar Banner"
              preview={previewImage}
              onChange={handleImageChange}
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-[var(--color-coffee-200)] p-4">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
            />
            Banner Aktif
          </label>

          <div className="flex justify-end gap-3 border-t border-[var(--color-coffee-100)] pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/banners")}
            >
              Batal
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Update Banner"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
