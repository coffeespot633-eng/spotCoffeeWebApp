import { NavLink } from "react-router";
import logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Coffee,
  PlusCircle,
  MessageSquare,
  Users,
  Images,
} from "lucide-react";

export default function Sidebar() {
const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },

  {
    name: "Coffee Shop",
    path: "/admin/coffee-shops",
    icon: Coffee,
  },

  {
    name: "Tambah Coffee Shop",
    path: "/admin/add-coffee-shop",
    icon: PlusCircle,
  },

  {
    name: "Banner",
    path: "/admin/banners",
    icon: Images,
  },

  {
  name: "Tambah Banner",
  path: "/admin/add-banner",
  icon: PlusCircle,
  },

  {
    name: "Review",
    path: "/admin/reviews",
    icon: MessageSquare,
  },

  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

  return (
    <aside className="
      w-full
      md:w-72
      md:min-h-screen

      bg-gradient-to-b
      from-[var(--color-coffee-800)]
      to-[var(--color-coffee-700)]

      p-5
      text-white

      shadow-2xl
      md:rounded-r-3xl
      ">
      <div className="
        rounded-3xl
        bg-white/90
        backdrop-blur-xl
        p-4
        shadow-lg
        ">
        <img
          src={logo}
          alt="Spot Coffee"
          className="h-14 w-full object-contain"
        />
      </div>

      <div className="mt-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-coffee-200)]">
          Admin Panel
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Spot Coffee
        </h2>
      </div>

      <nav className="mt-6 grid gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `
                rounded-2xl
                px-4
                py-3

                text-sm
                font-bold

                transition
                duration-300

                flex
                items-center
                gap-3

                ${
                  isActive
                    ? `
                      bg-white
                      text-[var(--color-coffee-800)]
                      shadow-lg
                    `
                    : `
                      text-[var(--color-coffee-100)]
                      hover:bg-white/10
                    `
                }
              `
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-10">
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-coffee-200)]">
            Spot Coffee
          </p>

          <p className="mt-2 text-sm text-[var(--color-coffee-100)]">
            Admin Dashboard
          </p>
        </div>
      </div>
    </aside>
  );
}