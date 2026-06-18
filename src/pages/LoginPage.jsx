import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, role } = await authService.login(email, password);
      setUser(user, role);
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError("Email atau password salah. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { user, role } = await authService.loginWithGoogle();
      setUser(user, role);
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError("Gagal login menggunakan Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword =
  async () => {
    const result =
      await Swal.fire({
        title:
          "Reset Password",
        input: "email",
        inputLabel:
          "Masukkan email akun",
        inputPlaceholder:
          "nama@email.com",
        showCancelButton: true,
        confirmButtonText:
          "Kirim",
      });

    if (
      !result.isConfirmed ||
      !result.value
    )
      return;

    try {
      await authService.resetPassword(
        result.value
      );

      await Swal.fire({
        icon: "success",
        title:
          "Email Terkirim",
        text:
          "Link reset password telah dikirim ke email Anda.",
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title:
          "Gagal",
        text:
          "Email tidak ditemukan atau terjadi kesalahan.",
      });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-cream-50)] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-coffee-100)] bg-white p-6 shadow-xl">
        <img src={logo} alt="Spot Coffee" className="mx-auto h-20 object-contain" />
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-black text-[var(--color-coffee-800)]">Masuk</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">Kelola favorit dan akses dashboard sesuai role akun.</p>
        </div>

        {error && <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <form onSubmit={handleLogin} className="mt-6 grid gap-4">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="text-right">
          <button
            type="button"
            onClick={
              handleResetPassword
            }
            className="
              text-sm
              font-bold
              text-[var(--color-coffee-700)]
              hover:underline
            "
          >
            Lupa Password?
          </button>
        </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-coffee-100)]" />
          <span className="text-xs font-black uppercase tracking-widest text-stone-400">Atau</span>
          <div className="h-px flex-1 bg-[var(--color-coffee-100)]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-2xl border border-[var(--color-coffee-200)] bg-white px-4 text-sm font-bold text-stone-700 hover:bg-[var(--color-cream-50)] disabled:opacity-50"
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Belum punya akun?{" "}
          <Link to="/register" className="font-black text-[var(--color-coffee-700)] hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
