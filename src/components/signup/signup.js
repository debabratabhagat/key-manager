import React, { useState, useRef, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { AuthContext } from "../auth";
import { db, auth, googleProvider, microsoftProvider } from "../../firebase";
import "./signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phone = useRef("");
  const [errorMessage, setErrorMessage] = useState("");

  console.log("         inside signup component");

  /*###### GETTING REDIRECT RESULT AND UPLOADING NEW USER DOCS, if user is new to firebase #######*/
  useEffect(() => {
    const func = async function () {
      console.log("in 1");
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      console.log(userDoc.data());
      if (userDoc.data()) {
        // if user is not new redirect to home page
        console.log("in 2");
        window.location.href = "/home";
      } else {
        //else creating its document
        console.log("in 3");
        setEmail(auth.currentUser.email);
        const loginRedirectionLink = document.querySelector(".signup-h3");
        loginRedirectionLink.style.display = "none";
        const externalSignup = document.querySelector(".external-signup-box");
        externalSignup.style.display = "none"; // disabling external signup options
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        emailInput.disabled = true;
        passwordInput.style.display = "none";
      }
    };
    if (auth.currentUser) {
      func();
    }
  }, []);

  const handleSignup = () => {
    const signupMessage = document.querySelector(".signup-message");
    signupMessage.innerText = "Creating your account....";
    signupMessage.style.color = "green";
    signupMessage.style.display = "block";

    if (!auth.currentUser) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (cred) => {
          await setDoc(doc(db, "users", cred.user.uid), {
            name: username,
            haskey: false,
            email: email,
            phone: phone.current,
          });
          window.location.href = "/home";
        })
        .catch((error) => {
          document.querySelector(".signup-message").style.display = "none";
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
    } else {
      const uploadDoc = async () => {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          name: username,
          haskey: false,
          email: email,
          phone: phone.current,
        });
        window.location.href = "/home";
      };
      uploadDoc();
    }
  };

  return (
    <>
      <p
        className="external-signup-box"
        onClick={() => {
          signInWithRedirect(auth, googleProvider);
        }}
      >
        Sign up with Google
      </p>
      <p
        className="external-signup-box"
        onClick={() => {
          signInWithRedirect(auth, microsoftProvider);
        }}
      >
        Sign up with Microsoft
      </p>
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
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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
            type="text"
            id="phone-number"
            placeholder="Enter your mobile number"
            onChange={(e) => {
              phone.current = e.target.value;
              const signupMessage = document.querySelector(".signup-message");
              let foundbreak = false;
              for (let chr of phone.current) {
                if (isNaN(chr)) {
                  signupMessage.innerText = "Enter a valid phone number";
                  signupMessage.style.display = "block";
                  signupMessage.style.color = "red";
                  foundbreak = true;
                  break;
                }
              }
              if (!foundbreak) {
                document.querySelector(".signup-message").style.display =
                  "none";
              }
            }}
            maxLength="10"
            minLength="10"
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
        <p className="signup-message" style={{ display: "none" }}></p>
        <p className="error-message">{errorMessage}</p>
      </div>
    </>
  );
}
