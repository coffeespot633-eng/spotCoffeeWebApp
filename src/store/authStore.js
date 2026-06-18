import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // Nanti akan berisi data user dari Firebase
  role: 'guest', // Status awal: 'guest', nanti bisa berubah jadi 'member' atau 'admin'
  isAuthenticated: false,
  isLoading: true, 

  // Fungsi untuk update data user saat berhasil login
  setUser: (user, role) => set({ 
    user, 
    role, 
    isAuthenticated: !!user, 
    isLoading: false 
  }),
  
  // Fungsi untuk menghapus data saat logout
  logout: () => set({ 
    user: null, 
    role: 'guest', 
    isAuthenticated: false, 
    isLoading: false 
  }),
  
  // Fungsi untuk mengatur status loading
  setLoading: (isLoading) => set({ isLoading }),
  
}));


export default useAuthStore;