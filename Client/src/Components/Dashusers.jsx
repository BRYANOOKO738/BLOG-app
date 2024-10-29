import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Table.css";
import { Link } from "react-router-dom";

const SimpleModal = ({ showModal, setShowModal, handleDelete }) => {
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{
        display: showModal ? "block" : "none",
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
        width: "300px",
      }}
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Delete user</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="d-flex justify-content-center text-secondary">
            <i className="bi bi-exclamation-circle fs-3"></i>
          </div>
          <div className="modal-body text-danger">
            <strong>Are you sure you want to delete this user?</strong>
            <p className="text-warning">This action cannot be reversed</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const Dashusers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]); // Changed from 'user' to 'users'
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `http://localhost:3000/routes/updateuser/getAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          }
          const errorText = await res.text();
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorText}`
          );
        }

          const data = await res.json();
          
        setUsers(data.users);
        if (data.users.length < 6) {
          setShow(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser.isAdmin]);// Changed dependency to currentUser.isAdmin

  const { theme } = useSelector((state) => state.theme);

  const handleShow = async () => {
    const startIndex = users.length; // Changed from 'startindex' to 'startIndex'
    try {
      const res = await fetch(
        `http://localhost:3000/routes/updateuser/getAllUsers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 5) {
          setShow(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more users:", error);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleDelete = async () => {
    const token = getAuthToken();
    if (userToDelete) {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/updateuser/delete/${userToDelete}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(users.filter((p) => p.id !== userToDelete));
          console.log(data.message);
        } else {
          console.error("Failed to delete user:", data.message);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div
      className={`container ${theme === "dark" ? "bg-secondary" : "bg-white"}`}
    >
      {/* Table for large screens */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Created date</th>
              <th>User Image</th>
              <th>Username</th>
              <th>User Email</th>
              <th>Admin</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <img
                    src={user.image}
                    alt={user.username}
                    className="img-fluid rounded-circle"
                    style={{ width: "100px", height: "95px" }}
                    onError={(e) => {
                      e.target.src =
                        "https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png";
                    }}
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i class="bi bi-check-circle-fill text-success"></i>
                  ) : (
                    <i class="bi bi-x-circle-fill text-danger"></i>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setShowModal(true);
                      setUserToDelete(user.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="d-md-none" style={{ position: "relative" }}>
        {users.map((user) => (
          <div key={user.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                <Link
                  to={`/user/${user.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {user.username}
                </Link>
              </h5>
              <Link to={`/user/${user.slug}`}>
                <img
                  src={user.image}
                  alt={user.username}
                  className="img-fluid mb-3 "
                  style={{ height: "230px" }}
                  onError={(e) => {
                    e.target.src =
                      "https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png";
                  }}
                />
              </Link>
              <p>
                <strong>Date Created:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Admin:</strong>{" "}
                {user.isAdmin ? (
                  <i class="bi bi-check-circle-fill"></i>
                ) : (
                  <i class="bi bi-x-circle-fill"></i>
                )}
              </p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setShowModal(true);
                    setUserToDelete(user.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="d-flex justify-content-center mb-3">
          <button
            onClick={handleShow}
            className="btn btn-primary w-100 mb-3 logo"
          >
            SHOW MORE ▼▼
          </button>
        </div>
      )}

      <SimpleModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Dashusers;
