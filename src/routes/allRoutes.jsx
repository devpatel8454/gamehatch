import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SingleProduct from "../pages/SingleProduct";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import CartPage from "../pages/CartPage";
import Contactus from "../pages/Contactus";
import About from "../pages/About";
import CheckoutPage from "../pages/CheckoutPage";
import AmdminPage from "../pages/AmdminPage";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import Games from "../pages/Games";
import Wishlist from "../pages/Wishlist";
import News from "../pages/News";
import ReviewPage from "../pages/ReviewPage";
import Profile from "../pages/Profile";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contactus />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/product/:id",
    element: <SingleProduct />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/games",
    element: <Games />
  },
  {
    path: "/news",
    element: <News />
  },
  {
    path: "/wishlist",
    element: <Wishlist />
  },
  {
    path: "/reviews",
    element: <ReviewPage />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/admin",
    element: <AmdminPage />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
];

export const authRoutes = [
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
];
