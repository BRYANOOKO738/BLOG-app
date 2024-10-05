import React, { useState } from "react";
import "../Components/Create_post.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Components/Navbar/Navbar.css";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
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
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  

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

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="pt-3 px-3 px-md-4">
            <h2 className="text-center fw-bold mb-4">Create a post</h2>
            <form>
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
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select className="form-select" id="category">
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
                          <div style={{ width: "30px", height: "30px" }}>
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
