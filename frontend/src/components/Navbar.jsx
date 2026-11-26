import { Link, useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaBookOpen, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="admin-topbar">
      <Link className="brand" to="/admin/dashboard" aria-label="codecraft-hub admin">
        <span className="brand-mark"><FaBookOpen /></span>
        <span>codecraft<span className="brand-amp">-hub</span></span>
        <span className="admin-badge">STUDIO</span>
      </Link>
      <div className="admin-topbar-actions">
        <Link className="admin-view-site" to="/admin/dashboard"><FaTachometerAlt /> Studio</Link>
        <Link className="admin-view-site" to="/blogs">View public site <FaExternalLinkAlt /></Link>
        <button className="admin-logout" type="button" onClick={handleLogout}>
          <FaSignOutAlt /><span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
