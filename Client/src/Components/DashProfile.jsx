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

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const filePickerRef = useRef();

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
        <img
          src={imageFileURL || currentUser.image}
          alt="user img"
          className="rounded-circle"
          style={{ width: "100%" }}
          onClick={() => filePickerRef.current.click()}
        />
        {uploadProgress && <p>{`Uploading... ${uploadProgress}%`}</p>}
        {uploadError && <p className="text-danger">{uploadError}</p>}
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
