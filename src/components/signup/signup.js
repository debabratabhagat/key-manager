import React, { useState, useContext } from "react";
import { db, auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../auth";
import "./signup.css";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const user = useContext(AuthContext);

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then( async (cred) => {
         
        await setDoc(doc(db, "users", cred.user.uid), {
          name: username,
          haskey: false,
          email: email,
          phone: phone
        });
        window.location.href = "/home";

      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Email is already in use.");
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("Invalid email format.");
        } else if (error.code === "auth/operation-not-allowed") {
          setErrorMessage("Operation not allowed.");
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("Password is too weak.");
        } else if (error.code === "auth/network-request-failed") {
          setErrorMessage(
            "Network request failed. Check your internet connection."
          );
        } else if (error.code === "auth/too-many-requests") {
          setErrorMessage("Too many requests. Please try again later.");
        } else if (error.code === "auth/user-disabled") {
          setErrorMessage("User account is disabled.");
        } else if (error.code === "auth/user-token-expired") {
          setErrorMessage("User token has expired.");
        } else if (error.code === "auth/app-not-authorized") {
          setErrorMessage(
            "App is not authorized to use Firebase Authentication."
          );
        } else if (error.code === "auth/internal-error") {
          setErrorMessage("Internal Firebase Authentication error.");
        } else if (error.code === "auth/missing-continue-uri") {
          setErrorMessage("Missing continue URI.");
        } else if (error.code === "auth/invalid-action-code") {
          setErrorMessage("Invalid action code.");
        } else if (error.code === "auth/expired-action-code") {
          setErrorMessage("Expired action code.");
        } else {
          setErrorMessage("An unknown error occurred:", error);
        }
      });
  };


  return (
    <div className="signup-container">
      <div className="signup-box">
        {" "}
        <h1>Sign Up</h1>
        <input
          className="input-field"
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          id="phone-number"
          placeholder="Enter your mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSignup} className="signup-button">
          Submit
        </button>
      </div>

      <div>
        <h3 className="signup-h3">
          Already have an account? <Link to="/">Login</Link>
        </h3>
      </div>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
}


