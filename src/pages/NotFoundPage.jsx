import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-[var(--color-coffee-600)]">404</h1>
      <p className="text-lg text-gray-600 mt-2">Halaman tidak ditemukan</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-[var(--color-coffee-500)] text-white rounded-md">
        Kembali ke Beranda
      </Link>
    </div>
  )
}