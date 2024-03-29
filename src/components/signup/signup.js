import React, { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";

import key from "./key.png";
import logo from "./cyborg-logo.png";
import { doc, setDoc } from "firebase/firestore";

import { db, auth } from "../../firebase";
import LoadingSign from "../loader/loader";
import "./signup.css";
import toast from "react-hot-toast";

import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

// import { AuthContext } from "../auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const rollNo = useRef("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phone = useRef("");
  const [errorTrigger, setErrorTrigger] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Enter valid details");
  const [isLoading, setIsLoading] = useState(false);
  // const token = useRef("");

  const handleSignup = async () => {
    toast("Creating a user...",{
      duration: Infinity, style: {background: "black", color: "white",},
    });
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const uid = cred.user.uid;
        
        try {
          await setDoc(doc(db, "admin", uid), {
              name: username,
              haskey: false,
              email: email,
              rollNo: rollNo.current,
              phone: phone.current,
            });
          
          await sendEmailVerification(auth.currentUser);
          await signOut(auth);
            

          
          const inputBoxes = document.querySelectorAll(".input-field");
          for (let inputBox of inputBoxes) {
            inputBox.value = "";
          }

          toast.dismiss();
          toast.success("Check Your Email", {
            style: {background: "lightgreen"}
          });

          
        } catch (error) {
          toast.dismiss();
          toast.error(error.code, {
            style: {
              background: "#ffcccc"
            }
          });
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.code, {
          style: {
            background: "#ffcccc"
          }
        });
      });
  };

  return (
    <>
      {isLoading ? <LoadingSign /> : null}
      <main>
        <div>{/* <Toaster position="top-right" reverseOrder={false} /> */}</div>
        <div className="login-box">
          <div className="login-inner-box">
            <div className="login-forms-wrap">
              <div className="login-form">
                <div className="login-logo">
                  <img src={logo} alt="" />
                </div>

                <div className="logo-heading">
                  <h1>New here !</h1>
                  <h6>Already have an account? </h6>
                  <Link to="/login" className="toggle">
                    Login
                  </Link>{" "}
                </div>

                <div className="actual-form">
                  {/* username field  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="text"
                      id="username"
                      placeholder="Name"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value === "") {
                          setErrorMessage("Enter a valid username");
                        }
                      }}
                    />
                  </div>
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="text"
                      id="email"
                      placeholder="Roll no"
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

                  {/* phone number  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="text"
                      id="phone-number"
                      placeholder="Mobile number"
                      onChange={(e) => {
                        phone.current = e.target.value;
                        const regexValid = /^[0-9]{10}/;
                        setErrorTrigger(regexValid.test(phone.current));

                        if (regexValid.test(phone.current) == false) {
                          setErrorMessage("Enter valid phone no");
                        } else {
                          setErrorMessage("Please check all fields");
                        }
                      }}
                      maxLength="10"
                      minLength="10"
                    />
                  </div>

                  {/* passord field  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Sign up"
                    id="normal-sign-up-btn"
                    className="login-button sign-btn"
                    onClick={() => {
                      const usernameRequired =
                        document.querySelector("#username");
                      const passwordRequired =
                        document.querySelector("#password");
                      const phonenumberrequired =
                        document.querySelector("#phone-number");
                      // console.log(phonenumberrequired.value);

                      if (
                        usernameRequired.value &&
                        passwordRequired.value &&
                        phonenumberrequired.value &&
                        errorTrigger
                      ) {
                        // console.log(email);
                        handleSignup();
                      } else {
                        toast.error(errorMessage);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="carousel">
              <div className="heading">
                <h2>Looking for keys ?</h2>
              </div>
              <div className="body">
                <h3>Find out where they are</h3>
              </div>
              <div className="key-img">
                <img src={key} alt="" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
