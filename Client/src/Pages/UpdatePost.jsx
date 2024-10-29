import React, { useState, useEffect } from "react";
import "../Components/Create_post.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Components/Navbar/Navbar.css";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../Firebase";

const UpdatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { postid } = useParams(); // Retrieve post ID from route params
  const [loading, setLoading] = useState(false);
  

  // Fetch the post details using useEffect when postid is available
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?postId=${postid}`
        );       

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch post");
        }

        const data = await res.json();
        console.log(data);

        if (data.posts && data.posts.length > 0) {
          setFormData(data.posts[0]);
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postid) {
      fetchPost();
    }
  }, [postid]); // Dependency on postid

  const handleImageUpload = () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image file");
        return;
      }
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setImageUpload(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Failed to upload");
          setImageUpload(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUpload(null);
            setImageUploadError(null);
            setFormData((prevData) => ({ ...prevData, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      setImageUploadError("Failed to upload");
      setImageUpload(null);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getAuthToken(); // Ensure this returns a valid token
      const res = await fetch(
        `http://localhost:3000/routes/Publish/updatepost/${formData.id}/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token is essential for authentication
          },
          body: JSON.stringify(formData), // Ensure formData contains the necessary data
        }
      );

      // Check if the response is JSON
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update post");
        }

        // Post updated successfully
        setSuccessMessage("Post updated successfully");
        toast.success("Post updated successfully");
        setError(null); // Clear previous errors

        // Navigate to the updated post's page (assuming 'data.slug' is valid)
        navigate(`/Post/${data.slug}`);
      } else {
        // Handle non-JSON response
        const text = await res.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Server returned an invalid response");
      }
    } catch (error) {
      // Handle error
      setError(error.message); // Set error message
      setSuccessMessage(null); // Clear success message
      console.error("Error updating post:", error.message);
      toast.error(error.message);
    }
  };
console.log("Form data before submitting:", formData);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="pt-3 px-3 px-md-4">
            <h2 className="text-center fw-bold mb-4">Update the post</h2>
            {successMessage && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}
            <form onSubmit={handlesubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="" disabled defaultValue>
                      Select the Category
                    </option>
                    <option value="fitness">Fitness</option>
                    <option value="beauty">Beauty</option>
                    <option value="quality">Quality</option>
                  </select>
                </div>
                <div className="col-12">
                  <h4>Upload an image</h4>
                  <div className="border border-2 border-primary p-3 rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="image-upload"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-success ms-2"
                        onClick={handleImageUpload}
                        disabled={imageUpload > 0 && imageUpload < 100}
                      >
                        {imageUpload ? (
                          <div style={{ width: "55px", height: "55px" }}>
                            <CircularProgressbar
                              value={imageUpload}
                              text={`${imageUpload}%`}
                              styles={{
                                path: { stroke: "#4db8ff" },
                                text: { fontSize: "10px", fill: "#4db8ff" },
                              }}
                            />
                          </div>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {formData.image && (
                  <div className="text-center w-100%">
                    <img
                      src={formData.image}
                      alt="Uploaded Image"
                      style={{ width: "100%", maxHeight: "200px" }}
                      className="w-100%"
                    />
                  </div>
                )}
                <div style={{ position: "relative", height: "230px" }}>
                  <label
                    className="form-label mt-3"
                    style={{
                      position: "absolute",
                      top: "-30px",
                      left: "10px",
                      backgroundColor: "#ffffff",
                      padding: "0 10px",
                      fontSize: "14px",
                    }}
                  >
                    Description
                  </label>
                  <ReactQuill
                    className="h-100"
                    id="description"
                    theme="snow"
                    value={formData.content || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                  />
                </div>
                <div className="col-12 mt-4 d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-lg btn-success w-50 m-3 mt-4 logo"
                  >
                    Update post
                  </button>
                </div>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
