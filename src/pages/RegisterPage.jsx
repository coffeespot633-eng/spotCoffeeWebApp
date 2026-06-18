import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) return setError("Password dan konfirmasi password tidak cocok.");
    if (password.length < 6) return setError("Password minimal harus 6 karakter.");

    setLoading(true);

    try {
      const { user, role } = await authService.register(email, password, fullName);
      setUser(user, role);
      navigate("/");
    } catch (err) {
      setError("Gagal mendaftar. Email mungkin sudah digunakan.");
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
      setError("Gagal masuk menggunakan Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-cream-50)] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-coffee-100)] bg-white p-6 shadow-xl">
        <img src={logo} alt="Spot Coffee" className="mx-auto h-20 object-contain" />
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-black text-[var(--color-coffee-800)]">Buat Akun</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">Daftar untuk menyimpan coffee shop favorit.</p>
        </div>

        {error && <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <form onSubmit={handleRegister} className="mt-6 grid gap-4">
          <Input label="Nama Lengkap" placeholder="Nama lengkap" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          <Input label="Alamat Email" type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Password" type="password" placeholder="Minimal 6 karakter" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[var(--color-coffee-200)] bg-white px-4 text-sm font-bold text-stone-700 hover:bg-[var(--color-cream-50)] disabled:opacity-50"
        >
          Lanjutkan dengan Google
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-black text-[var(--color-coffee-700)] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
