import React, { useState } from "react";
import "../Components/Create_post.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Components/Navbar/Navbar.css";
import { ToastContainer, toast } from "react-toastify";
 import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {app} from "../Firebase";

const Create_post = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

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
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:3000/routes/Publish/Createpost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to create post");
        }

        setSuccessMessage("Post created successfully");
        toast.success("Post created successfully");
        setError(null); // Clear previous errors
        setImageUpload(null);
        setImageUploadError(null);
        setFile(null);
        navigate(`/Post/${data.slug}`);
      } else {
        // If the response is not JSON, read it as text
        const text = await res.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Received non-JSON response from server");
      }
    } catch (error) {
      setError(error.message); // Set error message in state
      setSuccessMessage(null); // Clear success message
      console.error("Create post error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="pt-3 px-3 px-md-4">
            <h2 className="text-center fw-bold mb-4">Create a post</h2>
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
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    
                  >
                    <option value="" disabled selected>
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
                        onClick={handleImageUpload} // Attach image upload logic here
                        disabled={imageUpload > 0 && imageUpload < 100}
                      >
                        {imageUpload ? (
                          <div style={{ width: "55px", height: "55px" }}>
                            <CircularProgressbar
                              value={imageUpload}
                              text={`${imageUpload}%`}
                              styles={{
                                path: { stroke: "#4db8ff" }, // Customize stroke color if needed
                                text: { fontSize: "10px", fill: "#4db8ff" }, // Customize text style if needed
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
                      style={{ Width: "100%", maxHeight: "200px" }}
                      className="w-100%"
                    />
                  </div>
                )}
                <div style={{ position: "relative", height: "230px" }}>
                  <ReactQuill
                    theme="snow"
                    className="mb-1 h-50"
                    placeholder="Write something..."
                    required
                    onChange={(value) =>
                      setFormData({ ...formData, content: value })
                    }
                    // ref={quillRef}
                  />
                </div>
                <div className="d-flex justify-content-center mb-3 ">
                  <button
                    type="submit"
                    className="btn  logo"
                    style={{ width: "40%" }}
                  >
                    Publish Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create_post;
