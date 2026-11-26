import { Link } from "react-router-dom";
import { FaArrowUp, FaBookOpen } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" to="/blogs">
          <span className="brand-mark"><FaBookOpen /></span>
          <span>codecraft<span className="brand-amp">-hub</span></span>
        </Link>
        <p>Made for developers. Free for everyone.</p>
        <a className="back-to-top" href="#" aria-label="Back to top"><FaArrowUp /></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} codecraft-hub</span>
        <span>Build, learn, and share.</span>
      </div>
    </footer>
  );
}
