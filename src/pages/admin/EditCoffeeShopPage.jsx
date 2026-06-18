import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { coffeeShopService } from "../../services/coffeeShopService";
import {
  Wifi,
  Plug,
  Users,
  Star,
  Crown,
  Briefcase,
  Coffee,
  Laptop,
} from "lucide-react";

const listFacilities = ["WiFi", "Indoor AC", "Outdoor / Smoking Area", "Area Parkir", "Stop Kontak", "Musholla"];
const suitableOptions = [
  "Nugas",
  "Meeting",
  "Nongkrong",
];

export default function EditCoffeeShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  address: "",
  operatingHours: "",
  atmosphere: "",
  favoriteMenu: "",
  mapsLink: "",

  instagramLink: "",
  tiktokLink: "",

  priceRange: "",

  wifi: false,
  powerSocket: false,

  crowdLevel: "tenang",

  featured: false,
  premium: false,

  hasPromo: false,
  hasEvent: false,
});
  const [facilities, setFacilities] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedSuitableFor, setSelectedSuitableFor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [success] = useState("");
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const loadOldData = async () => {
      try {
        const oldData = await coffeeShopService.getById(id);
        if (oldData) {
          setFormData({
            name: oldData.name || "",
            description: oldData.description || "",
            atmosphere: oldData.atmosphere || "",
            favoriteMenu: oldData.favoriteMenu || "",
            imageUrl: oldData.imageUrl || "",
            address: oldData.address || "",
            operatingHours: oldData.operatingHours || "",
            mapsLink: oldData.mapsLink || "",

            instagramLink: oldData.instagramLink || "",
            tiktokLink: oldData.tiktokLink || "",

            priceRange: oldData.priceRange || "",

            wifi: oldData.wifi || false,
            powerSocket: oldData.powerSocket || false,

            crowdLevel: oldData.crowdLevel || "tenang",

            featured: oldData.featured || false,
            premium: oldData.premium || false,

            hasPromo: oldData.hasPromo || false,
            hasEvent: oldData.hasEvent || false,
          });
          setFacilities(oldData.facilities || []);
          setSelectedSuitableFor(
            oldData.suitableFor || []
          );
        }
      } catch {
        Swal.fire("Error", "Gagal memuat data lama kafe.", "error");
        navigate("/admin/coffee-shops");
      } finally {
        setLoading(false);
      }
    };
    loadOldData();
  }, [id, navigate]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = (facility) => {
    setFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await coffeeShopService.update(id, { ...formData, facilities, suitableFor: selectedSuitableFor, }, imageFile);
      await Swal.fire({
        title: "Tersimpan",
        text: "Data coffee shop berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#6f4224",
      });
      navigate("/admin/coffee-shops");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal memperbarui data.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuitableForChange = (item) => {
    setSelectedSuitableFor((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  };

  if (loading) return <div className="rounded-2xl bg-white p-6 text-sm font-bold text-stone-500">Memuat data lama kafe...</div>;

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">Update data</p>
        <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">Edit Coffee Shop</h2>
        <p className="mt-2 text-sm text-stone-500">Ubah informasi kedai kopi pilihanmu di bawah ini.</p>
      </div>

      <div className="rounded-3xl border border-[var(--color-coffee-100)] bg-white p-5 shadow-sm md:p-7">
          {error && <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          {success && <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <Input label="Nama Coffee Shop" name="name" placeholder="Contoh: Kopi Senja Workspace" value={formData.name} onChange={handleChange} required />
            <Input label="Alamat Lengkap" name="address" placeholder="Jl. Kopi Nikmat No. 45" value={formData.address} onChange={handleChange} required />
            <label className="grid gap-2">
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Suasana Tempat
            </span>

            <input
                type="text"
                value={formData.atmosphere}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    atmosphere: e.target.value,
                  })
                }
                placeholder="Contoh: Cozy, Tenang, Industrial"
                className="
                  rounded-xl
                  border
                  border-[var(--color-coffee-200)]
                  bg-white
                  p-3
                "
              />
            </label>
            <Input
              label="Menu Favorit"
              name="favoriteMenu"
              value={formData.favoriteMenu}
              onChange={handleChange}
              placeholder="Kopi Susu, Latte, Matcha"
            />
            <Input label="Alamat Lengkap" name="address" placeholder="Jl. Kopi Nikmat No. 45" value={formData.address} onChange={handleChange} required />

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Jam Operasional" name="operatingHours" placeholder="09:00 - 23:00" value={formData.operatingHours} onChange={handleChange} required />
              <Input label="Range Harga Menu" name="priceRange" placeholder="Rp 20k - Rp 50k" value={formData.priceRange} onChange={handleChange} required />
            </div>

            <Input label="Link Google Maps" name="mapsLink" type="url" placeholder="https://maps.app.goo.gl/..." value={formData.mapsLink} onChange={handleChange} required />
            <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Instagram"
              name="instagramLink"
              type="url"
              placeholder="https://instagram.com/namacoffeeshop"
              value={formData.instagramLink}
              onChange={handleChange}
            />

            <Input
              label="TikTok"
              name="tiktokLink"
              type="url"
              placeholder="https://tiktok.com/@namacoffeeshop"
              value={formData.tiktokLink}
              onChange={handleChange}
            />
          </div>

            <div>
              <p className="text-sm font-bold text-[var(--color-coffee-700)]">Fasilitas yang Tersedia</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {listFacilities.map((facility) => (
                  <label
                    key={facility}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition ${
                      facilities.includes(facility)
                        ? "border-[var(--color-coffee-700)] bg-[var(--color-coffee-700)] text-white"
                        : "border-[var(--color-coffee-200)] bg-white text-[var(--color-coffee-700)] hover:bg-[var(--color-coffee-50)]"
                    }`}
                  >
                    <input type="checkbox" checked={facilities.includes(facility)} onChange={() => handleCheckboxChange(facility)} className="sr-only" />
                    {facility}
                  </label>
                ))}
              </div>
            </div>

            <div>

            <p className="mb-3 text-sm font-bold text-[var(--color-coffee-700)]">
              Cocok Untuk
            </p>

            <div className="flex flex-wrap gap-2">
              {suitableOptions.map((item) => {
                const Icon =
                  item === "Nugas"
                    ? Laptop
                    : item === "Meeting"
                    ? Briefcase
                    : Coffee;

                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                      selectedSuitableFor.includes(item)
                        ? "border-[var(--color-coffee-700)] bg-[var(--color-coffee-700)] text-white"
                        : "border-[var(--color-coffee-200)] bg-white text-[var(--color-coffee-700)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedSuitableFor.includes(item)}
                      onChange={() => handleSuitableForChange(item)}
                    />

                    <Icon size={16} />

                    {item}
                  </label>
                );
              })}
            </div>
          </div>
          <div>
    <p className="mb-3 text-sm font-bold text-[var(--color-coffee-700)]">
      Fasilitas Utama
    </p>

    <div className="grid gap-3 md:grid-cols-2">
      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-coffee-200)] p-4">
        <input
          type="checkbox"
          checked={formData.wifi}
          onChange={(e) =>
            setFormData({
              ...formData,
              wifi: e.target.checked,
            })
          }
        />

        <Wifi size={18} />

        Wifi Tersedia
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-coffee-200)] p-4">
        <input
          type="checkbox"
          checked={formData.powerSocket}
          onChange={(e) =>
            setFormData({
              ...formData,
              powerSocket: e.target.checked,
            })
          }
        />

        <Plug size={18} />

        Stop Kontak Tersedia
      </label>
    </div>
  </div>

  <div>
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-bold text-[var(--color-coffee-700)]">
        <Users size={16} />
        Tingkat Keramaian
      </span>

      <select
        value={formData.crowdLevel}
        onChange={(e) =>
          setFormData({
            ...formData,
            crowdLevel: e.target.value,
          })
        }
        className="rounded-xl border border-[var(--color-coffee-200)] bg-white p-3"
      >
        <option value="tenang">Tenang</option>
        <option value="sedang">Sedang</option>
        <option value="ramai">Ramai</option>
      </select>
    </label>
  </div>

  <div>
    <p className="mb-3 text-sm font-bold text-[var(--color-coffee-700)]">
      Status Coffee Shop
    </p>

    <div className="grid gap-3 md:grid-cols-2">
      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-coffee-200)] p-4">
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({
              ...formData,
              featured: e.target.checked,
            })
          }
        />

        <Star size={18} />

        Featured
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-coffee-200)] p-4">
        <input
          type="checkbox"
          checked={formData.premium}
          onChange={(e) =>
            setFormData({
              ...formData,
              premium: e.target.checked,
            })
          }
        />

        <Crown size={18} />

        Premium
      </label>
    </div>
  </div>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-[var(--color-coffee-700)]">Foto Tempat</span>
              {formData.imageUrl && (
                <div className="mb-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-56 w-full rounded-2xl object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files[0])}
                className="w-full rounded-xl border border-dashed border-[var(--color-coffee-200)] bg-[var(--color-cream-50)] p-4 text-sm font-semibold text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-coffee-700)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-coffee-100)] pt-5 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => navigate("/admin/coffee-shops")}>Batal</Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
    </section>
  );
}
