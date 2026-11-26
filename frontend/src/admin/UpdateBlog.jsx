import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import API from "../services/api";

export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", description: "", tags: "", status: "published" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get(`/admin/blogs/${id}`)
      .then((response) => {
        if (!active) return;
        const data = response.data;
        setBlog({
          title: data.title || "",
          description: data.description || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          status: data.status || "published",
        });
      })
      .catch(() => {
        if (active) setError("We couldn't find this story. It may have been removed.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    setBlog((currentBlog) => ({ ...currentBlog, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await API.put(`/admin/blogs/${id}`, {
        ...blog,
        tags: blog.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      navigate("/admin/blogs");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading"><span className="loading-dot" /> Opening your story...</div>;
  }

  if (error && !blog.title && !blog.description) {
    return (
      <div className="admin-empty-state" role="alert">
        <h2>Story unavailable</h2>
        <p>{error}</p>
        <Link className="text-link" to="/admin/blogs"><FaArrowLeft /> Back to all stories</Link>
      </div>
    );
  }

  return (
    <section className="admin-page">
      <Link className="admin-back-link" to="/admin/blogs"><FaArrowLeft /> Back to all stories</Link>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">THE WRITING DESK</p>
          <h1>Edit your story.</h1>
          <p className="admin-subtitle">Make a few changes and keep the story moving.</p>
        </div>
      </header>

      <form className="editor-form" onSubmit={handleSubmit}>
        {error && <p className="admin-form-message error" role="alert">{error}</p>}
        <label className="editor-field">
          Story title
          <input name="title" value={blog.title} onChange={handleChange} required maxLength={140} />
        </label>
        <label className="editor-field">
          The story
          <textarea name="description" value={blog.description} onChange={handleChange} rows={12} required />
        </label>
        <label className="editor-field">
          Topics <span className="field-note">Separate topics with commas</span>
          <input name="tags" value={blog.tags} onChange={handleChange} placeholder="Creativity, culture, technology" />
        </label>
        <label className="editor-field">
          Visibility
          <select name="status" value={blog.status} onChange={handleChange}>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <div className="editor-actions">
          <p>Changes will be saved to this story.</p>
          <button className="admin-primary-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"} {!saving && <FaArrowRight />}
          </button>
        </div>
      </form>
    </section>
  );
}
