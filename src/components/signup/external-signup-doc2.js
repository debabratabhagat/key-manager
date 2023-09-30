import React, { useEffect, useRef, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import toast from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";
import "./external-signup-doc.css";
const ExternalSignup = () => {
  const [errorMessage, setErrorMessage] = useState(true);
  const phone = useRef("");

  const UploadExternalSignupDoc = async () => {
    try {
      await toast.promise(
        getRedirectResult(auth).then(async (result) => {
          const user = result.user;
          const phone = document.getElementById("phone-number").value;
          await toast.promise(
            setDoc(doc(db, "users", user.uid), {
              name: user.displayName,
              haskey: false,
              email: user.email,
              phone: phone,
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
                    return `An unknown error occurred: ${error}`;
                }
              },
            }
          );
        }),
        {
          loading: "fetching Redirection Result.....",
          success: "Fetched successfully",
          error: (error) => {
            toast.dismiss();
            switch (error.code) {
              case "auth/popup-closed-by-user":
                return "Authentication popup was closed by the user.";
              case "auth/cancelled-popup-request":
                return "Popup request was cancelled";
              default:
                return `An unknown error occurred: ${error.code} ${error.message}`;
            }
          },
        }
      );
      window.location.href = "/home";
    } catch (error) {}
  };

  return (
    <div className="external-container">
      <div className="external-input-field">
        <div className="external-forms-wrap">
          <h3 className="external-h3">Enter phone number to continue</h3>

          <input
            type="tel"
            id="phone-number"
            name="phone"
            className="phone-input"
            required
            placeholder="Phone Number"
            onChange={(e) => {
              phone.current = e.target.value;
              const regexValid = /^[0-9]{10}/;
              setErrorMessage(regexValid.test(phone.current));
            }}
            maxLength="10"
            minLength="10"
          />

          <button
            className="external-button"
            onClick={() => {
              if (errorMessage) {
                UploadExternalSignupDoc();
              } else {
                toast.error("Username or Phone Number Not entered correctly");
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalSignup;
