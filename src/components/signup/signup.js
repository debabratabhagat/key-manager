import React, { useState, useRef, useContext } from "react";
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
import { AuthContext } from "../auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const rollNo = useRef("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phone = useRef("");
  const [errorTrigger, setErrorTrigger] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Enter valid details");
  const [isLoading, setIsLoading] = useState(false);

  const [currentUser, unsubscribe] = useContext(AuthContext);

  const handleSignup = async () => {
    // console.log(email);
    // console.log(typeof email);
    console.log("inside handlesignup function...");
    unsubscribe();
    console.log("unsubscribed from listening...");
    const createUser = createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {})
       /* try {
          const uploadingDoc = setDoc(doc(db, "admin", cred.user.uid), {
            name: username,
            haskey: false,
            email: email,
            rollNo: rollNo.current,
            phone: phone.current,
          });

          // console.log("setdoc started");
          await uploadingDoc();
          // console.log("setDoc ended");

          toast.promise(uploadingDoc, {
            loading: "uploading doc to firebase database...",
            success: "Doc uploaded successfully",
            error: (error) => {
              toast.dismiss();
              switch (error.code) {
                case "permission-denied":
                  return "Permission Denied: Check Firestore Security Rules";
                case "unavailable":
                  return "Network Error: Check your internet connection";
                case "invalid-argument":
                  return "Invalid Data Format: Check your data format";
                case "already-exists":
                  return "Document Already Exists: Use a unique document ID";
                case "resource-exhausted":
                  return "Rate Limit Exceeded: Implement rate limiting";
                case "unauthenticated":
                  return "Authentication Error: User is not authenticated";
                case "quota-exceeded":
                  return "Quota Exceeded: Check your Firebase billing and quotas";
                default:
                  return "An unknown error occurred: ";
              }
            },
          });

          const verifyEmail = Promise.all([
            uploadingDoc(),
            sendEmailVerification(auth.currentUser),
            signOut(auth),
          ]);
          await verifyEmail();
          toast.promise(verifyEmail, {
            loading: "Wait for a moment",
            success:
              "A verification email has been sent to your mail id , verify your mail within 1 hour to access the app",
            error: (error) => {
              return error;
            },
          });
        } catch (error) {
          // console.log(error);
        }
      })
      .catch((error) => {
        // console.log(`error in creating user: ${error}`);
      });
    // createUser();
    toast.promise(createUser, {
      loading: "creating user.....",
      success: "a user has been created",
      error: (error) => {
        return `error in creating user: ${error}`;
      },
    });
    const inputBoxes = document.querySelectorAll("input");
    for (let inputBox of inputBoxes) {
      inputBox.value = "";
    }*/
    /*try {
      await toast.promise(
        createUserWithEmailAndPassword(auth, email, password).then(
          async (cred) => {
            await toast.promise(
              setDoc(doc(db, "users", cred.user.uid), {
                name: username,
                haskey: false,
                email: email,
                phone: phone.current,
              }),
              {
                loading: "uploading doc to firebase database...",
                success: "Doc uploaded successfully",
                error: (error) => {
                  toast.dismiss();
                  switch (error.code) {
                    case "permission-denied":
                      return "Permission Denied: Check Firestore Security Rules";
                    case "unavailable":
                      return "Network Error: Check your internet connection";
                    case "invalid-argument":
                      return "Invalid Data Format: Check your data format";
                    case "already-exists":
                      return "Document Already Exists: Use a unique document ID";
                    case "resource-exhausted":
                      return "Rate Limit Exceeded: Implement rate limiting";
                    case "unauthenticated":
                      return "Authentication Error: User is not authenticated";
                    case "quota-exceeded":
                      return "Quota Exceeded: Check your Firebase billing and quotas";
                    default:
                      return "An unknown error occurred: ", error;
                  }
                },
              }
            );

            window.location.href = "/home";
          }
        ),
        {
          loading: "Creating your account....", // Loading message (optional)
          success: "Successfully created your account", // Displayed on successful login
          error: (error) => {
            toast.dismiss();
            // Customize error messages based on error code
            switch (error.code) {
              case "auth/email-already-in-use":
                return "Email is already in use.";
              case "auth/invalid-email":
                return "Invalid email format.";
              case "auth/missing-password":
                return "Oops you missed the password field";
              case "auth/operation-not-allowed":
                return "Operation not allowed.";
              case "auth/weak-password":
                return "Password is too weak.";
              case "auth/network-request-failed":
                return "Network request failed. Check your internet connection.";
              case "auth/too-many-requests":
                return "Too many requests. Please try again later.";
              case "auth/user-disabled":
                return "User account is disabled.";
              case "auth/user-token-expired":
                return "User token has expired.";
              case "auth/app-not-authorized":
                return "App is not authorized to use Firebase Authentication.";
              case "auth/internal-error":
                return "Internal Firebase Authentication error.";
              case "auth/missing-continue-uri":
                return "Missing continue URI.";
              case "auth/invalid-action-code":
                return "Invalid action code.";
              case "auth/expired-action-code":
                return "Expired action code.";
              default:
                return "An error occurred. Please try again.";
            }
          },
        }
      );
    } catch (error) {}*/
  };

  const possibleErrorsOnRedirectingSignup = (error) => {
    if (error.code === "auth/redirect-cancelled-by-user") {
      toast.error("Authentication cancelled by the user.");
    } else if (error.code === "auth/popup-blocked") {
      toast.error("Popup blocked by the browser.");
    } else if (error.code === "auth/popup-closed-by-user") {
      toast.error("Popup closed by the user.");
    } else if (error.code === "auth/unauthorized-domain") {
      toast.error("Unauthorized domain. Add the domain to Firebase Console.");
    } else if (
      error.code === "auth/operation-not-supported-in-this-environment"
    ) {
      toast.error("Operation not supported in this environment.");
    } else if (error.code === "auth/credential-already-in-use") {
      toast.error(
        "Credential already in use. The account is linked to another Firebase account."
      );
    } else if (error.code === "auth/email-already-in-use") {
      toast.error("Email address is already in use.");
    } else if (error.code === "auth/user-disabled") {
      toast.error("User account is disabled.");
    } else if (error.code === "auth/user-not-found") {
      toast.error("User not found.");
    } else if (error.code === "auth/invalid-credential") {
      toast.error(
        "Invalid credential. The credential provided is invalid or has expired."
      );
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid email address.");
    } else if (error.code === "auth/invalid-verification-code") {
      toast.error("Invalid verification code.");
    } else if (error.code === "auth/invalid-verification-id") {
      toast.error("Invalid verification ID.");
    } else if (error.code === "auth/missing-verification-code") {
      toast.error("Missing verification code.");
    } else if (error.code === "auth/network-request-failed") {
      toast.error(
        "Network request failed. Please check your internet connection."
      );
    } else if (error.code === "auth/captcha-check-failed") {
      toast.error("CAPTCHA verification failed.");
    } else if (error.code === "auth/too-many-requests") {
      toast.error("Too many sign-in attempts. Try again later.");
    } else if (error.code === "auth/web-storage-unsupported") {
      toast.error("Web storage is not supported in this browser.");
    } else if (error.code === "auth/operation-not-allowed") {
      toast.error("Authentication operation not allowed.");
    } else {
      toast.error("An unexpected error occurred:", error);
    }
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
                  <h2>New Here !!</h2>
                  <h6>Already have an account? </h6>
                  <Link to="/login" className="toggle">
                    Login
                  </Link>{" "}
                </div>
                {/* <div className="other-links">
                  <div
                    className="other-links-google"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        googleProvider.addScope(
                          "https://www.googleapis.com/auth/user.phonenumbers.read"
                        );
                        await signInWithRedirect(auth, googleProvider);
                      } catch (error) {
                        possibleErrorsOnRedirectingSignup(error);
                      }
                    }}
                  >
                    <svg
                      className="external-signup-box google"
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
                    <p className="continue-google"> google-login </p>
                  </div>
                </div> */}

                <div className="actual-form">
                  {/* username field  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="text"
                      id="username"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value === "") {
                          setErrorMessage("Enter a valid username");
                        }
                      }}
                    />
                  </div>
                  {/* email field  */}
                  {/* <div className="input-wrap">
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
                  </div> */}
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

                  {/* phone number  */}
                  <div className="input-wrap">
                    <input
                      className="input-field"
                      type="text"
                      id="phone-number"
                      placeholder="Enter your mobile number"
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
                      placeholder="Enter your password"
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
                      if (
                        usernameRequired.value &&
                        passwordRequired.value &&
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

                {/* <div className="error-box">
                  <p className="message" style={{ display: "none" }}>
                    Signing you in....
                  </p>
                  <p className="error-message">{errorMessage}</p>
                </div> */}
              </div>
            </div>

            <div className="carousel">
              <div className="heading">
                <h2>Looking for keys ???</h2>
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
