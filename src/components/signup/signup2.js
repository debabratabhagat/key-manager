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
      <main>
        <div className="signup-box">
          <div className="signup-inner-box">
            <div className="signup-forms-wrap">
              <div className="signup-form">
                <div className="signup-logo">
                  <img src={logo} alt="1" />
                </div>

                <div className="signup-heading">
                  <h2>New here</h2>
                  <h6>Already have and account?</h6>
                  <Link to="/login" className="toggle">
                    login
                  </Link>
                </div>
                
                <div className="other-links">
                  {/* google login  */}
                  <div className="other-links-google">
                    <svg
                      className="external-signin-box  "
                      onClick={() => {
                        signInWithRedirect(auth, googleProvider);
                      }}
                      width="42px"
                      height="42px"
                      viewBox="0 -0.5 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.78353 7.74971C10.1976 7.73814 10.5239 7.39311 10.5123 6.97906C10.5007 6.565 10.1557 6.23873 9.74164 6.25029L9.78353 7.74971ZM5.50158 11.5L6.25132 11.52C6.25167 11.5067 6.25167 11.4933 6.25132 11.48L5.50158 11.5ZM9.76258 16L9.74164 16.7497C9.7556 16.7501 9.76957 16.7501 9.78353 16.7497L9.76258 16ZM14.0236 11.5L14.7733 11.48C14.7625 11.0737 14.43 10.75 14.0236 10.75V11.5ZM9.76258 10.75C9.34837 10.75 9.01258 11.0858 9.01258 11.5C9.01258 11.9142 9.34837 12.25 9.76258 12.25V10.75ZM19.3276 9.679C19.7418 9.679 20.0776 9.34321 20.0776 8.929C20.0776 8.51479 19.7418 8.179 19.3276 8.179V9.679ZM17.5016 8.179C17.0874 8.179 16.7516 8.51479 16.7516 8.929C16.7516 9.34321 17.0874 9.679 17.5016 9.679V8.179ZM17.5016 9.679C17.9158 9.679 18.2516 9.34321 18.2516 8.929C18.2516 8.51479 17.9158 8.179 17.5016 8.179V9.679ZM15.6756 8.179C15.2614 8.179 14.9256 8.51479 14.9256 8.929C14.9256 9.34321 15.2614 9.679 15.6756 9.679V8.179ZM16.7516 8.929C16.7516 9.34321 17.0874 9.679 17.5016 9.679C17.9158 9.679 18.2516 9.34321 18.2516 8.929H16.7516ZM18.2516 7C18.2516 6.58579 17.9158 6.25 17.5016 6.25C17.0874 6.25 16.7516 6.58579 16.7516 7H18.2516ZM18.2516 8.929C18.2516 8.51479 17.9158 8.179 17.5016 8.179C17.0874 8.179 16.7516 8.51479 16.7516 8.929H18.2516ZM16.7516 10.857C16.7516 11.2712 17.0874 11.607 17.5016 11.607C17.9158 11.607 18.2516 11.2712 18.2516 10.857H16.7516ZM9.74164 6.25029C6.90939 6.32941 4.67644 8.68761 4.75185 11.52L6.25132 11.48C6.19794 9.47505 7.77861 7.80571 9.78353 7.74971L9.74164 6.25029ZM4.75185 11.48C4.67644 14.3124 6.90939 16.6706 9.74164 16.7497L9.78353 15.2503C7.77861 15.1943 6.19794 13.5249 6.25132 11.52L4.75185 11.48ZM9.78353 16.7497C12.6158 16.6706 14.8487 14.3124 14.7733 11.48L13.2738 11.52C13.3272 13.5249 11.7466 15.1943 9.74164 15.2503L9.78353 16.7497ZM14.0236 10.75H9.76258V12.25H14.0236V10.75ZM19.3276 8.179H17.5016V9.679H19.3276V8.179ZM17.5016 8.179H15.6756V9.679H17.5016V8.179ZM18.2516 8.929V7H16.7516V8.929H18.2516ZM16.7516 8.929V10.857H18.2516V8.929H16.7516Z"
                        fill="#000000"
                      />
                    </svg>
                  </div>

                  {/* microsoft login  */}
                  <div className="other-links-microsoft">
                    <svg
                      className="external-signup-box"
                      onClick={() => {
                        signInWithRedirect(auth, microsoftProvider);
                      }}
                      width="39px"
                      height="39px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H11.5V11.5H4V4ZM12.5 4H20V11.5H12.5V4ZM4 12.5H11.5V20H4V12.5ZM12.5 12.5H20V20H12.5V12.5Z"
                        fill="#000000"
                      />
                    </svg>
                  </div>
                </div>

                <form action="submit" class="sign-up-form" autocomplete="off">
                  <div class="logo">
                    <img src="Logo.svg" alt="image-here" />
                    <h4>Cyborg</h4>
                  </div>

                  <div class="heading">
                    <h2>New Here !!</h2>
                    <h6>Already have an account?</h6>
                    <a href="#" class="toggle">
                      SignIN
                    </a>
                  </div>

                  <div class="actual-form">
                    <div class="input-wrap">
                      <input type="text" class="input-field" id="name" />
                      <label for="name">name</label>
                    </div>

                    <div class="input-wrap">
                      <input type="email" class="input-field" id="email" />
                      <label for="email">email</label>
                    </div>

                    <div class="input-wrap">
                      <input type="text" class="input-field" id="pass" />
                      <label for="pass">password</label>
                    </div>
                    <input type="submit" value="Sign UP" class="sign-btn" />
                  </div>
                </form>

                <div className="actual-form">
                  <div className="input-wrap">
                    {/* email input for login  */}
                    <input
                      className="input-field"
                      placeholder="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <label className="email">email</label> */}
                  </div>

                  {/* password input for login  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <label className="pass">password</label> */}
                  </div>
                  <input
                    type="submit"
                    value="Sign IN"
                    className="login-button sign-btn"
                    onClick={handleLogin}
                  />
                </div>
                <div className="error-box">
                  <p className="login-message" style={{ display: "none" }}>
                    Signing you in....
                  </p>
                  <p className="error-message">{errorMessage}</p>
                </div>
              </div>
            </div>

            {/* side page for information  */}

            <div className="carousel">
              <div className="heading">
                <h2>Looking for keys ???</h2>
              </div>
              <div className="body">
                <h3>Find out where they are</h3>
              </div>
              <div className="key-img">{/* key svg  */}</div>
            </div>
          </div>
        </div>
      </main>
      <p className="login-message" style={{ display: "none" }}>
        Signing you in....
      </p>
      <p className="error-message">{errorMessage}</p>

      {/* <p
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
      </div> */}
    </>
  );
}
