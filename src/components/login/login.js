import React, { useRef, useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
// import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

// import { db } from "../../firebase";
import logo from "./cyborg-logo.png";
import key from "../signup/key.png";
import toast from "react-hot-toast";
import { auth } from "../../firebase";
import { AuthContext } from "../auth";
// import PasswordReset from "./resetpassword";f
import "./login.css";

function Login() {
  const rollNo = useRef("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorTrigger, setErrorTrigger] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Enter valid details");

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      if (currentUser === "Email verification pending...") {
        toast.dismiss();
        await signOut(auth);
        toast.error("Verify Your Email", {
          style: {
            background: "#ffcccc",
          },
        });
      } else if (currentUser === "App access pending...") {
        toast.dismiss();
        await signOut(auth);
        toast.error("Access pending", {
          style: {
            background: "#ffcccc",
          },
        });
      } else if (currentUser === "App access declined...") {
        toast.dismiss();
        await signOut(auth);
        toast.error("User declined", {
          style: {
            background: "#ffcccc"
          }
        })
      } else {
      }
      const inputBoxes = document.querySelectorAll(".input-field");
      for (let inputBox of inputBoxes) {
        inputBox.value = "";
      }
    };
    if (currentUser !== "null") {
      func();
    }
  }, [auth.currentUser]);

  // new toast promise here

  const handleLogin = async () => {
    try {
      await toast.promise(
        signInWithEmailAndPassword(auth, email, password),
        {
          loading: "Logging in...", // Loading message (optional)
          success: "Logged in successfully!", // Displayed on successful login
          error: (error) => {
            toast.dismiss();
            // Customize error messages based on error code
            switch (error.code) {
              case "auth/user-not-found":
                return "User not found";
              case "auth/wrong-password":
                return "Incorrect password";
              case "auth/invalid-email":
                return "Invalid RollNo. Please enter a RollNo.";
              case "auth/user-disabled":
                return "User account is disabled";
              case "auth/user-token-expired":
                return "User session has expired";
              case "auth/too-many-requests":
                return "Too many sign-in attempts. Please try again later.";
              case "auth/network-request-failed":
                return "Network error. Check your internet connection.";
              case "auth/internal-error":
                return "Internal error occurred. Please try again later.";
              case "auth/invalid-api-key":
                return "Invalid Firebase API key. Check your configuration.";
              case "auth/invalid-tenant-id":
                return "Invalid tenant ID. Check your setup.";
              case "auth/operation-not-supported-in-this-environment":
                return "Sign-in not supported in this environment.";
              default:
                return "An error occurred. Please try again.";
            }
          },
        },
        {
          loading: {
            style: {
              background: "black",
              color: "white",
            },
          },
          success: {
            style: {
              background: "lightgreen",
            },
          },
          error: {
            style: { background: "#ffcccc" },
          },
        }
      );
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <main>
        <div className="login-box">
          <div className="login-inner-box">
            <div className="login-forms-wrap">
              <div className="login-form">
                <div className="login-logo">
                  <img src={logo} alt="1" />
                </div>

                <div className="logo-heading">
                  <h2>WELCOME BACK</h2>
                  <h6>Not registered yet? </h6>
                  <Link to="/signup" className="toggle">
                    Signup
                  </Link>
                </div>

                <div className="actual-form">
                  <div className="input-wrap">
                    {/* email input for login  */}
                    <div className="input-wrap">
                      <input
                        className="input-field"
                        type="text"
                        id="email"
                        placeholder="Enter your Roll No"
                        onChange={(e) => {
                          rollNo.current = e.target.value;
                          const regexValid = /^\d{3}[a-zA-Z]{2}\d{4}$/;
                          setEmail(rollNo.current + "@nitrkl.ac.in");
                          setErrorTrigger(regexValid.test(rollNo.current));
                          if (regexValid.test(rollNo.current) == false) {
                            setErrorMessage("Enter valid Roll no");
                          } else {
                            setErrorMessage("Please check all fields");
                          }
                        }}
                        maxLength="9"
                        minLength="9"
                      />
                    </div>
                    {/* <label className="email">email</label> */}
                  </div>

                  {/* password input for login  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="password"
                      id="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    {/* <label className="pass">password</label> */}
                  </div>
                  <div className="login-page-forgot-password-container">
                    {/* <a className="login-page-forgot-password">
                      forgot password ?
                    </a> */}
                    <Link
                      to="/resetPassword"
                      className="login-page-forgot-password"
                    >
                      forgot password ?
                    </Link>
                  </div>
                  <input
                    type="submit"
                    value="Sign IN"
                    className="login-button sign-btn"
                    onClick={() => {
                      if (errorTrigger && document.querySelector("#password")) {
                        handleLogin();
                      } else {
                        toast.error(errorMessage);
                      }
                    }}
                  />
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
              <div className="key-img">
                <img src={key} alt="image-here" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
