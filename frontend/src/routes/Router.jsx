import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Hero from "../pages/Hero";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import DetailPage from "../pages/DetailPage";
import FamilyDashboard from "../pages/FamilyDashboard";
import Header from "../components/nav/Header";
import Loader from "../components/Loader";
import ErrorPage from "../pages/ErrorPage"; // Create this simple fallback page
import { useAppStore } from "../../store/appStore";

// 🔐 AuthGuard for protected routes
const AuthGuard = ({ children }) => {
  const { user } = useAppStore();
  return user ? children : <Navigate to="/login" />;
};

// 💡 Layout wrapper
const Layout = () => {
  const { pathname } = useLocation();
  const { loading } = useAppStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      <ToastContainer autoClose={500} />
      <Header />
      <Outlet />
    </>
  );
};

// 📦 All Routes
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />, // fallback UI for broken routes
    children: [
      {
        path: "",
        element: <Hero />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "product/:id",
        element: <DetailPage />,
      },
      {
        path: "cart",
        element: (
          <AuthGuard>
            <Cart />
          </AuthGuard>
        ),
      },
      {
        path: "family",
        element: (
          <AuthGuard>
            <FamilyDashboard />
          </AuthGuard>
        ),
      },
    ],
  },
]);

export default routes;
