import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../../firebase";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const googleSignin = () => {
    signInWithRedirect(auth, googleProvider)
      .then((data) => {
        console.log(data.user);
        // window.close();
        // const isNewUser = data.additionalUserInfo.isNewUser; // checks whether a google user is new
        // console.log("New user state");
        // console.log(isNewUser);

        // if (!isNewUser) {
        //   window.location.href = "/home";
        // } else {
        //   const externalSignup = document.querySelector(".external-signup-box");
        //   localStorage.setItem("googleSignup", JSON.stringify(externalSignup));
        //   window.location.href = "/signup";
        // }
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  const handleLogin = async () => {
    document.querySelector(".login-message").style.display = "block";
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      document.querySelector(".login-message").style.display = "none";
      if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found. Please check your email.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address. Please enter a valid email.");
      } else if (error.code === "auth/user-disabled") {
        setErrorMessage(
          "User account is disabled. Contact support for assistance."
        );
      } else if (error.code === "auth/user-token-expired") {
        setErrorMessage("User session has expired. Please sign in again.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many sign-in attempts. Please try again later.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error. Check your internet connection.");
      } else if (error.code === "auth/internal-error") {
        setErrorMessage("Internal error occurred. Please try again later.");
      } else if (error.code === "auth/invalid-api-key") {
        setErrorMessage("Invalid Firebase API key. Check your configuration.");
      } else if (error.code === "auth/invalid-tenant-id") {
        setErrorMessage("Invalid tenant ID. Check your setup.");
      } else if (
        error.code === "auth/operation-not-supported-in-this-environment"
      ) {
        setErrorMessage("Sign-in not supported in this environment.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <p
        className="external-signin-box"
        onClick={() => {
          googleSignin();
        }}
      >
        Continue with Google
      </p>
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>

          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>

        <div>
          <h3 className="login-h3">
            Don't have an account? <Link to="/signup">Signup</Link>
          </h3>
        </div>
        <p className="login-message" style={{ display: "none" }}>
          Signing you in....
        </p>
        <p className="error-message">{errorMessage}</p>
      </div>
    </>
  );
}

export default Login;
