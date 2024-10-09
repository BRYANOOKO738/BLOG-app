import React,{useState,useEffect} from 'react'
import { useSelector } from "react-redux";
import "./Table.css"
import { Link } from 'react-router-dom';
const Dashpost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [post, setPost] = useState([]);
  console.log(post);
  useEffect(() => {
    const fetchpost = async() => {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?author_id=${currentUser.id}`
        );
        const data = await res.json();
        if (res.ok) {          
          setPost(data.posts);
        }        
        // console.log(data);
      } catch (error) {
        console.log(error)
      }
    }
    if (currentUser.isAdmin) {
      fetchpost();
    }
  }, [currentUser.id])
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div
      className={`container ${theme === "dark" ? "bg-secondary" : "bg-white"}`}
      
    >
      {/* Table for large screens */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date Updated</th>
              <th>Post Image</th>
              <th>Post Title</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {post.map((post) => (
              <tr key={post.id} >
                <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="img-fluid rounded"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/post/${post.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {post.title}
                  </Link>
                </td>
                <td>{post.category}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Edit</button>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="d-md-none" style={{ position: "relative" }}>
        {post.map((post) => (
          <div key={post.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                <Link
                  to={`/post/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {post.title}
                </Link>{" "}
              </h5>
              <Link to={`/post/${post.slug}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid mb-3 rounded"
                  style={{ height: "230px" }}
                />
              </Link>
              <p>
                <strong>Date Updated:</strong>{" "}
                {new Date(post.updated_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Category:</strong>
                {post.category}
              </p>
              <div className="d-flex justify-content-between">
                <Link
                  to={`/update-post/${post.id}`}
                  className="btn btn-primary btn-sm "
                >
                  Edit
                </Link>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashpost