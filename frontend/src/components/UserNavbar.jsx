import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen, FaSignOutAlt } from "react-icons/fa";

export default function UserNavbar({ isAuthenticated, onOpenAuth, onLogout }) {
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link className="brand" to="/blogs" aria-label="codecraft-hub home">
          <span className="brand-mark"><FaBookOpen /></span>
          <span>codecraft<span className="brand-amp">-hub</span></span>
        </Link>

        <div className="nav-links">
          <a href="/blogs#stories">Explore</a>
          <a href="/blogs#about">About</a>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <button className="nav-login" onClick={onLogout} type="button">
              <FaSignOutAlt /> Sign out
            </button>
          ) : (
            <button className="nav-login" onClick={() => onOpenAuth("login")} type="button">
              Log in
            </button>
          )}
          <button className="nav-join" onClick={() => onOpenAuth("register")} type="button">
            Join the community <FaArrowRight />
          </button>
        </div>
      </nav>
    </header>
  );
}
