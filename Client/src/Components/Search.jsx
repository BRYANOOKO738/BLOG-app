import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    sort: "",
    category: "",
  });
  const [showMore, setshowMore] = useState(false);
  const [loading, setloading] = useState(false);
  const [post, setpost] = useState([]);

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
    const handleChange = () => {
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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside
        className="d-flex flex-column border p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4>Search Filters</h4>
        <form>
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
                          value={sidebarData.searchTerm}
                          onChange={handleChange}
            />
          </div>

          {/* Sort */}
          <div className="mb-3">
            <label htmlFor="sort" className="form-label">
              Sort By:
            </label>
            <select id="sort" name="sort" className="form-select" onChange={handleChange} defaultValue={sidebarData.sort}>
              
              <option value="asc">Newest</option>
              <option value="desc">Oldest</option>
              
            </select>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <select id="category" name="category" className="form-select">
              <option value="">All Categories</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
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
                    <div className="card h-100">
                      <img
                        src={p.image}
                        className="card-img-top"
                        alt={p.title}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.title}</h5>
                        <p className="card-text">{p.excerpt}</p>
                        <a href={`/post/${p.id}`} className="btn btn-primary">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
