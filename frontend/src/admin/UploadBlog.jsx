import { useState } from "react";
import { FaArrowRight, FaImage, FaPenNib } from "react-icons/fa";
import API from "../services/api";

export default function UploadBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;

    try {
      await API.post("/blogs", new FormData(form), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.reset();
      setSuccess("Your story is live and ready to read.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't publish this story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">THE WRITING DESK</p>
          <h1>Write a new story.</h1>
          <p className="admin-subtitle">A good title, a clear idea, and your words. That’s all you need.</p>
        </div>
        <span className="writing-mark"><FaPenNib /></span>
      </header>

      <form className="editor-form" onSubmit={submitHandler}>
        {error && <p className="admin-form-message error" role="alert">{error}</p>}
        {success && <p className="admin-form-message success" role="status">{success}</p>}

        <label className="editor-field">
          Story title
          <input name="title" placeholder="Give your story a thoughtful title" required maxLength={140} />
        </label>

        <label className="editor-field">
          The story
          <textarea name="description" placeholder="Start writing here..." rows={12} required />
        </label>

        <label className="editor-field">
          Topics <span className="field-note">Separate topics with commas</span>
          <input name="tags" placeholder="Creativity, culture, technology" />
        </label>

        <label className="editor-field">
          Cover image <span className="field-note">Optional · JPG, PNG, or WebP</span>
          <span className="file-picker">
            <FaImage />
            <span>Choose an image from your device</span>
            <input type="file" name="image" accept="image/*" />
          </span>
        </label>

        <div className="editor-actions">
          <p>Stories are published immediately and can be edited later.</p>
          <button className="admin-primary-button" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish story"} {!loading && <FaArrowRight />}
          </button>
        </div>
      </form>
    </section>
  );
}
