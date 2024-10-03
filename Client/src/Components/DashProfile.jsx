import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  SignoutSuccess
} from "../redux/user/userSlice";
import { app } from "../Firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./DashProfile.css";

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
            <h5 className="modal-title text-danger">Delete Account</h5>
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
            <strong>Are you sure you want to delete your account?</strong>
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

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    image: currentUser.image,
  });

  useEffect(() => {
    if (uploadError) {
      setErrorMessage(uploadError);
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size exceeds 2MB.");
        return;
      }
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

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
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadError("Failed to upload (image must be below 2MB)");
        setImageFile(null);
        setImageFileURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setUploadProgress(null);
          setFormData((prevData) => ({ ...prevData, image: downloadURL }));
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(formData).some(
      (key) =>
        (key !== "password" && formData[key] !== currentUser[key]) ||
        (key === "password" && formData[key] !== "")
    );

    if (!hasChanges) {
      setErrorMessage("No changes to update.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    const dataToUpdate = Object.keys(formData).reduce((acc, key) => {
      if (key !== "password" && formData[key] !== currentUser[key]) {
        acc[key] = formData[key];
      } else if (key === "password" && formData[key] !== "") {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    try {
      dispatch(updateStart());
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const res = await fetch(
        `http://localhost:3000/routes/updateuser/update/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToUpdate),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      dispatch(updateSuccess(data));
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFormData((prevData) => ({
        ...prevData,
        ...data.user,
        password: "",
      }));
      navigate("/Login");
    } catch (error) {
      dispatch(updateFailure(error.toString()));
      setErrorMessage(error.toString());
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);

    try {
      dispatch(deleteStart());

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(
        `http://localhost:3000/routes/updateuser/delete/${currentUser.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear user data from local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Dispatch success action
      dispatch(deleteSuccess());

      // Show success message
      setSuccessMessage("Your account has been successfully deleted.");

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      dispatch(deleteFailure(error.toString()));
      setErrorMessage(error.toString());

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImageFile();
    }
  }, [imageFile]);

 const handleSignout = async () => {
   try {   
     localStorage.removeItem("access_token");
     localStorage.removeItem("user");
     dispatch(SignoutSuccess());
     const res = await fetch(
       "http://localhost:3000/routes/updateuser/Signout",
       {
         method: "POST"         
       }
       
     );

     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || "Failed to sign out");
     }     
     navigate("/Login");

     console.log("Signed out successfully");
   } catch (error) {
     console.error("Sign-out error:", error.message);
     dispatch(signoutFailure(error.message));
   }
 };

  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="text-center mb-4">Profile</h3>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="w-100 max-w-md">
        <div className="d-flex justify-content-center mb-4">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "120px",
              height: "120px",
              overflow: "hidden",
              position: "relative",
              border: "3px solid #007bff",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              className="d-none"
            />
            {uploadProgress !== null && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                  styles={{
                    root: { width: "80px" },
                    path: { stroke: "#007bff" },
                    text: { fill: "#007bff", fontSize: "24px" },
                  }}
                />
              </div>
            )}
            <img
              src={imageFileURL || formData.image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => filePickerRef.current.click()}
              onError={(e) => {
                e.target.src =
                  "https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png";
              }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formData.username}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={handleChange}
            placeholder="********"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Update Profile
        </button>
        <div className="d-flex justify-content-between">
          <div onClick={() => setShowModal(true)}>
            <Link to="#" className="text-decoration-none text-danger">
              Delete Account
            </Link>
          </div>
          <div className="mx-5">
            <Link
              to="#"
              className="text-decoration-none text-warning"
              onClick={handleSignout}
            >
              Sign out
            </Link>
          </div>
        </div>
      </form>
      <SimpleModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default DashProfile;
