import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaSearch } from "react-icons/fa";
import API, { getUploadUrl } from "../services/api";

const formatDate = (date) => {
  if (!date) return "Recently";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Recently"
    : parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const getAuthor = (author) => (typeof author === "string" ? author : author?.name) || "codecraft-hub";

export default function Blogs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("All stories");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get("/blogs")
      .then((response) => {
        if (active) setBlogs(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("We couldn't load the stories. Please check your connection and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedBlog = blogs.find((blog) => blog._id === id);
  const categories = useMemo(() => {
    const allTags = blogs.flatMap((blog) => Array.isArray(blog.tags) ? blog.tags : []);
    return ["All stories", ...new Set(allTags)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogs.filter((blog) => {
      const tags = Array.isArray(blog.tags) ? blog.tags : [];
      const matchesCategory = filter === "All stories" || tags.includes(filter);
      const text = `${blog.title || ""} ${blog.description || ""} ${tags.join(" ")}`.toLowerCase();
      return matchesCategory && (!query || text.includes(query));
    });
  }, [blogs, filter, search]);

  if (id && !loading && !selectedBlog) {
    return (
      <section className="not-found-page">
        <p className="eyebrow">STORY NOT FOUND</p>
        <h1>This page is a blank page.</h1>
        <Link className="text-link" to="/blogs"><FaArrowLeft /> Back to all stories</Link>
      </section>
    );
  }

  if (id && selectedBlog) {
    const storyImage = getUploadUrl(selectedBlog.image);
    return (
      <article className="article-page">
        <button className="back-link" type="button" onClick={() => navigate("/blogs")}>
          <FaArrowLeft /> All stories
        </button>
        <header className="article-header">
          <div className="tag-row">
            {(selectedBlog.tags || []).map((tag) => <span className="story-tag" key={tag}>{tag}</span>)}
          </div>
          <h1>{selectedBlog.title}</h1>
          <div className="article-meta">
            <span>By {getAuthor(selectedBlog.author)}</span>
            <span><FaCalendarAlt /> {formatDate(selectedBlog.createdAt)}</span>
          </div>
        </header>
        {storyImage && <img className="article-cover" src={storyImage} alt={selectedBlog.title} />}
        <div className="article-copy">{selectedBlog.description || "This story has no description yet."}</div>
        <div className="article-end">
          <span className="brand-mark"><FaArrowRight /></span>
          <p>Thanks for reading. There’s always more to explore on codecraft-hub.</p>
          <Link className="text-link" to="/blogs">Discover more stories <FaArrowRight /></Link>
        </div>
      </article>
    );
  }

  const featuredBlog = blogs[0];
  const featuredImage = getUploadUrl(featuredBlog?.image);

  return (
    <div className="blog-home">
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow"><span /> Ideas, guides, and builds for developers</p>
          <h1>Build boldly.<br />Think <em>deeply.</em></h1>
          <p className="hero-description">
            Practical programming guides and thoughtful reads on code, tools, and the craft of building software.
          </p>
          <a className="hero-cta" href="#stories">Explore the latest <FaArrowRight /></a>
          <div className="hero-note"><span className="note-line" /> Free to read. No account needed.</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-card art-card-back"><span>CODE<br />IN MOTION</span><i /></div>
          <div className="art-card art-card-front">
            <div className="art-lines"><i /><i /><i /><i /></div>
            <span className="art-card-label">CODE. LEARN. BUILD.</span>
          </div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✦</span>
          <span className="art-loop" />
        </div>
        <div className="hero-bottom">
          <span>CURIOUS MINDS, WELCOME</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="featured-section content-width" aria-label="Featured story">
        {loading ? (
          <div className="featured-skeleton" />
        ) : featuredBlog ? (
          <Link className="featured-card" to={`/blogs/${featuredBlog._id}`}>
            <div className="featured-copy">
              <span className="featured-label"><i /> LATEST STORY</span>
              <h2>{featuredBlog.title}</h2>
              <p>{(featuredBlog.description || "").slice(0, 170)}{(featuredBlog.description || "").length > 170 ? "..." : ""}</p>
              <div className="featured-meta">
                <span>By {getAuthor(featuredBlog.author)}</span>
                <span>{formatDate(featuredBlog.createdAt)}</span>
              </div>
              <span className="featured-read">Read the story <FaArrowRight /></span>
            </div>
            <div className="featured-image">
              {featuredImage ? <img src={featuredImage} alt="" /> : <div className="image-placeholder">A story worth sharing</div>}
              <span className="image-index">01 / {String(blogs.length).padStart(2, "0")}</span>
            </div>
          </Link>
        ) : null}
      </section>

      <section id="stories" className="stories-section content-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE READING ROOM</p>
            <h2>Find a story <em>to get lost in.</em></h2>
          </div>
          <label className="search-box">
            <FaSearch aria-hidden="true" />
            <input
              type="search"
              placeholder="Search stories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search stories"
            />
          </label>
        </div>

        <div className="story-toolbar">
          <div className="category-list" aria-label="Filter by topic">
            {categories.map((category) => (
              <button
                className={filter === category ? "category-pill active" : "category-pill"}
                key={category}
                onClick={() => setFilter(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <span className="story-count">{filteredBlogs.length} {filteredBlogs.length === 1 ? "STORY" : "STORIES"}</span>
        </div>

        {loading ? (
          <div className="story-grid" aria-label="Loading stories">
            {[1, 2, 3].map((item) => <div className="story-skeleton" key={item} />)}
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button type="button" className="text-link" onClick={() => window.location.reload()}>Try again <FaArrowRight /></button>
          </div>
        ) : filteredBlogs.length ? (
          <div className="story-grid">
            {filteredBlogs.map((blog, index) => {
              const image = getUploadUrl(blog.image);
              const tags = Array.isArray(blog.tags) ? blog.tags : [];
              return (
                <article className="story-card" key={blog._id} style={{ "--card-index": index }}>
                  <Link className="story-image" to={`/blogs/${blog._id}`}>
                    {image ? <img src={image} alt="" loading="lazy" /> : <div className="image-placeholder">Ideas in progress</div>}
                    <span className="card-arrow"><FaArrowRight /></span>
                  </Link>
                  <div className="story-card-content">
                    <div className="tag-row">
                      {tags.slice(0, 2).map((tag) => <span className="story-tag" key={tag}>{tag}</span>)}
                    </div>
                    <h3><Link to={`/blogs/${blog._id}`}>{blog.title}</Link></h3>
                    <p className="story-excerpt">{(blog.description || "A new story is waiting to be read.").slice(0, 125)}{(blog.description || "").length > 125 ? "..." : ""}</p>
                    <div className="story-card-footer">
                      <span>{formatDate(blog.createdAt)}</span>
                      <Link to={`/blogs/${blog._id}`} aria-label={`Read ${blog.title}`}><FaArrowRight /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>{search ? "No stories match your search just yet." : "No stories in this topic yet. Check back soon."}</p>
            {(search || filter !== "All stories") && (
              <button className="text-link" type="button" onClick={() => { setSearch(""); setFilter("All stories"); }}>
                Clear filters <FaArrowRight />
              </button>
            )}
          </div>
        )}
      </section>

      <section id="about" className="about-strip">
        <div className="about-inner content-width">
          <span className="about-star">✳</span>
          <div>
            <p className="eyebrow">OPEN BY DESIGN</p>
            <h2>Code gets better<br />when it’s <em>shared.</em></h2>
          </div>
          <p className="about-description">Learn at your own pace, follow your curiosity, and come back whenever you like. No sign-up wall—just useful reads.</p>
          <a href="#stories" className="about-link">Keep learning <FaArrowRight /></a>
        </div>
      </section>
    </div>
  );
}
