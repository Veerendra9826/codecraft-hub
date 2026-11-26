import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import API, { getUploadUrl } from "../services/api";

const formatDate = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyBlogId, setBusyBlogId] = useState("");

  useEffect(() => {
    let active = true;
    API.get("/admin/blogs")
      .then((response) => {
        if (active) setBlogs(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("We couldn't load your stories. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const isInDateFilter = (blog) => {
    if (filter === "all") return true;
    const blogDate = new Date(blog.createdAt);
    const targetDate = new Date();
    if (filter === "yesterday") targetDate.setDate(targetDate.getDate() - 1);
    return blogDate.toDateString() === targetDate.toDateString();
  };
  const filteredBlogs = blogs.filter(isInDateFilter);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    setBusyBlogId(id);
    setError("");
    try {
      await API.delete(`/admin/blogs/${id}`);
      setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't delete this story.");
    } finally {
      setBusyBlogId("");
    }
  };

  const toggleStatus = async (id) => {
    setBusyBlogId(id);
    setError("");
    try {
      await API.put(`/admin/blogs/${id}/status`);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't update this story.");
    } finally {
      setBusyBlogId("");
    }
  };

  return (
    <section className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">YOUR PUBLICATION</p>
          <h1>All stories.</h1>
          <p className="admin-subtitle">Edit, publish, and keep every story in one place.</p>
        </div>
        <Link className="admin-primary-button" to="/admin/upload"><FaPlus /> New story</Link>
      </header>

      <div className="admin-toolbar">
        <div className="admin-filter-group" aria-label="Filter stories by date">
          {[
            ["all", "All stories"],
            ["today", "Today"],
            ["yesterday", "Yesterday"],
          ].map(([value, label]) => (
            <button
              className={filter === value ? "admin-filter active" : "admin-filter"}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <span className="admin-result-count">{filteredBlogs.length} {filteredBlogs.length === 1 ? "STORY" : "STORIES"}</span>
      </div>

      {error && <p className="admin-form-message error" role="alert">{error}</p>}
      {loading ? (
        <div className="admin-loading"><span className="loading-dot" /> Loading stories...</div>
      ) : filteredBlogs.length ? (
        <div className="admin-story-grid">
          {filteredBlogs.map((blog) => {
            const image = getUploadUrl(blog.image);
            const published = blog.status === "published";
            return (
              <article className="admin-story-card" key={blog._id}>
                <div className="admin-story-image">
                  {image ? <img src={image} alt="" loading="lazy" /> : <div className="image-placeholder">A story worth sharing</div>}
                  <span className={published ? "status-badge published" : "status-badge hidden"}>
                    {published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="admin-story-content">
                  <span className="admin-story-date">{formatDate(blog.createdAt)}</span>
                  <h2>{blog.title}</h2>
                  <p>{(blog.description || "").slice(0, 115)}{(blog.description || "").length > 115 ? "..." : ""}</p>
                  <div className="admin-story-footer">
                    <span>By {typeof blog.author === "string" ? blog.author : blog.author?.name || "codecraft-hub"}</span>
                    <div className="admin-story-actions">
                      <Link to={`/admin/update-blog/${blog._id}`} aria-label={`Edit ${blog.title}`} title="Edit story">
                        <FaPen />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleStatus(blog._id)}
                        disabled={busyBlogId === blog._id}
                        aria-label={published ? `Hide ${blog.title}` : `Publish ${blog.title}`}
                        title={published ? "Hide story" : "Publish story"}
                      >
                        {published ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlog(blog._id)}
                        disabled={busyBlogId === blog._id}
                        aria-label={`Delete ${blog.title}`}
                        title="Delete story"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty-state">
          <h2>No stories here yet.</h2>
          <p>{filter === "all" ? "Your first published story will show up here." : "Try another date filter or write a new story."}</p>
          <Link className="text-link" to="/admin/upload">Write a story <FaPlus /></Link>
        </div>
      )}
    </section>
  );
}
