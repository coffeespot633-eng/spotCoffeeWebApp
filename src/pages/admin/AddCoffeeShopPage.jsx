import { useState } from "react";
import { useNavigate } from "react-router";
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
  Plus,
  ImagePlus,
  Trash2,
} from "lucide-react";

import ImageUpload from "../../components/ui/ImageUpload";

export default function AddCoffeeShopPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedSuitableFor, setSelectedSuitableFor] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    operatingHours: "",
    atmosphere: "",
    favoriteMenus: [
      {
        name: "",
        price: "",
        imageFile: null,
      },
    ],

    mapsLink: "",

    instagramLink: "",
    tiktokLink: "",

    priceRange: "",

    wifi: false,
    powerSocket: false,
    wifiProvider: "",
    socketCount: "",

    crowdLevel: "tenang",

    featured: false,
    premium: false,

    hasPromo: false,
    hasEvent: false,
  });

  const listFacilities = [
    "WiFi",
    "Indoor AC",
    "Outdoor / Smoking Area",
    "Area Parkir",
    "Stop Kontak",
    "Musholla",
  ];
  const suitableOptions = ["Nugas", "Meeting", "Nongkrong"];

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFacilityChange = (facility) => {
    setSelectedFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility],
    );
  };

  const handleSuitableForChange = (item) => {
    setSelectedSuitableFor((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  const handleMenuChange = (index, field, value) => {
    const updatedMenus = [...formData.favoriteMenus];

    updatedMenus[index][field] = value;

    setFormData({
      ...formData,
      favoriteMenus: updatedMenus,
    });
  };

  const addMenuField = () => {
    setFormData({
      ...formData,
      favoriteMenus: [
        ...formData.favoriteMenus,
        {
          name: "",
          price: "",
          imageFile: null,
        },
      ],
    });
  };

  const removeMenuField = (index) => {
    const updatedMenus = formData.favoriteMenus.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      favoriteMenus: updatedMenus,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!imageFile) {
      setLoading(false);
      return setError("Harap pilih foto coffee shop terlebih dahulu.");
    }

    try {
      await coffeeShopService.create(
        {
          ...formData,
          facilities: selectedFacilities,
          suitableFor: selectedSuitableFor,
        },
        imageFile,
        galleryFiles,
      );

      setSuccess("Berhasil menambahkan coffee shop baru.");

      setFormData({
        name: "",
        description: "",
        address: "",
        operatingHours: "",
        atmosphere: "",
        favoriteMenus: [
          {
            name: "",
            price: "",
            imageFile: null,
          },
        ],

        mapsLink: "",

        instagramLink: "",
        tiktokLink: "",

        priceRange: "",

        wifi: false,
        powerSocket: false,
        wifiProvider: "",
        socketCount: "",

        crowdLevel: "tenang",

        featured: false,
        premium: false,

        hasPromo: false,
        hasEvent: false,
      });

      setImageFile(null);
      setSelectedFacilities([]);
      setSelectedSuitableFor([]);

      setTimeout(() => {
        navigate("/admin/coffee-shops");
      }, 1200);
    } catch (err) {
      setError(
        "Gagal menyimpan data. Periksa koneksi atau konfigurasi Cloudinary.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files);

    setGalleryFiles(files);

    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
          Create data
        </p>
        <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">
          Tambah Coffee Shop
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Isi detail tempat, fasilitas, dan foto utama untuk ditampilkan di
          website.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--color-coffee-100)] bg-white p-5 shadow-sm md:p-7">
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <Input
            label="Nama Coffee Shop"
            name="name"
            placeholder="Contoh: Kopi Senja Workspace"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Deskripsi dan Suasana
            </span>
            <textarea
              name="description"
              rows="4"
              placeholder="Ceritakan suasana tempat, menu andalan, atau kecocokan untuk nugas..."
              className="w-full rounded-xl border border-[var(--color-coffee-200)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-coffee-500)] focus:ring-4 focus:ring-[rgba(143,90,47,0.12)]"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <Input
            label="Alamat Lengkap"
            name="address"
            placeholder="Jl. Kopi Nikmat No. 45"
            value={formData.address}
            onChange={handleChange}
            required
          />
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

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Jam Operasional"
              name="operatingHours"
              placeholder="09:00 - 23:00"
              value={formData.operatingHours}
              onChange={handleChange}
              required
            />
            <Input
              label="Range Harga Menu"
              name="priceRange"
              placeholder="Rp 20k - Rp 50k"
              value={formData.priceRange}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--color-coffee-700)]">
                Menu Favorit
              </p>

              <button
                type="button"
                onClick={addMenuField}
                className="
                    rounded-xl
                    bg-[var(--color-coffee-700)]
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    "
              >
                <Plus size={16} />
                Tambah Menu
              </button>
            </div>

            <div className="grid gap-4">
              {formData.favoriteMenus.map((menu, index) => (
                <div
                  key={index}
                  className="
                        rounded-2xl
                        border
                        border-[var(--color-coffee-200)]
                        p-4
                        "
                >
                  <div className="grid gap-3">
                    <Input
                      label="Nama Menu"
                      value={menu.name}
                      onChange={(e) =>
                        handleMenuChange(index, "name", e.target.value)
                      }
                    />

                    <Input
                      label="Harga"
                      value={menu.price}
                      onChange={(e) =>
                        handleMenuChange(index, "price", e.target.value)
                      }
                    />

                    <label
                      className="
                            flex
                            cursor-pointer
                            items-center
                            justify-center

                            rounded-2xl

                            border-2
                            border-dashed
                            border-[var(--color-coffee-200)]

                            bg-[var(--color-cream-50)]

                            p-6

                            text-sm
                            font-semibold

                            text-[var(--color-coffee-700)]

                            transition

                            hover:bg-[var(--color-coffee-100)]
                            "
                    >
                      <ImagePlus size={18} />
                      Upload Foto Menu
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleMenuChange(
                            index,
                            "imageFile",
                            e.target.files[0],
                          )
                        }
                      />
                    </label>
                    {menu.imageFile && (
                      <>
                        <img
                          src={URL.createObjectURL(menu.imageFile)}
                          alt="Preview"
                          className="
                                h-40
                                w-full

                                rounded-2xl

                                object-cover
                                "
                        />

                        <p className="text-sm font-semibold text-emerald-600">
                          ✓ {menu.imageFile.name}
                        </p>
                      </>
                    )}

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMenuField(index)}
                        className="
                              text-sm
                              font-bold
                              text-red-500
                              "
                      >
                        Hapus Menu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Link Google Maps"
            name="mapsLink"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            value={formData.mapsLink}
            onChange={handleChange}
            required
          />
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
            <p className="text-sm font-bold text-[var(--color-coffee-700)]">
              Fasilitas yang Tersedia
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {listFacilities.map((facility) => (
                <label
                  key={facility}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition ${
                    selectedFacilities.includes(facility)
                      ? "border-[var(--color-coffee-700)] bg-[var(--color-coffee-700)] text-white"
                      : "border-[var(--color-coffee-200)] bg-white text-[var(--color-coffee-700)] hover:bg-[var(--color-coffee-50)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="sr-only"
                  />
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

          <div className="grid gap-4 md:grid-cols-2">
            {formData.wifi && (
              <Input
                label="Provider WiFi"
                name="wifiProvider"
                placeholder="Indihome 100 Mbps"
                value={formData.wifiProvider}
                onChange={handleChange}
              />
            )}

            {formData.powerSocket && (
              <Input
                label="Jumlah Stop Kontak"
                name="socketCount"
                placeholder="24"
                value={formData.socketCount}
                onChange={handleChange}
              />
            )}
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
            <span className="text-sm font-bold text-[var(--color-coffee-700)]">
              Foto Tempat
            </span>
            <ImageUpload
              id="thumbnail-image"
              preview={previewImage}
              onChange={handleImageChange}
            />
          </label>

          <label>Galeri Coffee Shop</label>

          <div className="grid gap-3">
            <input
              id="gallery-images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleGalleryChange}
            />

            <label
              htmlFor="gallery-images"
              className="
      flex
      cursor-pointer
      items-center
      justify-center
      rounded-2xl
      border-2
      border-dashed
      border-[var(--color-coffee-200)]
      bg-[var(--color-cream-50)]
      p-6
      font-semibold
      text-[var(--color-coffee-700)]
      hover:bg-[var(--color-coffee-100)]
    "
            >
              🖼️ Pilih Foto Galeri
            </label>

            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {galleryPreviews.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-coffee-100)] pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/coffee-shops")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mengunggah..." : "Simpan Coffee Shop"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
