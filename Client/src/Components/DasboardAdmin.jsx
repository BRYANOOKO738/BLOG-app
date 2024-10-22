import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DasboardAdmin = ({ percentageChange = 12.5 }) => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  console.log(totalUsers, totalComments, totalPosts);

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAuthToken();
      if (!token) return; // Exit if no token
      try {
        const res = await fetch(
          `http://localhost:3000/routes/updateuser/getAllUsers?limit=5`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adding the token to headers
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        console.log(data);
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchComments = async () => {
      const token = getAuthToken();
      if (!token) return; // Exit if no token
      try {
        const res = await fetch(
          `http://localhost:3000/routes/comment/getAllComents?limit=3`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adding the token to headers
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await res.json();
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.totalLastMonthComments);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchPosts = async () => {
      const token = getAuthToken();
      if (!token) return; // Exit if no token
      try {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?limit=5`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adding the token to headers
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser]);

  return (
    <div className="container-fluid px-4">
      <div className="row g-4">
        {/* Users Card */}
        <div className="col-12 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-people-fill fs-4 text-primary"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-muted text-uppercase mb-1">
                      Total Users
                    </h6>
                    <span className="badge bg-primary-subtle text-primary">
                      Last 24h
                    </span>
                  </div>
                  <h2 className="mb-0 fw-bold">{totalUsers}</h2>
                </div>
              </div>

              <div className="bg-light p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Monthly Growth</span>
                  <div className="d-flex align-items-center text-success">
                    <i className="bi bi-graph-up me-1"></i>
                    <span className="fw-semibold">12.5%</span>
                  </div>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">New Users Today</div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">+5</h4>
                      <span className="badge bg-success-subtle text-success ms-2">
                        ↑ 12%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">Active Users</div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">8,942</h4>
                      <span className="badge bg-success-subtle text-success ms-2">
                        ↑ 8%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Card */}
        <div className="col-12 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-file-text-fill fs-4 text-success"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-muted text-uppercase mb-1">
                      Total Posts
                    </h6>
                    <span className="badge bg-success-subtle text-success">
                      Last 24h
                    </span>
                  </div>
                  <h2 className="mb-0 fw-bold">{totalPosts}</h2>
                </div>
              </div>

              <div className="bg-light p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Publishing Rate</span>
                  <div className="d-flex align-items-center text-success">
                    <i className="bi bi-arrow-up-right me-1"></i>
                    <span className="fw-semibold">+28.4%</span>
                  </div>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">Posts Today</div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">284</h4>
                      <span className="badge bg-success-subtle text-success ms-2">
                        ↑ 24%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">Avg. Length</div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">842</h4>
                      <small className="text-muted ms-2">words</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Card */}
        <div className="col-12 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-chat-square-text-fill fs-4 text-warning"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-muted text-uppercase mb-1">
                      Total Comments
                    </h6>
                    <span className="badge bg-warning-subtle text-warning">
                      Last 24h
                    </span>
                  </div>
                  <h2 className="mb-0 fw-bold">{totalComments}</h2>
                </div>
              </div>

              <div className="bg-light p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Engagement Rate</span>
                  <div className="d-flex align-items-center text-success">
                    <i className="bi bi-graph-up me-1"></i>
                    <span className="fw-semibold">18.2%</span>
                  </div>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">
                      Today's Comments
                    </div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">1,842</h4>
                      <span className="badge bg-success-subtle text-success ms-2">
                        ↑ 18%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="text-muted small mb-1">Response Rate</div>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-semibold">92%</h4>
                      <span className="badge bg-success-subtle text-success ms-2">
                        ↑ 5%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 d-flex gap-2 row">
        <div className="rounded shadow col-6">
          <div className="justify-content-between d-flex gap-4">
            <h2>Recent Users</h2>
            <Link
              to="/dashboard/?tab=users"
              className="btn btn-outline-warning text-center"
            >
              See All
            </Link>
          </div>
          <div className="mt-2">
            <table className="table table-bordered  ">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Username</th>
                </tr>
              </thead>
              {users.slice(0, 10).map((user, index) => (
                <tbody key={index}>
                  <tr>
                    <td>
                      <img
                        src={user.image}
                        alt={user.username}
                        className="rounded-circle"
                        style={{ width: "5%" }}
                      />
                    </td>
                    <td>{user.username}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
        
        <div className="rounded shadow col">
          <div className="justify-content-between d-flex gap-4">
            <h2>Recent Posts</h2>
            <Link
              to="/dashboard/?tab=users"
              className="btn btn-outline-warning text-center"
            >
              See All
            </Link>
          </div>
          <div className="mt-2">
            <table className="table table-bordered  ">
              <thead>
                <tr>
                  <th>Post Image</th>
                  <th>Post Tittle</th>
                  <th>Category</th>
                </tr>
              </thead>
              {posts.slice(0, 10).map((post) => (
                <tbody key={post.id}>
                  <tr>
                    <td>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="rounded"
                        style={{ width: "10%" }}
                      />
                    </td>
                    <td>{post.title}</td>
                    <td>{post.category}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasboardAdmin;
