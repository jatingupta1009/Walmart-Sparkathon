import { create } from "zustand";
import API from "./../utils/axios";
import { toast } from "react-toastify";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const useAppStore = create((set, get) => ({
  user: user,
  loading: false,
  cart: null,
  totalCart: null,
  useFamilyCart: false,
  familyId: null,
  familyMembers: [],

  setUseFamilyCart: (val) => set(() => ({ useFamilyCart: val })),

  loginUser: async (details, navigate) => {
    try {
      set({ loading: true });
      const { data } = await API.post("/api/user/login", details);
      toast.success("Login successfully");
      set({ loading: false, user: data.user });
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  registerUser: async (details, navigate) => {
    try {
      set({ loading: true });
      const { data } = await API.post("/api/user/register", details);
      set({ loading: false, user: data.user });
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Register successfully");
      navigate("/");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  createFamily: async () => {
    try {
      const { data } = await API.post("/api/user/create-family");
      set({ familyId: data.familyId });
      toast.success("Family created");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  joinFamily: async (familyCode) => {
    try {
      const { data } = await API.post("/api/user/join-family", { familyCode });
      set({ familyId: data.user.familyId });
      toast.success("Joined family");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  getFamilyMembers: async () => {
    try {
      const { data } = await API.get("/api/user/family-members");
      set({ familyMembers: data.members, familyId: data.familyId });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  getUserCart: async () => {
    try {
      set({ loading: true });
      const { data } = await API.get("/api/user/get-user-cart");
      const flatCart = data.cartItems.map((item) => ({
        ...item,
        addedBy: { name: "You" },
      }));
      set({ cart: flatCart, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  getFamilyCart: async () => {
    try {
      set({ loading: true });
      const { data } = await API.get("/api/family/cart");
      const flatCart = data.cartItems.map((item) => ({
        ...item,
        addedBy: item.addedBy || { name: "Unknown" },
      }));
      set({ cart: flatCart, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  addCart: async (product, navigate) => {
    const { useFamilyCart } = get();
    try {
      set({ loading: true });
      const endpoint = useFamilyCart ? "/api/family/add-cart" : "/api/user/add-cart";
      const { data } = await API.post(endpoint, { product });
      set({ loading: false, totalCart: data.total });
      toast.success("Added to cart successfully");
    } catch (error) {
      set({ loading: false });
      if (error?.response?.status === 401) navigate("/login");
      toast.error(error?.response?.data?.message);
    }
  },

  addCartQty: async (id) => {
    const { useFamilyCart } = get();
    try {
      set({ loading: true });
      const endpoint = useFamilyCart ? "/api/family/add-qty" : "/api/user/add-qty";
      await API.post(endpoint, { productId: id });
      const cart = get().cart;
      const updatedCart = cart.map((item) =>
        item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ cart: updatedCart, loading: false });
      toast.success("Quantity increased");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  removeCartQty: async (id) => {
    const { useFamilyCart } = get();
    try {
      set({ loading: true });
      const endpoint = useFamilyCart ? "/api/family/decrease-qty" : "/api/user/decrease-qty";
      await API.post(endpoint, { productId: id });
      const cart = get().cart;
      const updatedCart = cart.map((item) =>
        item.product.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      set({ cart: updatedCart, loading: false });
      toast.success("Quantity decreased");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  removeCart: async (id) => {
    const { useFamilyCart } = get();
    try {
      set({ loading: true });
      const endpoint = useFamilyCart ? "/api/family/remove-cart" : "/api/user/remove-cart";
      const { data } = await API.delete(endpoint, { data: { id } });
      const updatedCart = get().cart.filter((item) => item.product.id !== id);
      set({ cart: updatedCart, totalCart: data.total, loading: false });
      toast.success("Item removed");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  logout: async (navigate, setShowMenu) => {
    try {
      set({ loading: true });
      await API.post("/api/user/logout");
      setShowMenu(false);
      set({ loading: false, user: null, cart: null, familyId: null });
      localStorage.clear();
      navigate("/");
      toast.success("Logged out");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },
}));