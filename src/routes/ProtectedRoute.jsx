import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuthStore();

  // 1. JIKA MASIH LOADING, TAHAN DI SINI! Jangan biarkan kode bawah mengeksekusi redirect.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--color-cream-100)]">
        <div className="flex flex-col items-center gap-3">
          {/* Efek Spinner Sederhana */}
          <div className="w-10 h-10 border-4 border-[var(--color-coffee-500)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-sm animate-pulse">Memverifikasi Hak Akses Admin...</p>
        </div>
      </div>
    );
  }

  // 2. Jika proses loading SUDAH SELESAI, baru cek apakah dia benar-benar tidak login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika sudah login tapi role-nya tidak diizinkan
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  // Jika semua aman, silakan masuk ke halaman admin
  return <Outlet />;
}