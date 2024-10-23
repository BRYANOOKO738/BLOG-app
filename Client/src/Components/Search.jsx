import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    sort: "",
    category: "",
  });
  const navigate = useNavigate();
  const [showMore, setshowMore] = useState(false);
  const [loading, setloading] = useState(false);
  const [post, setpost] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setsidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPost = async () => {
      setloading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `http://localhost:3000/routes/Publish/getpost?${searchQuery}`
      );
      if (!res.ok) {
        setloading(false);
        return;
      }

      const data = await res.json();
      
      setpost(data.posts);
      setloading(false);
      setshowMore(data.posts.length > 6);

      if (data.posts.length === 9) {
        setshowMore(true);
      } else {
        setshowMore(false);
      }
    };

    fetchPost();
  }, [location.search]);
    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setsidebarData({...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setsidebarData({...sidebarData, sort: order });
        }
        if (e.target.id === "category") {
            const category = e.target.value || "category";
            setsidebarData({...sidebarData, category: category });
        }
    }
  
  const handleSubmit = (e) => { 
    fetchPost();
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  const handleShowMore = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    const startIndex = post.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());

    try {
      const res = await fetch(
        `http://localhost:3000/routes/Publish/getpost?${urlParams.toString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        const updatedPosts = [...post, ...data.posts];
        setpost(updatedPosts);
        setshowMore(data.posts.length === 9);
      } else {
        setshowMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setshowMore(false);
    } finally {
      setLoadingMore(false);
    }
  };
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside
        className="d-flex flex-column border p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4>Search Filters</h4>
        <form onSubmit={handleSubmit}>
          {/* Search Term */}
          <div className="mb-3">
            <label htmlFor="searchTerm" className="form-label">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              name="search"
              className="form-control"
              placeholder="Search for blog posts..."
              value={sidebarData.searchTerm || ""}
              onChange={handleChange}
            />
          </div>

          {/* Sort */}
          <div className="mb-3">
            <label htmlFor="sort" className="form-label">
              Sort By:
            </label>
            <select
              id="sort"
              name="sort"
              className="form-select"
              onChange={handleChange}
              value={sidebarData.sort}
            >
              <option value="asc">Newest</option>
              <option value="desc">Oldest</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              onChange={handleChange}
              value={sidebarData.category}
            >
              <option value="">All Categories</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="Politics">Politics</option>
              <option value="Religion">Religion</option>
              <option value="Inteligence">Inteligence</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-3">
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div>
            <h2>Search Results</h2>
            {post.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              <div className="row">
                {post.map((p) => (
                  <div key={p.id} className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={p.image}
                        className="card-img-top"
                        alt={p.title}
                        style={{ height: "200px" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.title}</h5>
                        <div className="d-flex justify-content-between">
                          <a
                            href={`/post/${p.slug}`}
                            className="btn btn-primary"
                          >
                            Read More
                          </a>
                          <p className="card-text">
                            {new Date(p.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {showMore && (
                  <div className="col-12">
                    <button
                      onClick={handleShowMore}
                      className="btn btn-primary w-100 mt-3"
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
