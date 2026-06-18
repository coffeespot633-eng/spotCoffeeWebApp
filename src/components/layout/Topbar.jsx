import { Link } from "react-router";
import Button from "../ui/Button";
import logo from "../../assets/logo.png"; 
import useAuthStore from "../../store/authStore";
import {
  Heart,
} from "lucide-react";

export default function Topbar() {
  const { user, isAuthenticated } =
    useAuthStore();

  return (
    
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Bagian Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Spot Coffee Logo" 
              className="h-12 w-auto object-contain" 
            />
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 font-semibold text-[var(--color-coffee-700)]"
                >
                  <Heart size={18} />
                  Favorit
                </Link>

                <Link
                  to="/profile"
                  className="
                  rounded-2xl
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-[var(--color-coffee-600)]
                  hover:bg-[var(--color-coffee-100)]
                "
                >
                  Profil
                </Link>

                <span className="text-sm font-medium text-stone-600">
                  {user?.displayName || user?.email}
                </span>

                <Button
                  variant="outline"
                  onClick={() => {
                    useAuthStore.authService().logout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">
                    Masuk
                  </Button>
                </Link>

                <Link to="/register">
                  <Button variant="primary">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}