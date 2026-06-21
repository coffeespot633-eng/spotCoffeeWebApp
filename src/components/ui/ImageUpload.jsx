export default function ImageUpload({ id, preview, onChange }) {
  return (
    <div className="grid gap-3">
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />

      <label
        htmlFor={id}
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

          hover:bg-[var(--color-coffee-100)]
        "
      >
        📷 Pilih Gambar
      </label>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="
            h-56
            w-full
            rounded-2xl
            object-cover
          "
        />
      )}
    </div>
  );
}
