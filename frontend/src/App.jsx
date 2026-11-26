import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Blogs from "./pages/Blog";
import Dashboard from "./admin/Dashboard";
import UploadBlog from "./admin/UploadBlog";
import Users from "./admin/Users";
import AllBlogs from "./admin/AllBlogs";
import UpdateBlog from "./admin/UpdateBlog";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import UserNavbar from "./components/UserNavbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AdminLayout from "./Layouts/AdminLayout";
import "./App.css";

function UserLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authState, setAuthState] = useState(() => ({
    path: location.pathname,
    mode: location.pathname === "/register" ? "register" : location.pathname === "/login" ? "login" : null,
  }));
  const authMode = authState.path === location.pathname
    ? authState.mode
    : location.pathname === "/register" ? "register" : location.pathname === "/login" ? "login" : null;
  const role = token ? (() => {
    try {
      return jwtDecode(token).role;
    } catch {
      return null;
    }
  })() : null;

  const closeAuth = () => {
    setAuthState({ path: location.pathname, mode: null });
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate("/blogs", { replace: true });
    }
  };

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    closeAuth();
    if (jwtDecode(newToken).role === "admin") navigate("/admin/dashboard");
  };

  return (
    <div className="site-shell">
      {role === "admin" ? (
        <Navbar />
      ) : (
        <UserNavbar
          isAuthenticated={Boolean(role)}
          onOpenAuth={(mode) => setAuthState({ path: location.pathname, mode })}
          onLogout={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
        />
      )}
      <main className="site-main">{children}</main>
      <Footer />
      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={(mode) => setAuthState({ path: location.pathname, mode })}
          onClose={closeAuth}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

function App() {
  const publicPage = <UserLayout><Blogs /></UserLayout>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path="/blogs" element={publicPage} />
        <Route path="/blogs/:id" element={publicPage} />
        <Route path="/register" element={publicPage} />
        <Route path="/login" element={publicPage} />
        <Route
          path="/admin/dashboard"
          element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>}
        />
        <Route
          path="/admin/upload"
          element={<AdminRoute><AdminLayout><UploadBlog /></AdminLayout></AdminRoute>}
        />
        <Route
          path="/admin/users"
          element={<AdminRoute><AdminLayout><Users /></AdminLayout></AdminRoute>}
        />
        <Route
          path="/admin/blogs"
          element={<AdminRoute><AdminLayout><AllBlogs /></AdminLayout></AdminRoute>}
        />
        <Route
          path="/admin/update-blog/:id"
          element={<AdminRoute><AdminLayout><UpdateBlog /></AdminLayout></AdminRoute>}
        />
        <Route path="*" element={<Navigate to="/blogs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
