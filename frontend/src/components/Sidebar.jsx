import { createElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBlog, FaTachometerAlt, FaUpload, FaUsers } from "react-icons/fa";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: FaTachometerAlt },
  { to: "/admin/blogs", label: "All stories", icon: FaBlog },
  { to: "/admin/upload", label: "Write a story", icon: FaUpload },
  { to: "/admin/users", label: "Community", icon: FaUsers },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="admin-sidebar">
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="sidebar-nav" aria-label="Admin navigation">
        {links.map(({ to, label, icon }) => {
          const active = pathname === to || (to === "/admin/blogs" && pathname.startsWith("/admin/update-blog"));
          return (
            <Link className={active ? "sidebar-link active" : "sidebar-link"} to={to} key={to}>
              {createElement(icon)}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-note">
        <span className="sidebar-note-mark">✳</span>
        <p>Your words make<br />this place.</p>
      </div>
    </aside>
  );
}
