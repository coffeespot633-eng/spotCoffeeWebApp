import { Routes, Route, useLocation } from "react-router-dom";

import { useEffect } from "react";
import ReactGA from "../lib/analytics";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardAdminPage from "../pages/DashboardAdminPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import CoffeeShopDetailPage from "../pages/CoffeeShopDetailPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProfilePage from "../pages/ProfilePage";

// Import Layout
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

import AddCoffeeShopPage from "../pages/admin/AddCoffeeShopPage";
import ManageCoffeeShopPage from "../pages/admin/ManageCoffeeShopPage";
import EditCoffeeShopPage from "../pages/admin/EditCoffeeShopPage";

import ManageBannerPage from "../pages/admin/ManageBannerPage";
import AddBannerPage from "../pages/admin/AddBannerPage";
import EditBannerPage from "../pages/admin/EditBannerPage";
import ReviewManagementPage from "../pages/admin/ReviewManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";

export default function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.VITE_GA_ID) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname,
      });
    }
  }, [location]);
  return (
    <Routes>
      {/* Rute Publik dengan MainLayout (Ada Topbar) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coffee-shop/:id" element={<CoffeeShopDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Rute Auth (Tanpa Layout khusus / Layar penuh) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute Admin dengan AdminLayout (Diproteksi) */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardAdminPage />} />

          <Route
            path="/admin/coffee-shops"
            element={<ManageCoffeeShopPage />}
          />
          <Route
            path="/admin/add-coffee-shop"
            element={<AddCoffeeShopPage />}
          />
          <Route
            path="/admin/edit-coffee-shop/:id"
            element={<EditCoffeeShopPage />}
          />

          <Route path="/admin/banners" element={<ManageBannerPage />} />
          <Route path="/admin/add-banner" element={<AddBannerPage />} />
          <Route path="/admin/edit-banner/:id" element={<EditBannerPage />} />
          <Route path="/admin/reviews" element={<ReviewManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Route>

      {/* Rute 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
