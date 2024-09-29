import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./DashProfile.css";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const filePickerRef = useRef();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (uploadError) {
      setShowAlert(true);
      // Set a timeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3 seconds

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  // Handle image file change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size exceeds 2MB.");
        return;
      }
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file)); // Preview the image
    }
  };

  // Upload image to Firebase storage
  const uploadImageFile = async () => {
    if (!imageFile) return;

    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0)); // Update progress as a percentage
      },
      (error) => {
        setUploadError("Failed to upload (image must be below 2MB)");
        setImageFile(null);
        setImageFileURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL); // Update state with download URL
          setUploadProgress(null); // Reset upload progress after completion
        });
      }
    );
  };

  // Trigger image upload when a new file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImageFile();
    }
    return () => {
      setImageFile(null); // Clean up file when component unmounts
    };
  }, [imageFile]);

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="text-center">Profile</h3>
      <div style={{ width: "100px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="d-none"
        />
        <div
          className="rounded-circle"
          style={{
            position: "relative", // Positioning for overlay
            width: "100px",
            height: "100px",
            overflow: "hidden",
            borderRadius: "50%",
          }}
        >
          {/* Display CircularProgressbar if uploadProgress exists */}
          {uploadProgress && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1, // Ensure it's on top of the image
              }}
            >
              <CircularProgressbar
                value={uploadProgress || 0}
                text={`${uploadProgress}%`}
                strokeWidth={5} // Correct strokeWidth usage
                styles={{
                  // Dynamically adjust the path opacity based on uploadProgress
                  path: {
                    stroke: `rgba(62, 152, 199, ${uploadProgress / 100})`, // Vary opacity
                  },
                  text: {
                    fill: "#f88",
                    fontSize: "20px",
                  },
                }}
              />
            </div>
          )}

          {/* Image */}
          <img
            src={imageFileURL || currentUser.image}
            alt="user img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => filePickerRef.current.click()}
          />
        </div>

        {/* {uploadProgress && <p>{`Uploading... ${uploadProgress}%`}</p>} */}
        {/* {uploadError && <p className="text-danger">{uploadError}</p>} */}
        <div>
          {/* Alert message */}
          {showAlert && (
            <div className="alert alert-danger fade show alert-dismissible">
              <strong>{uploadError}</strong>
            </div>
          )}
        </div>
      </div>
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            defaultValue={currentUser.username}
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={currentUser.email}
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="**********"
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <button type="submit" className="btn btn-outline-primary mb-3">
          Update Profile
        </button>
        <div className="d-flex justify-content-between">
          <div className="mx-5">
            <Link to="#" className="text-decoration-none text-warning">
              Change Password
            </Link>
          </div>
          <div>
            <Link to="#" className="text-decoration-none text-danger">
              Delete Account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DashProfile;
