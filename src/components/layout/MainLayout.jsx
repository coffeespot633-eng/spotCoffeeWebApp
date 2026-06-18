import { Outlet, Link } from "react-router";
import logo from "../../assets/logo.png";
import useAuthStore from "../../store/authStore";
import {
  Heart,
  LogOut,
  User,
} from "lucide-react";

export default function MainLayout() {
  const { user, isAuthenticated } =
    useAuthStore();

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-coffee-800)] selection:bg-[var(--color-coffee-700)] selection:text-white">
      
      {/* Floating Navbar */}
      <header className="fixed left-0 right-0 top-4 z-50 px-4">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-3xl border border-white/40 bg-white/70 backdrop-blur-2xl px-6 shadow-2xl backdrop-blur-xl">
          
          <Link
            to="/"
            className="flex items-center"
            aria-label="Spot Coffee"
          >
            <img
              src={logo}
              alt="Spot Coffee"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-2 md:gap-3">
            <Link
              to="/"
              className="hidden rounded-2xl px-4 py-2 text-sm font-bold text-[var(--color-coffee-600)] transition hover:bg-[var(--color-coffee-100)] sm:inline-flex"
            >
              Beranda
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-[var(--color-coffee-600)] transition hover:bg-[var(--color-coffee-100)]"
                >
                  <User size={16} />
                  Profil
                </Link>

                <Link
                  to="/favorites"
                  className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-[var(--color-coffee-600)] transition hover:bg-[var(--color-coffee-100)]"
                >
                  <Heart size={16} />
                  Favorit
                </Link>

                <div className="hidden items-center gap-3 md:flex">
                  <div
                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-full

                    bg-[var(--color-coffee-700)]

                    text-sm
                    font-black
                    text-white
                  "
                  >
                    {(
                      user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"
                    ).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[var(--color-coffee-800)]">
                      {user?.displayName ||
                        "Pengguna"}
                    </p>

                    <p className="text-xs text-stone-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() =>
                    useAuthStore
                      .getState()
                      .logout()
                  }
                  className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-red-200

                    bg-red-50

                    px-4
                    py-2

                    text-sm
                    font-bold

                    text-red-600

                    transition

                    hover:bg-red-100
                    "
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl px-4 py-2 text-sm font-bold text-[var(--color-coffee-600)] transition hover:bg-[var(--color-coffee-100)]"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="rounded-2xl bg-[var(--color-coffee-700)] px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:bg-[var(--color-coffee-800)]"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32">
        <Outlet />
      </main>
    </div>
  );
}