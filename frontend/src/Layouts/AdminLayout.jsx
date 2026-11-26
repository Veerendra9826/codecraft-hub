import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-workspace">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
