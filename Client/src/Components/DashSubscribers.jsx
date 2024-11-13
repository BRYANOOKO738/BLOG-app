import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashSubscribers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `http://localhost:3000/routes/Subscribe/getAll`,
          {
            headers: {
              "Content-Type": "application/json",
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
        console.log(data);
        setUsers(data);
        if (data.partnerships.length < 6) {
          setShow(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    };

    if (currentUser.isOwner) {
      fetchUsers();
    }
  }, [currentUser.isOwner]);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // Clears the error after 3 seconds
      }, 3000);

      // Clear timeout if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div className="container  p-0">
      <div className="row m-0">
        <div className="col-12 p-0">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}

          {/* Title Section */}
          <div className="bg-primary text-white p-3 mb-4">
            <h2 className="m-0">Subscribers</h2>
          </div>

          {/* Table for large screens */}
          <div className="px-3">
            <div className="table-responsive d-none d-md-block">
              <table className="table table-striped table-hover shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Id</th>
                    <th scope="col">Subscription Date</th>
                    <th scope="col"> Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          {new Date(user.subscribed_at).toLocaleDateString()}
                        </td>

                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Subscriber applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards for mobile view */}
            <div className="d-md-none">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <div className="card-text">
                        <p className="mb-2">
                          <strong>Date Of Subscription:</strong>{" "}
                          {new Date(user.subscribed_at).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                          <strong>Email:</strong> {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info" role="alert">
                  No Subscriber applications found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashSubscribers;

