import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "./Firebase";
import { useDispatch } from "react-redux";
import { SigninSuccess } from "./redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app); // Get Firebase Auth instance
  const dispatch = useDispatch(); // Get the Redux dispatch function
  const navigate = useNavigate(); // Get the navigate function

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // Optional

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const tokenId = resultFromGoogle._tokenResponse.oauthIdToken; // Use the OAuth ID token

      const res = await fetch("http://localhost:3000/routes/Auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId: tokenId,
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          image: resultFromGoogle.user.photoURL, // Change 'Image' to 'image' for consistency
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(SigninSuccess(data)); // Dispatch action on successful sign-in
        navigate("/"); // Navigate to home page
      } else {
        throw new Error(data.error || "Sign-in failed");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        className="btn btn-outline-warning"
        style={{ width: "300px" }}
        onClick={handleGoogleClick}
      >
        <i className="bi bi-google m-2"></i>
        <span className="ml-1">Continue With Google</span>
      </button>
    </div>
  );
};

export default OAuth;
