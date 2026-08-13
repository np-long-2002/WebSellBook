import { useState } from "react";
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import BookDetailPage from "./pages/BookDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminBooksPage from "./pages/AdminBooksPage";
import AdminCategoryPage from "./pages/AdminCategoryPage";
import AdminAuthorPage from "./pages/AdminAuthorPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminVoucherPage from "./pages/AdminVoucherPage";
import AdminPromotionPage from "./pages/AdminPromotionPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

function App() {

  const [showLogin, setShowLogin] =
    useState(false);

  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <div
      className="
      min-h-screen
      bg-slate-100
      flex
      flex-col
      "
    >

      {/* Navbar */}

      {!isAdminPage && (
        <Navbar
          openLogin={() =>
            setShowLogin(true)
          }
        />
      )}

      {/* Login Modal */}

      {showLogin && (
        <LoginModal
          closeModal={() =>
            setShowLogin(false)
          }
        />
      )}

      {/* Main */}

      <main className="flex-1">

        <Routes>

          {/* CLIENT */}

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/book/:id"
            element={<BookDetailPage />}
          />

          <Route
            path="/orders"
            element={<OrderHistoryPage />}
          />
          <Route
  path="/verify-email"
  element={
    <VerifyEmailPage />
  }
/>

          {/* ACCESS DENIED */}

          <Route
            path="/403"
            element={<AccessDeniedPage />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            {/* Dashboard */}

            <Route
              index
              element={
                <AdminDashboardPage />
              }
            />

            {/* Books */}

            <Route
              path="books"
              element={
                <AdminBooksPage />
              }
            />


            <Route
              path="categories"
              element={
                <AdminCategoryPage />
              }
            />

            {/* Authors */}

            <Route
              path="authors"
              element={
                <AdminAuthorPage />
              }
            />


            <Route
              path="users"
              element={
                <AdminUsersPage />
              }
            />

            <Route
              path="orders"
              element={<AdminOrdersPage />}
            />
            <Route
              path="vouchers"
              element={
                <AdminVoucherPage />
              }
            />
            <Route
              path="promotions"
              element={
                <AdminPromotionPage />
              }
            />
          </Route>



        </Routes>

      </main>

      {/* Footer */}

      {!isAdminPage && (
        <Footer />
      )}

    </div>
  );
}

export default App;