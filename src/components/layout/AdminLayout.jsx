import { Link, Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-coffee-800)] md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-[var(--color-coffee-100)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
              Dashboard Admin
            </p>
            <h1 className="text-2xl font-black text-[var(--color-coffee-800)]">Kelola Konten Spot Coffee</h1>
          </div>
          <Link
            to="/"
            className="inline-flex w-fit min-h-10 items-center rounded-2xl border border-[var(--color-coffee-200)] bg-white px-4 text-sm font-bold text-[var(--color-coffee-700)] hover:bg-[var(--color-coffee-50)]"
          >
            Lihat Website
          </Link>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
