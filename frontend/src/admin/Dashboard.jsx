import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBookOpen, FaEye, FaPenNib, FaUsers } from "react-icons/fa";
import API from "../services/api";

const metrics = [
  { key: "totalBlogs", label: "Total stories", icon: <FaBookOpen />, tone: "terracotta" },
  { key: "publishedBlogs", label: "Published", icon: <FaEye />, tone: "sage" },
  { key: "hiddenBlogs", label: "Hidden", icon: <FaPenNib />, tone: "sand" },
  { key: "totalUsers", label: "Community members", icon: <FaUsers />, tone: "plum" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get("/admin/dashboard")
      .then((response) => {
        if (active) setStats(response.data);
      })
      .catch(() => {
        if (active) setError("We couldn't load your studio overview. Please refresh and try again.");
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <div className="admin-empty-state" role="alert">{error}</div>;
  }

  if (!stats) {
    return <div className="admin-loading"><span className="loading-dot" /> Loading your studio...</div>;
  }

  return (
    <section className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">CODECRAFT-HUB STUDIO</p>
          <h1>Good to see you.</h1>
          <p className="admin-subtitle">A little overview of what’s happening with your publication.</p>
        </div>
        <Link className="admin-primary-button" to="/admin/upload"><FaPenNib /> Write a story</Link>
      </header>

      <div className="metric-grid">
        {metrics.map(({ key, label, icon, tone }) => (
          <article className={`metric-card ${tone}`} key={key}>
            <div className="metric-card-top">
              <span>{label}</span>
              {icon}
            </div>
            <strong>{stats[key] ?? 0}</strong>
            <span className="metric-caption">In your publication</span>
          </article>
        ))}
      </div>

      <section className="admin-welcome-panel">
        <div className="welcome-icon"><FaBookOpen /></div>
        <div className="welcome-copy">
          <p className="eyebrow">A NOTE FROM YOUR STUDIO</p>
          <h2>Every good story starts somewhere.</h2>
          <p>Keep sharing what you’re thinking about. Your readers are just a click away.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/admin/blogs">Manage stories <FaArrowRight /></Link>
          <Link to="/admin/users">Meet the community <FaArrowRight /></Link>
        </div>
        <span className="welcome-decoration" aria-hidden="true">✳</span>
      </section>
    </section>
  );
}
