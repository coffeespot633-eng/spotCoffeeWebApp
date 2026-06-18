import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import useAuthStore from "../../store/authStore";

import Swal from "sweetalert2";

import SectionHeader from "../../components/ui/SectionHeader";

import {
  glassCard,
  glassPanel,
} from "../../utils/uiClasses";

export default function UserManagementPage() {
  const { user: currentUser } =
    useAuthStore();

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
  useState("");

    const [roleFilter, setRoleFilter] =
    useState("all");  

  useEffect(() => {
    const loadUsers =
      async () => {
        try {
          const snapshot =
            await getDocs(
              collection(
                db,
                "users"
              )
            );

          const userData =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setUsers(userData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadUsers();
  }, []);


  const handleRoleChange = async (
  userId,
  currentRole
) => {
  try {
    const newRole =
      currentRole === "admin"
        ? "member"
        : "admin";

    await updateDoc(
      doc(db, "users", userId),
      {
        role: newRole,
      }
    );

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: newRole,
            }
          : user
      )
    );
  } catch (error) {
    console.error(error);
  }
};

const filteredUsers =
  users.filter((user) => {
    const matchesSearch =
      (user.fullName || "")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesRole =
      roleFilter === "all"
        ? true
        : user.role === roleFilter;

    return (
      matchesSearch &&
      matchesRole
    );
  });

  return (
    <section>
      <SectionHeader
        subtitle="Admin"
        title="User Management"
      />

      <>
  <div className="mb-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-extrabold uppercase tracking-widest text-[var(--color-coffee-500)]">
        Statistik
      </p>

      <h2 className="text-3xl font-black text-[var(--color-coffee-800)]">
        {users.length} User
      </h2>
      <div className="mt-6">
  <input
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    placeholder="Cari user..."
    className="
      w-full
      rounded-2xl
      border
      border-amber-100
      bg-white
      px-4
      py-3
      outline-none
    "
  />

  <div className="mt-3 flex gap-2">
    {[
      "all",
      "admin",
      "member",
    ].map((role) => (
      <button
        key={role}
        onClick={() =>
          setRoleFilter(role)
        }
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-bold

          ${
            roleFilter === role
              ? "bg-[var(--color-coffee-700)] text-white"
              : "border border-amber-100 bg-white text-[var(--color-coffee-700)]"
          }
        `}
      >
        {role}
      </button>
    ))}
  </div>
</div>
    </div>
  </div>

  <div
    className="
      overflow-hidden
      rounded-3xl

      border
      border-white/40

      bg-white/70

      backdrop-blur-xl
    "
  >
    <div
      className="
        grid
        grid-cols-[2fr_2fr_1fr_1fr_1fr]

        border-b
        border-[var(--color-coffee-100)]

        px-6
        py-4

        text-xs
        font-extrabold
        uppercase
        tracking-wider

        text-stone-500
      "
    >
      <div>Nama</div>
      <div>Email</div>
      <div>Role</div>
      <div>Bergabung</div>
      <div>Aksi</div>
    </div>

    {filteredUsers.map((user) => (
      <div
        key={user.id}
        className="
          grid
          grid-cols-[2fr_2fr_1fr_1fr_1fr]

          items-center

          border-b
          border-[var(--color-coffee-100)]

          px-6
          py-5

          transition
          hover:bg-white/50
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11

              items-center
              justify-center

              rounded-2xl

              bg-[var(--color-coffee-700)]

              font-black
              text-white
            "
          >
            {user.fullName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div>
            <p className="font-black text-[var(--color-coffee-800)]">
              {user.fullName ||
                "Tanpa Nama"}
            </p>

            <p className="text-xs text-stone-400">
              {user.uid}
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600">
          {user.email}
        </p>

        <div>
            <span
                className={`
                inline-flex
                rounded-full
                px-3
                py-1

                text-xs
                font-bold

                ${
                    user.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }
                `}
            >
                {user.role}
            </span>
            </div>

            <div className="font-semibold text-[var(--color-coffee-700)]">
            {user.createdAt
                ? new Date(
                    user.createdAt
                ).toLocaleDateString("id-ID")
                : "-"}
            </div>

            <div>
            {currentUser?.uid !== user.uid && (
                <button
                onClick={() =>
                    handleRoleChange(
                    user.id,
                    user.role
                    )
                }
                className="
                    rounded-xl
                    bg-[var(--color-coffee-700)]
                    px-3
                    py-2

                    text-xs
                    font-bold
                    text-white

                    transition
                    hover:bg-[var(--color-coffee-800)]
                "
                >
                {user.role === "admin"
                    ? "Jadikan Member"
                    : "Jadikan Admin"}
                </button>
            )}
            </div>
      </div>
    ))}
  </div>
</>
    </section>
  );
}